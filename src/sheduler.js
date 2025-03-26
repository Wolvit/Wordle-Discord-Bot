const { logMessage } = require("../utils/logger");
const { todayWord } = require("./dailyGame");


function sheduleWord(){
    const now = new Date();

    const untilMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0, 0, 0, 0
    ) - now;

    setTimeout(() => {
        const word = todayWord();
        logMessage(`Denní slovo přidáno`, 'Wordle');

        setInterval(() => {
            const word = todayWord();
            logMessage(`Denní slovo přidáno`, 'Wordle');
        }, 24 * 60 * 60 * 1000);
    }, untilMidnight);
}

module.exports = {sheduleWord}