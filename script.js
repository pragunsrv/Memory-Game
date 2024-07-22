// script.js
const board = document.getElementById('game-board');
const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cardPairs = [...cardValues, ...cardValues]; // Duplicate values for pairs
cardPairs = shuffle(cardPairs);

let flippedCards = [];
let matchedPairs = 0;

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

// Flip card
function flipCard() {
    if (flippedCards.length === 2) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.value;
    flippedCards.push(this);

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
            setTimeout(() => alert('You won!'), 500);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
    }
    flippedCards = [];
}

// Initialize game
renderBoard();
