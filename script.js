// script.js
const board = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const restartButton = document.getElementById('restart-button');
const endGameMessage = document.getElementById('end-game-message');
const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cardPairs, flippedCards, matchedPairs, moveCount, seconds, timerInterval;

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
        if (matchedPairs === cardValues.length) {
            stopTimer();
            endGameMessage.textContent = `You won! Total time: ${seconds} seconds. Total moves: ${moveCount}`;
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

// Restart the game
function restartGame() {
    cardPairs = shuffle([...cardValues, ...cardValues]);
    flippedCards = [];
    matchedPairs = 0;
    moveCount = 0;
    movesElement.textContent = moveCount;
    endGameMessage.classList.add('hidden');
    renderBoard();
    startTimer();
}

// Initialize game
function initGame() {
    restartGame();
    restartButton.addEventListener('click', restartGame);
}

initGame();
