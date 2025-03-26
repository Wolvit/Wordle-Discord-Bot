const path = require('path');
const fs = require('fs');
const { todayKey } = require('./dailyGame');

const guessedPath = path.join(__dirname, '../data/guessedToday.json');

function hasGuessedToday(userId){
    if(!fs.existsSync(guessedPath))
    return false;

    const data = JSON.parse(fs.readFileSync(guessedPath, 'utf8'));
    const today = todayKey();

    return data[today] && data[today].includes(userId);
}

function markGuessedToday(userId){
    const today = todayKey();
    let data = {};

    if (fs.existsSync(guessedPath)){
        data = JSON.parse(fs.readFileSync(guessedPath, 'utf8'));
    }

    if(!data[today]){
        data[today] = [];
    }

    if(!data[today].includes(userId)){
        data[today].push(userId);
    }

    fs.writeFileSync(guessedPath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { hasGuessedToday, markGuessedToday }