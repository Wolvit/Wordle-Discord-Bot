require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, REST } = require('discord.js');
const { requestMessage, wrapLog } = require('./utils/logger');
const { sheduleWord } = require('./src/sheduler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for(const file of eventFiles){
    const event = require(`./events/${file}`);
    
    const safeExecute = wrapLog(
        event.execute,
        event.name || 'nepojmenovaný event'
    );

    if(event.once){
        client.once(event.name, (...args) => safeExecute(...args, client));
    }
    else{
        client.on(event.name, (...args) => safeExecute(...args, client));
    }
}

const rest = new REST({version: 10}).setToken(process.env.DISCORD_TOKEN);
rest.on('request', req => requestMessage(req.url, req.method, 'PENDRING'));
rest.on('response', (req, res) => requestMessage(req.url, req.method, res.status)); 

sheduleWord();

client.login(process.env.DISCORD_TOKEN);
