const { logMessage } = require('../utils/logger');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Odpoví Pong!'),


        async execute(interaction){
            const member = await interaction.guild.members.fetch(interaction.user.id);
            const nickname = member.displayName ||  username

            
            logMessage(`Příkaz přijat: /${interaction.commandName} od ${interaction.user.tag}, přezdívka na serveru ${nickname}`, interaction.channel.name);

            await interaction.reply({content: 'Pong!', flags: 64});            
        },
};