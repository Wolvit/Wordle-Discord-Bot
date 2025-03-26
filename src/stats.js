const fs = require('fs');
const path = require('path');

const statsFile = path.join(__dirname, '../data/stats.json');

function incrementStats(userId, mode){
    let stats = {};
    if(fs.existsSync(statsFile)){
        stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    }

    if(!stats[userId]){
        stats[userId]  = {today: 0, random: 0};
    }

    stats[userId][mode] += 1;
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), 'utf-8');
} 

function getStats(userId){
    if(!fs.existsSync(statsFile)) return {today: 0, random: 0};

    const stats = JSON.parse(fs.readFileSync(statsFile, 'utf-8'));
    return stats[userId] || {today: 0, random: 0}
}

module.exports = {incrementStats, getStats};