const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");



module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Vypíše příkazy, které lze zadat'),

    async execute(interaction){
        const embed = new EmbedBuilder()
            .setTitle('Seznam příkazů: ')
            .addFields(
                {
                    name: '/guess', 
                    value:
                    `\` slovo \` *(string)* - **povinné** - slovo, které chcete hádat\n`+
                    `\` mode \` *(string)* - **nepovinné** - Denní slovo \` today \` / Náhodné slovo \` random \` (bez zadání módu je automaticky denní režim, po uhádnutí se automaticky přepne do náhodného)\n`
                },
                {
                    name: '\u200B',
                    value: '\u200B'
                },
                {
                    name: '/stats',
                    value:
                    `\` uživatel \` *(string)* - **nepovinné** - u kterého uživatele chcete zobrazit statistiky (bez zadání uživatele se zobrazí vaše statistiky)\n`+
                    `\` global \` *(boolean)* - **nepovinné** - \` True \` / \` False \` určí, zda má být zpráva v kanále veřejná a nebo zobrazena jen vám\n`
                }
            )

            await interaction.reply(
                {
                    embeds: [embed],
                    flags: 64
                }
            )
    }
}