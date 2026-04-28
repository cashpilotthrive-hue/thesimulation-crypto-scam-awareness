/**
 * Payment Routes
 * Stripe, PayPal, Crypto integrations
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { requireAuth } = require('../middleware/auth');

const payments = new Map();
const invoices = new Map();

// STRIPE
router.post('/stripe/create-checkout', requireAuth, async (req, res) => {
    const { price_id } = req.body;
    const paymentId = 'pay_' + uuidv4().replace(/-/g, '').substring(0, 24);
    const checkoutUrl = `https://checkout.stripe.com/pay/${paymentId}`;
    
    payments.set(paymentId, { id: paymentId, user_id: req.user.id, provider: 'stripe', amount: price_id, status: 'pending', created_at: new Date().toISOString() });
    
    res.json({ checkout_url: checkoutUrl, payment_id: paymentId });
});

router.post('/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    console.log('Stripe webhook received');
    res.json({ received: true });
});

// PAYPAL
router.post('/paypal/create-order', requireAuth, async (req, res) => {
    const { amount, currency = 'USD' } = req.body;
    const orderId = 'ORDER-' + uuidv4().substring(0, 8).toUpperCase();
    
    payments.set(orderId, { id: orderId, user_id: req.user.id, provider: 'paypal', amount, currency, status: 'created', created_at: new Date().toISOString() });
    
    res.json({ order_id: orderId, status: 'CREATED', amount, currency });
});

router.post('/paypal/capture/:orderId', requireAuth, async (req, res) => {
    const { orderId } = req.params;
    const payment = payments.get(orderId);
    
    if (!payment || payment.user_id !== req.user.id) return res.status(404).json({ error: 'Order not found' });
    
    payment.status = 'COMPLETED';
    payment.captured_at = new Date().toISOString();
    payments.set(orderId, payment);
    
    res.json({ order_id: orderId, status: 'COMPLETED' });
});

// CRYPTO
router.post('/crypto/create-invoice', requireAuth, async (req, res) => {
    const { amount, currency = 'USDT', network = 'TRC20' } = req.body;
    const invoiceId = 'INV-' + uuidv4().substring(0, 8).toUpperCase();
    
    const wallets = {
        USDT: { TRC20: 'TXm9J7kP4fZ3qW2vR8yB6nL5cK1jH4sE', ERC20: '0x742d35Cc6634C0532925a3b844Bc9e7595f4fA1E', BEP20: '0x742d35Cc6634C0532925a3b844Bc9e7595f4fA1E' },
        BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f4fA1E',
        TON: 'UQCD3X8cK3Z9qW2vR8yB6nL5cK1jH4sE9xF2gH4iJ6kL8mN0oP'
    };
    
    const invoice = {
        id: invoiceId, user_id: req.user.id, provider: 'crypto', amount, currency, network,
        address: wallets[currency]?.[network] || wallets[currency], status: 'pending',
        created_at: new Date().toISOString(), expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    };
    
    invoices.set(invoiceId, invoice);
    
    res.json({ invoice_id: invoiceId, address: invoice.address, amount, currency, network, expires_at: invoice.expires_at, qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${invoice.address}` });
});

router.get('/crypto/check/:invoiceId', requireAuth, async (req, res) => {
    const { invoiceId } = req.params;
    const invoice = invoices.get(invoiceId);
    
    if (!invoice || invoice.user_id !== req.user.id) return res.status(404).json({ error: 'Invoice not found' });
    
    res.json({ invoice_id: invoiceId, status: invoice.status, confirmations: invoice.status === 'confirmed' ? 3 : 0 });
});

// HISTORY
router.get('/history', requireAuth, (req, res) => {
    const userPayments = Array.from(payments.values()).filter(p => p.user_id === req.user.id);
    res.json({ payments: userPayments });
});

router.get('/invoices', requireAuth, (req, res) => {
    const userInvoices = Array.from(invoices.values()).filter(i => i.user_id === req.user.id);
    res.json({ invoices: userInvoices });
});

router.get('/providers', (req, res) => {
    res.json({
        stripe: { available: true, currencies: ['USD', 'EUR', 'GBP'], methods: ['card'] },
        paypal: { available: true, currencies: ['USD', 'EUR', 'GBP'], methods: ['paypal'] },
        crypto: { available: true, currencies: ['USDT', 'BTC', 'ETH', 'TON'], networks: { USDT: ['TRC20', 'ERC20', 'BEP20'], BTC: ['Bitcoin'], ETH: ['Ethereum'], TON: ['TON'] } }
    });
});

module.exports = router;