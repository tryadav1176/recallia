// DOM Elements
const flashcard = document.querySelector('.flashcard');
const deckItems = document.querySelectorAll('.deck-item');
const difficultyButtons = document.querySelectorAll('.btn-difficulty');
const progressBar = document.querySelector('.progress');
const progressText = document.querySelector('.progress-text');
const btnAddDeck = document.querySelector('.btn-add-deck');
const btnControl = document.querySelectorAll('.btn-control');

// State
let currentDeck = 0;
let currentCard = 0;
let isFlipped = false;

// Sample Data
const decks = [
    {
        name: 'General Knowledge',
        cards: [
            { question: 'What is the capital of France?', answer: 'Paris' },
            { question: 'Who painted the Mona Lisa?', answer: 'Leonardo da Vinci' },
            { question: 'What is the largest planet in our solar system?', answer: 'Jupiter' }
        ]
    },
    {
        name: 'Math Basics',
        cards: [
            { question: 'What is 2 + 2?', answer: '4' },
            { question: 'What is the square root of 16?', answer: '4' },
            { question: 'What is 5 × 5?', answer: '25' }
        ]
    },
    {
        name: 'Vocabulary',
        cards: [
            { question: 'What is the meaning of "ephemeral"?', answer: 'Lasting for a very short time' },
            { question: 'Define "ubiquitous"', answer: 'Present, appearing, or found everywhere' },
            { question: 'What does "serendipity" mean?', answer: 'The occurrence of events by chance in a happy or beneficial way' }
        ]
    }
];

// Initialize
function init() {
    // Set up event listeners
    flashcard.addEventListener('click', flipCard);
    deckItems.forEach(item => item.addEventListener('click', switchDeck));
    difficultyButtons.forEach(btn => btn.addEventListener('click', rateDifficulty));
    btnAddDeck.addEventListener('click', addNewDeck);
    btnControl.forEach(btn => btn.addEventListener('click', handleControl));
    
    // Set up keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
    
    // Set up smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });
    
    // Update initial card
    updateCard();
}

// Update card content
function updateCard() {
    const card = decks[currentDeck].cards[currentCard];
    const frontContent = document.querySelector('.flashcard-front .card-content');
    const backContent = document.querySelector('.flashcard-back .card-content');
    
    frontContent.textContent = card.question;
    backContent.textContent = card.answer;
    
    // Update progress
    const progress = ((currentCard + 1) / decks[currentDeck].cards.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${currentCard + 1} of ${decks[currentDeck].cards.length}`;
    
    // Reset flip state
    isFlipped = false;
    flashcard.classList.remove('flipped');
}

// Flip card
function flipCard() {
    isFlipped = !isFlipped;
    flashcard.classList.toggle('flipped');
}

// Switch deck
function switchDeck(e) {
    const index = Array.from(deckItems).indexOf(e.currentTarget);
    if (index !== currentDeck) {
        currentDeck = index;
        currentCard = 0;
        deckItems.forEach(item => item.classList.remove('active'));
        e.currentTarget.classList.add('active');
        updateCard();
    }
}

// Rate difficulty
function rateDifficulty(e) {
    const rating = e.currentTarget.dataset.rating;
    // Here you would typically update the card's difficulty rating in your backend
    console.log(`Card rated as: ${rating}`);
    
    // Move to next card
    currentCard = (currentCard + 1) % decks[currentDeck].cards.length;
    updateCard();
}

// Add new deck
function addNewDeck() {
    // Here you would typically show a modal or form to create a new deck
    console.log('Add new deck clicked');
}

// Handle control buttons
function handleControl(e) {
    const action = e.currentTarget.dataset.action;
    switch (action) {
        case 'prev':
            currentCard = (currentCard - 1 + decks[currentDeck].cards.length) % decks[currentDeck].cards.length;
            break;
        case 'next':
            currentCard = (currentCard + 1) % decks[currentDeck].cards.length;
            break;
        case 'shuffle':
            // Shuffle the current deck
            decks[currentDeck].cards.sort(() => Math.random() - 0.5);
            currentCard = 0;
            break;
    }
    updateCard();
}

// Handle keyboard shortcuts
function handleKeyboard(e) {
    switch (e.key) {
        case ' ':
            e.preventDefault();
            flipCard();
            break;
        case 'ArrowLeft':
            currentCard = (currentCard - 1 + decks[currentDeck].cards.length) % decks[currentDeck].cards.length;
            updateCard();
            break;
        case 'ArrowRight':
            currentCard = (currentCard + 1) % decks[currentDeck].cards.length;
            updateCard();
            break;
        case '1':
        case '2':
        case '3':
        case '4':
            const rating = e.key;
            const button = document.querySelector(`[data-rating="${rating}"]`);
            if (button) button.click();
            break;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);