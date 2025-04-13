const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { todayWord, yesterdayKey } = require("../src/dailyGame");
const { guessCheck } = require("../src/guess");
const { getUserRandomWord, resetUserWord } = require("../src/randomWords");
const { logMessage } = require("../utils/logger");
const { markGuessedToday, hasGuessedToday } = require("../src/guessedToday");
const { incrementStats } = require("../src/stats");
const { hasUsedToday, markUsedToday } = require('../src/usageToday.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Zkus uhádnout 6 písmenné slovo!')
        .addStringOption(option =>
            option.setName('slovo')
            .setDescription('Zadej 6 písmen')
            .setRequired(true)
        )
        .addStringOption( option =>
            option.setName('mode')
            .setDescription('Dnešní / Náhodné slovo')
            .setRequired(false)
            .addChoices(
                {name: 'Dnešní slovo', value: 'today'},
                {name: 'Náhodné slovo', value: 'random'}
            )
        ),
        async execute(interaction){
            const channel = process.env.WORDLE_CHANNEL;
                if(interaction.channel.id !== channel){
                    interaction.reply({
                        content: `Tento příkaz lze použít pouze v kanálu ${interaction.client.channels.cache.get(channel)}`,
                        flags: 64
                    })
                }   else{

                    const guess = interaction.options.getString('slovo').toLowerCase();
                    const mode = interaction.options.getString('mode') || 'today';
                    let actualMode = mode;
                    if(actualMode === 'today' && hasGuessedToday(interaction.user.id)){
                        actualMode = 'random';
                    }
            
                    if(guess.length !== 6){
                        await interaction.reply({content: 'Slovo musí mít 6 písmen!', flags: 64});
                        return;
                    };

                    let secret;
                    if(actualMode == 'random'){
                        secret = getUserRandomWord(interaction.user.id);
                    } else{
                        secret = todayWord();
                    }
			const dailyPath = path.join(__dirname, '../data/daily.json');
			let data = {}
			if(fs.existsSync(dailyPath)) {
				const fileContent = fs.readFileSync(dailyPath, 'utf-8');
				data = JSON.parse(fileContent);
			}
                    const result = guessCheck(guess, secret);
                    const isCorrect = guess === secret;
			const newKey = yesterdayKey();
			const word = data[newKey].toUpperCase() || null;

                    const embed = new EmbedBuilder()
                        .setTitle(isCorrect ? 'Správná odpověď!' : 'Výsledek tvého pokusu')
                        .setDescription(`${guess.toUpperCase()}\n${result}`)
                        .setColor(isCorrect ? 0x22C55E : 0x1EA8A)
                        .setFooter({text: actualMode === 'today' ? 'Dnešní slovo' : 'Náhodné slovo '});

			const isFirstTimeToday = !hasUsedToday(interaction.user.id);
			markUsedToday(interaction.user.id);
			if(word && actualMode === 'today' && isFirstTimeToday){
				embed.addFields({
					name: 'Včerejší slovo',
					value: word,
					inline: false
					});
			}
                    await interaction.reply({
                        embeds: [embed],
                        flags: 64
                    });
                    if(actualMode === 'today' && isCorrect){
                        markGuessedToday(interaction.user.id);
                        const infoChannelId = process.env.INFO_ID;
                        const infoChannel = interaction.client.channels.cache.get(infoChannelId);
                        const member = await interaction.guild.members.fetch(interaction.user.id);
                        const gratulation = new EmbedBuilder()
                            .setTitle(`Gratulujeme ${member.displayName}`)
                            .setDescription(`<@${interaction.user.id}> vyřešil dnešní slovo hry Wordle!`)
                            .setColor(0xFFD700)
                            .setFooter({text: 'Made by Wolvit'});
                        infoChannel.send({
                            embeds: [gratulation],
                        });
                    }
                    if(isCorrect){
                        incrementStats(interaction.user.id, actualMode);
                    };

                    if(actualMode === 'random' && isCorrect){
                        resetUserWord(interaction.user.id);
                        logMessage(`${interaction.user.id} uhádl své náhodné slovo!`, 'Wordle');
                    }
            }

        }
}
