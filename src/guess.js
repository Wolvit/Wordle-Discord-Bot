function guessCheck(guess, secret){
    const result = [];
    const secretLetters = secret.split('');
    const guessLetters = guess.split('');
    const usedIndexes = new Set();
    
    for(let i = 0; i < guessLetters.length; i++){
        if(guessLetters[i] == secretLetters[i]){
            result[i] = '🟩';
            usedIndexes.add(i);
            secretLetters[i] = null;;
            guessLetters[i] = null;
        }
    }
    for(let i = 0; i < guessLetters.length; i++){
        if(guessLetters[i] == null) continue;
        
        const index = secretLetters.indexOf(guessLetters[i]);
        if(index !== -1){
            result[i] =  '🟨';
            secretLetters[index] = null;
        } else{
            result[i] = '⬛';
        }
    }

    return result.join(' ');
}

module.exports = {guessCheck}