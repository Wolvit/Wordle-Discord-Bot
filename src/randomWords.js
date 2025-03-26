const path = require('path');
const fs = require('fs');
const { loadWords, randomWord } = require('./load');

const randomPath = path.join(__dirname, '../data/randomWords.json');


function getUserRandomWord(userId){
    let data = {};
    if(fs.existsSync(randomPath)){
        data = JSON.parse(fs.readFileSync(randomPath, 'utf8'));
    }

    if(!data[userId]){
        const words = loadWords();
        const word = randomWord(words);

        data[userId] = word;

        fs.writeFileSync(randomPath, JSON.stringify(data, null, 2), 'utf-8');
    }

    return data[userId];
}

function resetUserWord(userId){
    if(fs.existsSync(randomPath)){
        const data = JSON.parse(fs.readFileSync(randomPath, 'utf-8'));

        delete data[userId];
        fs.writeFileSync(randomPath, JSON.stringify(data, null, 2), 'utf-8');
    }
}

module.exports = {getUserRandomWord, resetUserWord}