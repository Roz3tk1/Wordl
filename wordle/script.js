const words = {
    english: ["apple", "grape", "peach", "berry", "melon", "lemon", "mango", "plumb", "cherry", "guava", "melon", "candy", "fuzzy", "piano", "tiger", "zebra"],
};

let hiddenWord = words.english[Math.floor(Math.random() * words.english.length)];
let currentRow = 0;
let currentGuess = '';
let gameOver = false;

const themeSwitcher = document.getElementById('theme-switcher');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeSwitcher.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeSwitcher.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function initGame() {
    const gameBoard = document.getElementById('game-board');
    const keyboard = document.getElementById('keyboard');
    
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < 5; j++) {
            const square = document.createElement('div');
            square.className = 'square';
            row.appendChild(square);
        }
        gameBoard.appendChild(row);
    }
    
    const keyboardLayout = [
        'Q W E R T Y U I O P',
        'A S D F G H J K L',
        'ENTER Z X C V B N M BACKSPACE'
    ];

    keyboardLayout.forEach(row => {
        const keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard-row';
        row.split(' ').forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.className = key === 'ENTER' || key === 'BACKSPACE' ? 'key special-key' : 'key';
            keyElement.textContent = key === 'BACKSPACE' ? '⌫' : key;
            keyElement.addEventListener('click', () => handleKeyPress(key));

            keyboardRow.appendChild(keyElement);
        });
        keyboard.appendChild(keyboardRow);
    });
}

function handleKeyPress(key) {
    if (gameOver) return;
    
    if (key === 'ENTER') {
        if (currentGuess.length === 5) {
            checkGuess();
        }
    } else if (key === 'BACKSPACE') {
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            updateBoard();
        }
    } else {
        if (currentGuess.length < 5) {
            currentGuess += key.toLowerCase();
            updateBoard();
        }
    }
}

function updateBoard() {
    const row = document.querySelectorAll('.row')[currentRow];
    const squares = row.querySelectorAll('.square');
    
    squares.forEach((square, index) => {
        square.textContent = currentGuess[index] || '';
    });
}

function checkGuess() {
    const row = document.querySelectorAll('.row')[currentRow];
    const squares = row.querySelectorAll('.square');
    const keys = document.querySelectorAll('.key');
    
    let correctLetters = 0;
    
    squares.forEach((square, index) => {
        const letter = currentGuess[index];
        if (letter === hiddenWord[index]) {
            square.classList.add('green');
            keys.forEach(key => {
                if (key.textContent.toLowerCase() === letter) {
                    key.classList.add('key-green');
                }
            });
            correctLetters++;
        } else if (hiddenWord.includes(letter)) {
            square.classList.add('yellow');
            keys.forEach(key => {
                if (key.textContent.toLowerCase() === letter && !key.classList.contains('key-green')) {
                    key.classList.add('key-yellow');
                }
            });
        } else {
            square.classList.add('gray');
            keys.forEach(key => {

                if (key.textContent.toLowerCase() === letter) {
                    key.classList.add('key-gray');
                }
            });
        }
    });

    if (correctLetters === 5) {
        gameOver = true;
        showMessage('Поздравляем! Вы угадали слово!');
    } else if (currentRow === 5) {
        gameOver = true;
        showMessage(`Игра окончена! Загаданное слово: ${hiddenWord}`);
    } else {
        currentRow++;
        currentGuess = '';
    }
}

function showMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.opacity = 1;
    setTimeout(() => {
        messageElement.style.opacity = 0;
    }, 3000);
}

document.addEventListener('DOMContentLoaded', initGame);

document.getElementById('new-game-btn').addEventListener('click', () => {
    currentRow = 0;
    currentGuess = '';
    gameOver = false;
    hiddenWord = words.english[Math.floor(Math.random() * words.english.length)];
    
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < 5; j++) {
            const square = document.createElement('div');
            square.className = 'square';
            row.appendChild(square);
        }
        gameBoard.appendChild(row);
    }
    
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.classList.remove('key-green', 'key-yellow', 'key-gray');
    });
    
    document.getElementById('message').textContent = '';
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !gameOver && currentGuess.length === 5) {
        handleKeyPress('ENTER');
    } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
    }
});
