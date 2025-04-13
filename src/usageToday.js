const fs = require('fs');
const path = require('path');

const usagePath = path.join(__dirname, '../data/usageToday.json');

function todayKey(){
	const now = new Date();
	return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function hasUsedToday(userId){
	if (!fs.existsSync(usagePath)) return false;


	const data = JSON.parse(fs.readFileSync(usagePath, 'utf-8'));
	const today = todayKey();

	return data[today] && data[today].includes(userId);
}

function markUsedToday(userId){
	const today = todayKey();
	let data = {};

	if (fs.existsSync(usagePath)) {
		data = JSON.parse(fs.readFileSync(usagePath, 'utf-8'));
	}

	if (!data[today]) {
		data[today] = [];
	}

	if(!data[today].includes(userId)){
		data[today].push(userId);
	}

	fs.writeFileSync(usagePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { hasUsedToday, markUsedToday }

