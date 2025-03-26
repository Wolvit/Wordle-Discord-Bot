const { randomWord, loadWords } = require("./load");
const fs = require('fs');
const path = require('path');

const dailyPath = path.join(__dirname, '../data/daily.json');

function todayKey(){
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
}

function todayWord(){
    const key = todayKey();

    if(fs.existsSync(dailyPath)){
        const data = JSON.parse(fs.readFileSync(dailyPath, 'utf-8'));
        if(data[key]) return data[key];
    }

    const words = loadWords();
    const word = randomWord(words);

    let data = {};
    if(fs.existsSync(dailyPath)){
        data = JSON.parse(fs.readFileSync(dailyPath, 'utf-8'));
    }

    data[key] = word;
    fs.writeFileSync(dailyPath, JSON.stringify(data, null, 2), 'utf-8');

    return word;
}


module.exports = { todayWord, todayKey };