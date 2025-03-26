require('dotenv').config();
const fs = require('fs');
const { REST, Routes } = require('discord.js');
const { logMessage, errorMessage, wrapLog, requestMessage } = require('./utils/logger');

const commands = []
const commandsFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(let file of commandsFiles){
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    logMessage(`Načten slash příkaz: ${command.data.name}`);
}
const rest = new REST({version: 10}).setToken(process.env.DISCORD_TOKEN);

(async ()=>{

    const route = Routes.applicationCommands(process.env.CLIENT_ID);

    try{
        logMessage("Registruji slash příkazy...")
        await rest.put(
            route,
            {body: commands}
        );
        requestMessage(route, 'PUT', 200);
        logMessage('Registrovány příkazy!')
    } catch(err){
        errorMessage(`Nastala chyba: ${err}`);
    }
})()
