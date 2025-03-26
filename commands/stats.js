const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getStats } = require("../src/stats");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Statisky Wordle')
        .addUserOption( option =>
            option.setName('uživatel')
            .setDescription('Koho statistiky si chceš zobrazit?')
            .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName('global')
            .setDescription('Mají to vidět ostatní nebo jen ty?')
            .setRequired(false)
        ),

        async execute(interaction){
            const channel = process.env.STATS_CHANNEL;
            if(interaction.channel.id !== channel){
                interaction.reply({
                    content: `Tento příkaz lze použít pouze v kanálu ${interaction.client.channels.cache.get(channel)}`,
                    flags: 64
                })
            } else 
            {
                const global = interaction.options.getBoolean('global') || false;
                const targetUser = interaction.options.getUser('uživatel') || interaction.user;
                const member = await interaction.guild.members.fetch(targetUser.id);
                const nickname = member.displayName;
                const stats = getStats(targetUser.id);

                const embed = new EmbedBuilder()
                    .setTitle(`Statistiky uživatele ${nickname}`)
                    .addFields(
                        { name: 'Denní režim: ', value: `${stats.today}`, inline: true },
                        { name: 'Náhodný režim: ', value: `${stats.random}`, inline: true }
                    )
                    .setColor(0x3B82F6);


                if (global) {
                    await interaction.reply(
                        { embeds: [embed] }
                    )
                } else {
                    await interaction.reply(
                        {
                            embeds: [embed],
                            flags: 64
                        })
                }
}
                
        } 
}