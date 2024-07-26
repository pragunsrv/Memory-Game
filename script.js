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
const achievementsList = document.getElementById('achievements-list');
const settingsForm = document.getElementById('settings-form');
const audioFlip = new Audio('sounds/flip.mp3');
const audioMatch = new Audio('sounds/match.mp3');
const audioHint = new Audio('sounds/hint.mp3');
const cardImages = [
    'https://via.placeholder.com/100?text=A',
    'https://via.placeholder.com/100?text=B',
    'https://via.placeholder.com/100?text=C',
    'https://via.placeholder.com/100?text=D',
    'https://via.placeholder.com/100?text=E',
    'https://via.placeholder.com/100?text=F',
    'https://via.placeholder.com/100?text=G',
    'https://via.placeholder.com/100?text=H',
    'https://via.placeholder.com/100?text=I',
    'https://via.placeholder.com/100?text=J',
    'https://via.placeholder.com/100?text=K',
    'https://via.placeholder.com/100?text=L',
    'https://via.placeholder.com/100?text=M',
    'https://via.placeholder.com/100?text=N',
    'https://via.placeholder.com/100?text=O',
    'https://via.placeholder.com/100?text=P',
];

let cardPairs, flippedCards, matchedPairs, moveCount, seconds, timerInterval, score, hintsLeft;
let leaderboard = [];
let userProfiles = {};
let currentUserProfile = '';
let achievements = {
    firstWin: false,
    quickWin: false,
    perfectGame: false,
};

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
    audioFlip.play();

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
        audioMatch.play();
        if (matchedPairs === cardPairs.length / 2) {
            stopTimer();
            score = calculateScore();
            scoreElement.textContent = score;
            leaderboard.push({ name: currentUserProfile, time: seconds, moves: moveCount, score: score });
            updateLeaderboard();
            endGameMessage.textContent = `You won! Time: ${seconds} seconds, Moves: ${moveCount}, Score: ${score}`;
            endGameMessage.classList.remove('hidden');
            checkAchievements();
            checkHighScore();
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
        if (entry.name === currentUserProfile) {
            li.style.fontWeight = 'bold';
            li.style.color = 'gold';
        }
        leaderboardList.appendChild(li);
    });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Check and update high score
function checkHighScore() {
    const profile = userProfiles[currentUserProfile];
    if (score > profile.highScore) {
        profile.highScore = score;
        localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
        alert(`Congratulations ${currentUserProfile}! You've achieved a new high score of ${score}`);
    }
}

// Check achievements
function checkAchievements() {
    if (!achievements.firstWin) {
        achievements.firstWin = true;
        alert('Achievement Unlocked: First Win!');
    }
    if (seconds < 30) {
        achievements.quickWin = true;
        alert('Achievement Unlocked: Quick Win!');
    }
    if (matchedPairs === cardPairs.length / 2 && moveCount === 0) {
        achievements.perfectGame = true;
        alert('Achievement Unlocked: Perfect Game!');
    }
    updateAchievements();
}

// Update achievements
function updateAchievements() {
    achievementsList.innerHTML = '';
    for (const [key, value] of Object.entries(achievements)) {
        const li = document.createElement('li');
        li.textContent = `${key.replace(/([A-Z])/g, ' $1').toUpperCase()}: ${value ? 'Unlocked' : 'Locked'}`;
        achievementsList.appendChild(li);
    }
    localStorage.setItem('achievements', JSON.stringify(achievements));
}

// Restart the game
function restartGame() {
    const level = levelSelect.value;
    let rows, cols;
    switch (level) {
        case 'easy':
            rows = 4;
            cols = 4;
            cardPairs = shuffle([...cardImages.slice(0, 8), ...cardImages.slice(0, 8)]);
            break;
        case 'medium':
            rows = 4;
            cols = 6;
            cardPairs = shuffle([...cardImages.slice(0, 12), ...cardImages.slice(0, 12)]);
            break;
        case 'hard':
            rows = 4;
            cols = 8;
            cardPairs = shuffle([...cardImages, ...cardImages]);
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
            audioHint.play();
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
    if (currentUserProfile) {
        userProfiles[currentUserProfile] = {
            name: profileNameInput.value,
            highScore: userProfiles[currentUserProfile]?.highScore || 0,
        };
        localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
        alert('Profile saved successfully!');
        updateLeaderboard();
    } else {
        alert('Please select a user profile.');
    }
}

// Load user profile
function loadProfile() {
    const savedProfiles = localStorage.getItem('userProfiles');
    if (savedProfiles) {
        userProfiles = JSON.parse(savedProfiles);
    }
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
        achievements = JSON.parse(savedAchievements);
    }
    const savedLeaderboard = localStorage.getItem('leaderboard');
    if (savedLeaderboard) {
        leaderboard = JSON.parse(savedLeaderboard);
        updateLeaderboard();
    }
}

// Profile selection
function selectProfile() {
    currentUserProfile = profileNameInput.value;
    if (!currentUserProfile) {
        alert('Please enter a profile name.');
        return;
    }
    if (!userProfiles[currentUserProfile]) {
        userProfiles[currentUserProfile] = { name: currentUserProfile, highScore: 0 };
    }
    saveProfile();
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
    profileNameInput.addEventListener('change', selectProfile);
    loadProfile();
    restartGame();
}

initGame();
