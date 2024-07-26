// script.js
const board = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const scoreElement = document.getElementById('score');
const hintsElement = document.getElementById('hints');
const restartButton = document.getElementById('restart-button');
const hintButton = document.getElementById('hint-button');
const themeSwitcher = document.getElementById('theme-switcher');
const levelSelect = document.getElementById('level-select');
const customSizeDiv = document.getElementById('custom-size');
const gridRowsInput = document.getElementById('grid-rows');
const gridColsInput = document.getElementById('grid-cols');
const endGameMessage = document.getElementById('end-game-message');
const leaderboardList = document.getElementById('leaderboard-list');
const profileNameInput = document.getElementById('profile-name');
const saveProfileButton = document.getElementById('save-profile');
const cardImages = [
    'https://via.placeholder.com/100?text=A',
    'https://via.placeholder.com/100?text=B',
    'https://via.placeholder.com/100?text=C',
    'https://via.placeholder.com/100?text=D',
    'https://via.placeholder.com/100?text=E',
    'https://via.placeholder.com/100?text=F',
    'https://via.placeholder.com/100?text=G',
    'https://via.placeholder.com/100?text=H',
];
let cardPairs, flippedCards, matchedPairs, moveCount, seconds, timerInterval, score, hintsLeft;
let leaderboard = [];
let userProfile = { name: '', highScore: 0 };

// Create cards
function createCard(imageSrc) {
    const card = document.createElement('div');
    card.classList.add('card');
    const img = document.createElement('img');
    img.src = imageSrc;
    img.classList.add('hidden');
    card.appendChild(img);
    card.addEventListener('click', flipCard);
    return card;
}

// Render game board
function renderBoard(rows, cols) {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
    cardPairs.forEach(imageSrc => {
        const card = createCard(imageSrc);
        board.appendChild(card);
    });
}

// Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Start the timer
function startTimer() {
    seconds = 0;
    timerElement.textContent = seconds;
    timerInterval = setInterval(() => {
        seconds++;
        timerElement.textContent = seconds;
    }, 1000);
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Calculate score
function calculateScore() {
    return Math.max(1000 - (seconds + moveCount * 5), 0);
}

// Flip card
function flipCard() {
    if (flippedCards.length === 2 || this.classList.contains('flipped') || this.classList.contains('matched')) return;

    this.classList.add('flipped');
    this.querySelector('img').classList.remove('hidden');
    flippedCards.push(this);
    moveCount++;
    movesElement.textContent = moveCount;

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

// Check for match
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.querySelector('img').src === card2.querySelector('img').src) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        if (matchedPairs === cardPairs.length / 2) {
            stopTimer();
            score = calculateScore();
            scoreElement.textContent = score;
            leaderboard.push({ name: userProfile.name, time: seconds, moves: moveCount, score: score });
            updateLeaderboard();
            endGameMessage.textContent = `You won! Time: ${seconds} seconds, Moves: ${moveCount}, Score: ${score}`;
            endGameMessage.classList.remove('hidden');
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.querySelector('img').classList.add('hidden');
        card2.querySelector('img').classList.add('hidden');
    }
    flippedCards = [];
}

// Update leaderboard
function updateLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `Name: ${entry.name}, Time: ${entry.time}s, Moves: ${entry.moves}, Score: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

// Restart the game
function restartGame() {
    const level = levelSelect.value;
    let rows, cols;
    switch (level) {
        case 'easy':
            rows = 4;
            cols = 4;
            cardPairs = shuffle([...cardImages, ...cardImages]);
            break;
        case 'medium':
            rows = 4;
            cols = 6;
            cardPairs = shuffle([...cardImages, ...cardImages, ...cardImages.slice(0, 4)]);
            break;
        case 'hard':
            rows = 4;
            cols = 8;
            cardPairs = shuffle([...cardImages, ...cardImages, ...cardImages.slice(0, 8)]);
            break;
        case 'custom':
            rows = parseInt(gridRowsInput.value) || 4;
            cols = parseInt(gridColsInput.value) || 4;
            const numPairs = (rows * cols) / 2;
            cardPairs = shuffle([...cardImages.slice(0, numPairs), ...cardImages.slice(0, numPairs)]);
            break;
    }
    board.className = 'game-board';
    flippedCards = [];
    matchedPairs = 0;
    moveCount = 0;
    seconds = 0;
    score = 0;
    hintsLeft = 3;
    movesElement.textContent = moveCount;
    scoreElement.textContent = score;
    hintsElement.textContent = hintsLeft;
    endGameMessage.classList.add('hidden');
    renderBoard(rows, cols);
    startTimer();
}

// Hint system
function getHint() {
    if (hintsLeft > 0 && flippedCards.length < 2) {
        const unmatchedCards = Array.from(document.querySelectorAll('.card:not(.flipped):not(.matched)'));
        if (unmatchedCards.length >= 2) {
            const randomIndex1 = Math.floor(Math.random() * unmatchedCards.length);
            let randomIndex2;
            do {
                randomIndex2 = Math.floor(Math.random() * unmatchedCards.length);
            } while (randomIndex1 === randomIndex2);
            const hintCard1 = unmatchedCards[randomIndex1];
            const hintCard2 = unmatchedCards[randomIndex2];
            hintCard1.classList.add('flipped');
            hintCard1.querySelector('img').classList.remove('hidden');
            hintCard2.classList.add('flipped');
            hintCard2.querySelector('img').classList.remove('hidden');
            setTimeout(() => {
                hintCard1.classList.remove('flipped');
                hintCard1.querySelector('img').classList.add('hidden');
                hintCard2.classList.remove('flipped');
                hintCard2.querySelector('img').classList.add('hidden');
            }, 1000);
            hintsLeft--;
            hintsElement.textContent = hintsLeft;
        }
    }
}

// Theme switcher
function switchTheme() {
    document.body.classList.toggle('dark');
}

// Save user profile
function saveProfile() {
    const profileName = profileNameInput.value.trim();
    if (profileName) {
        userProfile.name = profileName;
        alert(`Profile saved! Hi ${userProfile.name}`);
    } else {
        alert('Please enter a name to save your profile.');
    }
}

// Initialize game
function initGame() {
    if (!saveProfileButton) {
        console.error('Profile save button not found!');
        return;
    }

    levelSelect.addEventListener('change', () => {
        customSizeDiv.classList.toggle('hidden', levelSelect.value !== 'custom');
        restartGame();
    });
    restartButton.addEventListener('click', restartGame);
    hintButton.addEventListener('click', getHint);
    themeSwitcher.addEventListener('click', switchTheme);
    saveProfileButton.addEventListener('click', saveProfile);
    restartGame();
}

initGame();
