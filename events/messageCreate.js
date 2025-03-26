const { wrapLog, logMessage } = require("../utils/logger");


module.exports = {
    name: 'messageCreate',
    async execute(message){
        if(message.channel.id !== process.env.TEST_CHANNEL) return;
        if(message.content !== "/ping") return;
        if(!message.webhookId) return;

        const safe = wrapLog(async()=>{
            await message.channel.send('Žiju');
            logMessage('Self-test proběhl úspěšně!', message.channel.name);
        }, message.channel.name);

        await safe();
    }
};