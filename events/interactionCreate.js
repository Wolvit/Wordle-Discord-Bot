const { logMessage, wrapLog } = require("../utils/logger.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client){
        if(!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if(!command) return;

        const safe = wrapLog(command.execute, interaction.channel.name, client);
        const success = await safe(interaction);
        if(success){
            logMessage(`Příkaz /${interaction.commandName} byl úspěšně zpracován`, interaction.channel.name)
        }
    }
};