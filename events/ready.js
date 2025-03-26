const { logMessage, wrapLog } = require('../utils/logger.js');

module.exports = {
    name: 'ready',
    once: true,
    execute: wrapLog(async (client)=>{
        logMessage(`Bot je přihlášen jako ${client.user.tag}`, 'system'), 'system';
    })
};