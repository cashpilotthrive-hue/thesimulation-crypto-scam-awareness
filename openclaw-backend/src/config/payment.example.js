/**
 * Payment Configuration Example
 * Copy to payment.js and fill in your keys
 */

module.exports.stripe = {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_...',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_...',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...'
};

module.exports.paypal = {
    clientId: process.env.PAYPAL_CLIENT_ID || 'your-client-id',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'your-client-secret',
    mode: process.env.PAYPAL_MODE || 'sandbox'
};

module.exports.crypto = {
    wallets: {
        USDT: { TRC20: 'YOUR_TRC20_ADDRESS', ERC20: 'YOUR_ERC20_ADDRESS', BEP20: 'YOUR_BEP20_ADDRESS' },
        BTC: 'YOUR_BTC_ADDRESS',
        ETH: 'YOUR_ETH_ADDRESS',
        TON: 'YOUR_TON_ADDRESS'
    },
    webhookUrl: process.env.CRYPTO_WEBHOOK_URL || 'https://your-domain.com/api/payments/crypto/webhook',
    confirmations: { BTC: 3, ETH: 12, USDT: 15, TON: 1 }
};

module.exports.plans = {
    free: { name: 'Free', price: 0, features: ['Unlimited bots', 'Unlimited messages', 'All features'] },
    pro: { name: 'Pro', price: 19, interval: 'month', features: ['Everything in Free', 'Priority support', 'Custom domain', 'White-label'] },
    enterprise: { name: 'Enterprise', price: 99, interval: 'month', features: ['Everything in Pro', 'Dedicated server', 'SLA', 'Custom integrations'] }
};