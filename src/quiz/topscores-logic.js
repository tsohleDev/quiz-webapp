import { getQuizCategories, getUserTopScore } from '../data/database-client.js';
import { getUid } from '../data/authentication.js';

// DOM Elements
const categoryFilterSelect = document.getElementById('category-filter');
const scoresListUl = document.getElementById('scores-list'); // Will display the single score item
const loadingScoresMessage = document.getElementById('loading-scores-message');
const noScoresMessage = document.getElementById('no-scores-message');
// const scoresListContainer = document.getElementById('scores-list-container'); // Parent div

const hamburgerMenu = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('.nav-menu');

// Hamburger Menu Logic
if (hamburgerMenu && navMenu) {
    hamburgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        hamburgerMenu.setAttribute('aria-expanded', isOpen.toString());
        hamburgerMenu.classList.toggle('open', isOpen);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    populateCategoryFilter();

    // Initial state: Prompt user to select a category
    scoresListUl.innerHTML = '';
    loadingScoresMessage.style.display = 'none';
    noScoresMessage.textContent = 'Please select a category to view your top score.';
    noScoresMessage.style.display = 'block';

    if (categoryFilterSelect) {
        categoryFilterSelect.addEventListener('change', (event) => {
            fetchAndDisplayUserTopScore(event.target.value);
        });
    }
});

async function populateCategoryFilter() {
    if (!categoryFilterSelect) return;

    // The "All Categories" option is already in the HTML.
    // We will append specific categories fetched from the database.
    try {
        const categoriesResult = await getQuizCategories();
        if (categoriesResult.status === 'success' && categoriesResult.data) {
            categoriesResult.data.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilterSelect.appendChild(option);
            });
        } else {
            console.warn('Could not populate category filters:', categoriesResult.message);
            // Optionally display a message to the user if categories can't be loaded
        }
    } catch (error) {
        console.error('Error populating category filters:', error);
    }
}

async function fetchAndDisplayUserTopScore(selectedCategory) {
    if (!scoresListUl || !loadingScoresMessage || !noScoresMessage) {
        console.error("One or more DOM elements for scores display are missing.");
        return;
    }

    scoresListUl.innerHTML = ''; // Clear previous score display
    loadingScoresMessage.style.display = 'block';
    noScoresMessage.style.display = 'none';

    if (selectedCategory === 'all' || !selectedCategory) {
        loadingScoresMessage.style.display = 'none';
        noScoresMessage.textContent = 'Please select a specific category to view your top score.';
        noScoresMessage.style.display = 'block';
        return;
    }

    const uid = getUid();
    if (!uid) {
        loadingScoresMessage.style.display = 'none';
        noScoresMessage.textContent = 'User not logged in. Please log in to see your scores.';
        noScoresMessage.style.display = 'block';
        console.error('User ID not available.');
        return;
    }

    try {
        const scoreResult = await getUserTopScore(uid, selectedCategory);

        loadingScoresMessage.style.display = 'none';

        if (scoreResult.status === 'success') {
            if (scoreResult.data) { // scoreResult.data is the single score object or null
                renderUserTopScore(scoreResult.data, selectedCategory);
            } else {
                noScoresMessage.textContent = `No top score found for you in "${selectedCategory}".`;
                noScoresMessage.style.display = 'block';
            }
        } else {
            console.error('Failed to fetch user top score:', scoreResult.message);
            noScoresMessage.textContent = `Error loading your score: ${scoreResult.message || 'Unknown error'}`;
            noScoresMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching and displaying user top score:', error);
        loadingScoresMessage.style.display = 'none';
        noScoresMessage.textContent = 'An unexpected error occurred while loading your score.';
        noScoresMessage.style.display = 'block';
    }
}

function renderUserTopScore(scoreEntry, categoryContext) {
    if (!scoresListUl) return;
    scoresListUl.innerHTML = ''; // Clear again, ensuring only one item is shown

    const listItem = document.createElement('li');
    listItem.classList.add('score-item'); // Reusing class, can be styled for a single prominent item

    // You might want a more descriptive label than just the name/score
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('score-title'); // New class for styling
    titleSpan.textContent = `Your Top Score in ${scoreEntry.category || categoryContext}:`;
    listItem.appendChild(titleSpan);


    const scoreValSpan = document.createElement('span');
    scoreValSpan.classList.add('player-score');
    scoreValSpan.textContent = `Score: ${scoreEntry.score}`; // Adding "Score: " prefix
    listItem.appendChild(scoreValSpan);

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('score-date');
    if (scoreEntry.timestamp && scoreEntry.timestamp.toDate) { // Check if it's a Firebase Timestamp
        dateSpan.textContent = `Date: ${scoreEntry.timestamp.toDate().toLocaleDateString()}`;
    } else if (scoreEntry.timestamp) {
        dateSpan.textContent = `Date: ${new Date(scoreEntry.timestamp).toLocaleDateString()}`;
    } else {
        dateSpan.textContent = 'Date: N/A';
    }
    listItem.appendChild(dateSpan);

    // The original spans for player-name and score-category might be redundant
    // if the titleSpan covers the category and it's known to be the user's score.
    // If you still want them:
    // const nameSpan = document.createElement('span');
    // nameSpan.classList.add('player-name');
    // nameSpan.textContent = scoreEntry.displayName || 'Your Score';
    // listItem.appendChild(nameSpan);

    // const categorySpan = document.createElement('span');
    // categorySpan.classList.add('score-category');
    // categorySpan.textContent = scoreEntry.category || categoryContext;
    // listItem.appendChild(categorySpan);

    scoresListUl.appendChild(listItem);
}