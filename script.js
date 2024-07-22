// script.js
const board = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-button');
const levelSelect = document.getElementById('level-select');
const endGameMessage = document.getElementById('end-game-message');
const leaderboardList = document.getElementById('leaderboard-list');
const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cardPairs, flippedCards, matchedPairs, moveCount, seconds, timerInterval, score;
let leaderboard = [];

// Create cards
function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.addEventListener('click', flipCard);
    return card;
}

// Render game board
function renderBoard() {
    board.innerHTML = '';
    cardPairs.forEach(value => {
        const card = createCard(value);
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
    this.textContent = this.dataset.value;
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

    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        if (matchedPairs === cardPairs.length / 2) {
            stopTimer();
            score = calculateScore();
            scoreElement.textContent = score;
            leaderboard.push({ time: seconds, moves: moveCount, score: score });
            updateLeaderboard();
            endGameMessage.textContent = `You won! Time: ${seconds} seconds, Moves: ${moveCount}, Score: ${score}`;
            endGameMessage.classList.remove('hidden');
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
    }
    flippedCards = [];
}

// Update leaderboard
function updateLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `Time: ${entry.time}s, Moves: ${entry.moves}, Score: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

// Restart the game
function restartGame() {
    const level = levelSelect.value;
    switch (level) {
        case 'easy':
            board.className = 'game-board easy';
            cardPairs = shuffle([...cardValues, ...cardValues]);
            break;
        case 'medium':
            board.className = 'game-board medium';
            cardPairs = shuffle([...cardValues, ...cardValues, 'I', 'J', 'K', 'L']);
            break;
        case 'hard':
            board.className = 'game-board hard';
            cardPairs = shuffle([...cardValues, ...cardValues, 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']);
            break;
    }
    flippedCards = [];
    matchedPairs = 0;
    moveCount = 0;
    seconds = 0;
    score = 0;
    movesElement.textContent = moveCount;
    scoreElement.textContent = score;
    endGameMessage.classList.add('hidden');
    renderBoard();
    startTimer();
}

// Initialize game
function initGame() {
    levelSelect.addEventListener('change', restartGame);
    restartButton.addEventListener('click', restartGame);
    restartGame();
}

initGame();
