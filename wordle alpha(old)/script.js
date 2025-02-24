const words = {
    english: ["apple", "grape", "peach", "berry", "melon", "lemon", "mango", "plumb", "cherry", "guava", "melon", "candy", "fuzzy", "piano", "tiger", "zebra"],
};

let hiddenWord = words.english[Math.floor(Math.random() * words.english.length)];

let currentAttempt = 0;
let userRecords = {};
let leaderboard = [];

// Clear leaderboard data from localStorage
localStorage.removeItem('leaderboard');

function setupGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            gameBoard.appendChild(square);
        }
    }
    createKeyboard();
    displayLeaderboard();
    
    // Load leaderboard from localStorage
    const storedLeaderboard = localStorage.getItem('leaderboard');
    if (storedLeaderboard) {
        leaderboard = JSON.parse(storedLeaderboard);
        displayLeaderboard();
    }

    hiddenWord = words.english[Math.floor(Math.random() * words.english.length)];
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    letters.forEach(letter => {
        const key = document.createElement('div');
        key.classList.add('key');
        key.textContent = letter;
        key.addEventListener('click', () => handleKeyPress(letter));
        keyboard.appendChild(key);
    });
}

function handleKeyPress(letter) {
    const currentGuess = Array.from(document.querySelectorAll('.square')).slice(currentAttempt * 5, currentAttempt * 5 + 5);
    const emptySquare = currentGuess.find(square => square.textContent === '' && !square.classList.contains('green') && !square.classList.contains('yellow'));

    if (letter === 'BACKSPACE') {
        const filledSquare = currentGuess.reverse().find(square => square.textContent.length > 0);
        if (filledSquare) {
            filledSquare.textContent = '';
        }
    } else if (emptySquare) {
        emptySquare.textContent = letter.toLowerCase();

        if (currentGuess.every(square => square.textContent.length > 0)) {
            checkGuess(currentGuess.map(square => square.textContent).join(''));
        }
    }
}

function checkGuess(guess) {
    if (guess.length !== 5) {
        alert("Слово должно содержать ровно 5 букв.");
        return;
    }

    const squares = Array.from(document.querySelectorAll('.square'));
    const hiddenWordArray = hiddenWord.split(''); 

    const guessArray = guess.split('');

    for (let i = 0; i < 5; i++) {
        if (guessArray[i] === hiddenWordArray[i]) {
            squares[currentAttempt * 5 + i].classList.add('green');
            hiddenWordArray[i] = null; 
            guessArray[i] = null; 
        }
    }

    // Track letters that have been guessed
    const guessedLetters = {};

    const usedIndices = []; // Track used indices for yellow highlighting
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] === hiddenWordArray[i]) {
            squares[currentAttempt * 5 + i].classList.add('green');
            usedIndices.push(i); // Mark index as used
            hiddenWordArray[i] = null; 
            guessArray[i] = null; 
        }
    }

    for (let i = 0; i < 5; i++) {
        if (guessArray[i] && hiddenWordArray.includes(guessArray[i]) && !squares[currentAttempt * 5 + i].classList.contains('green')) {
            const indexInHiddenWord = hiddenWordArray.indexOf(guessArray[i]);
            if (indexInHiddenWord !== -1) {
                squares[currentAttempt * 5 + i].classList.add('yellow'); // Apply yellow class
            }
        }
    }
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] && !hiddenWordArray.includes(guessArray[i])) {
            squares[currentAttempt * 5 + i].classList.add('gray'); // Apply gray class if not in hidden word
        }
    }

    if (guess === hiddenWord) {
        alert(`Поздравляем! Вы угадали слово: ${hiddenWord}`);
        const username = prompt("Введите ваше имя для сохранения рекорда:");
        if (username) {
            if (userRecords[username]) {
                userRecords[username]++;
            } else {
                userRecords[username] = 1;
            }

            updateLeaderboard(username, userRecords[username]);
        }
        return;
    }
    
    currentAttempt++;
    if (currentAttempt === 6) {
        alert(`Игра окончена! Загаданное слово: ${hiddenWord}`);
    }
}

function updateLeaderboard(username, attempts) {
    leaderboard.push({ username, attempts });
    leaderboard.sort((a, b) => a.attempts - b.attempts);

    if (leaderboard.length > 10) {
        leaderboard.pop();
    }
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    displayLeaderboard();
}

function displayLeaderboard() {
    const leaderboardDiv = document.getElementById('leaderboard-content');
    leaderboardDiv.innerHTML = '';

    leaderboard.forEach(record => {
        const recordElement = document.createElement('div');
        recordElement.textContent = `${record.username}: ${record.attempts}`; // Change score to attempts
        leaderboardDiv.appendChild(recordElement);
    });
}

document.addEventListener('keydown', (event) => {
    const currentGuess = Array.from(document.querySelectorAll('.square')).slice(currentAttempt * 5, currentAttempt * 5 + 5);
    if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
        handleKeyPress(event.key.toLowerCase());
    } else if (event.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
    } else if (event.key === 'Enter') {
        if (currentGuess.every(square => square.textContent.length > 0)) {
            checkGuess(currentGuess.map(square => square.textContent).join(''));
        }
    }
});

setupGame();
