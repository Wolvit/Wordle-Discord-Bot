const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
const dataDir = path.join(__dirname, '../data');

if(!fs.existsSync(logDir)){
    fs.mkdirSync(logDir, {recursive: true});
}
if(!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir, {recursive: true});
}

const files = [
    {
        path: path.join(logDir, 'bot.log'),
        default: ''
    },
    {
        path: path.join(logDir, 'error.log'),
        default: ''
    },
    {
        path: path.join(logDir, 'request.log'),
        default: ''
    },
    {
        path: path.join(dataDir, 'daily.json'),
        default: '{}'
    },
    {
        path: path.join(dataDir, 'guessedToday.json'),
        default: '{}'
    },
    {
        path: path.join(dataDir, 'randomWords.json'),
        default: '{}'
    },
    {
        path: path.join(dataDir, 'stats.json'),
        default: '{}'
    }
]

for(const file of files){
    if(!fs.existsSync(file.path)){
        fs.writeFileSync(file.path, file.default, 'utf-8');
    }
}

const logFile = path.join(__dirname, '../logs/bot.log');
const errorFile = path.join(__dirname, '../logs/error.log');
const requestFile = path.join(__dirname, '../logs/request.log');

function logMessage(message, channel = ""){
    let entry = `[${new Date().toISOString()}] ${message}`;
    if(channel != "") {
        entry += ` | kanál: ${channel}`;
    } 

    entry += "\n";

    console.log(entry.trim());
    fs.appendFileSync(logFile, entry, 'utf-8');
}

function errorMessage(message, channel = ""){
    let entry =  `[${new Date().toISOString()}] ERROR: ${message}`;

    if(channel != ""){
        entry+=  ` | kanál: ${channel}`;
    }

    entry+="\n"


    console.error(entry.trim())
    fs.appendFileSync(errorFile, entry, 'utf-8');
}

function requestMessage(url, method, status){
    const entry = `[${new Date().toISOString()} ${method} ${url} → ${status}\n]`
    console.log(entry.trim());
    fs.appendFileSync(requestFile, entry, 'utf-8');
}

function wrapLog(fn, channelName = "", client = null, options = {}){
    return async(...args)=>{
        try{
            await fn(...args);
            return true;
        } catch(err){
            const fnName = fn.name || 'anonymní funkce';
            errorMessage(`Chyba ve funkci ${fnName}: ${err.message}`, channelName);
        if(options.exitOnFail){
            process.exit(1);
        }

        return false;
        }
    }
}

module.exports = { logMessage, errorMessage, requestMessage, wrapLog }