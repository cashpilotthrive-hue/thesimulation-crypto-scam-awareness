/**
 * Bot Manager Service
 */
class BotManager {
    constructor() {
        this.bots = new Map();
    }

    startBot(botId, code, token) {
        if (this.bots.has(botId)) return;
        console.log(`Starting bot ${botId}`);
        this.bots.set(botId, { code, token, startedAt: Date.now() });
    }

    stopBot(botId) {
        console.log(`Stopping bot ${botId}`);
        this.bots.delete(botId);
    }

    isRunning(botId) {
        return this.bots.has(botId);
    }

    getAllBots() {
        return Array.from(this.bots.keys());
    }
}

module.exports = { BotManager };