// script.js
const board = document.getElementById('game-board');
const cardValues = Array.from({ length: 8 }, (_, i) => i + 1); // Values 1 to 8
let cardPairs = [...cardValues, ...cardValues]; // Duplicate values for pairs
cardPairs = shuffle(cardPairs);

// Create cards
function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.addEventListener('click', revealCard);
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

// Reveal card
function revealCard() {
    if (this.classList.contains('revealed')) return;

    this.classList.add('revealed');
    this.textContent = this.dataset.value;
}

// Initialize game
renderBoard();
