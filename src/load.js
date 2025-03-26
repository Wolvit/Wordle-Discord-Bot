const fs = require('fs');
const path = require('path');
const {logMessage, errorMessage} = require('../utils/logger.js');

const nounsPath = path.join(__dirname, '../tx/nouns.txt');

function loadWords(){
    try{
        const data = fs.readFileSync(nounsPath, 'utf-8');
        const words = data
            .split(/\r?\n/)
            .map(w => w.trim().toLowerCase())
            .filter(w => w.length === 6);
        logMessage(`Načteno ${words.length} slov ze souboru.`, 'Wordle');
        return words;
    } catch(err){
        errorMessage(`Nepodařilo se načíst slova ${err.message}`, 'Wordle');
        return [];
    }
}

function randomWord(words){
    return words[Math.floor(Math.random()*words.length)];
}

module.exports = {
    loadWords,
    randomWord
}