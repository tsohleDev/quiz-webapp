import { getUid } from '../data/authentication.js';
import { addScore } from '../data/database-client.js';

// DOM Elements
const quizTopicDisplay = document.getElementById('quiz-topic-display');
const progressBar = document.querySelector('.progress-bar');
const questionNumberDisplay = document.getElementById('question-number');
const timerDisplay = document.getElementById('timer');
const questionTextDisplay = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreDisplay = document.getElementById('score');
const nextBtn = document.getElementById('next-btn');

const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results-container');
const finalScoreDisplay = document.getElementById('final-score-display');
const finalMessageDisplay = document.getElementById('final-message');
const restartQuizBtn = document.getElementById('restart-quiz-btn');
const viewTopScoresBtn = document.getElementById('view-top-scores-btn');

// Hamburger Menu Logic
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('.nav-menu');

if (hamburgerMenu && navMenu) {
    hamburgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        hamburgerMenu.setAttribute('aria-expanded', isOpen.toString());
        hamburgerMenu.classList.toggle('open', isOpen);
    });
}

// Quiz State
let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];
let selectedCategory = '';
let timerId;
let timeLeft = 15; // Time per question in seconds

// Initialize Quiz when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadQuizDataFromLocalStorage();
    if (quizQuestions && quizQuestions.length > 0 && selectedCategory) {
        initializeQuizInterface();
        loadQuestion();
    } else {
        displayQuizLoadError();
    }
});

function loadQuizDataFromLocalStorage() {
    const questionsString = localStorage.getItem('quizQuestions');
    selectedCategory = localStorage.getItem('selectedQuizCategory');

    if (questionsString) {
        try {
            quizQuestions = JSON.parse(questionsString);
        } catch (e) {
            console.error("Error parsing quiz questions from localStorage:", e);
            quizQuestions = []; // Ensure quizQuestions is an array
        }
    } else {
        quizQuestions = []; // Ensure quizQuestions is an array
    }

    if (!selectedCategory) {
        console.warn("Selected quiz category not found in localStorage.");
    }
}

function displayQuizLoadError() {
    if (quizContainer) {
        quizContainer.innerHTML = `
            <h1>Error: Quiz Data Missing</h1>
            <p>Could not load the quiz questions or category. Please try selecting a category again from the homepage.</p>
            <a href="index.html" class="btn">Go to Homepage</a>
        `;
    }
    console.error("Quiz data (questions or category) missing from localStorage. Cannot start quiz.");
}

function initializeQuizInterface() {
    quizTopicDisplay.textContent = selectedCategory || 'Quiz';
    scoreDisplay.textContent = `Score: ${score}`;
    updateProgress();

    nextBtn.addEventListener('click', handleNextQuestion);
    restartQuizBtn.addEventListener('click', () => {
        // Optionally clear localStorage items if they shouldn't persist
        // localStorage.removeItem('quizQuestions');
        // localStorage.removeItem('selectedQuizCategory');
        window.location.href = 'index.html';
    });
    viewTopScoresBtn.addEventListener('click', () => window.location.href = 'topscores.html');
}

function loadQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        showFinalScore();
        return;
    }

    clearInterval(timerId);
    timeLeft = 15; // Reset timer for each question
    updateTimerDisplay();

    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionTextDisplay.textContent = currentQuestion.question;
    questionNumberDisplay.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    optionsContainer.innerHTML = ''; // Clear previous options
    nextBtn.disabled = true;
    nextBtn.textContent = (currentQuestionIndex === quizQuestions.length - 1) ? "Finish Quiz" : "Next Question";

    if (!currentQuestion.choices || !Array.isArray(currentQuestion.choices)) {
        console.error("Question is missing choices or choices is not an array:", currentQuestion);
        optionsContainer.innerHTML = "<p>Error: Options for this question are unavailable.</p>";
        // Consider automatically moving to the next question or ending the quiz
        return;
    }

    currentQuestion.choices.forEach(choiceText => {
        const choiceButton = document.createElement('button');
        choiceButton.textContent = choiceText;
        choiceButton.classList.add('option-btn');
        choiceButton.addEventListener('click', () => handleAnswerSelection(choiceButton, choiceText, currentQuestion.answer));
        optionsContainer.appendChild(choiceButton);
    });

    startTimer();
}

function handleAnswerSelection(selectedButton, selectedChoice, correctAnswer) {
    clearInterval(timerId);
    const isCorrect = selectedChoice === correctAnswer;

    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true; // Disable all option buttons
        if (button.textContent === correctAnswer) {
            button.style.backgroundColor = 'var(--correct-answer-bg, #a8e6a1)'; // Highlight correct answer
        }
    });

    if (isCorrect) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        selectedButton.style.backgroundColor = 'var(--correct-answer-bg, #a8e6a1)';
    } else {
        selectedButton.style.backgroundColor = 'var(--incorrect-answer-bg, #f8a1a1)'; // Highlight incorrect selection
    }

    nextBtn.disabled = false;
}

function handleNextQuestion() {
    currentQuestionIndex++;
    updateProgress();
    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
    } else {
        showFinalScore();
    }
}

function updateProgress() {
    const progressPercentage = quizQuestions.length > 0 ? ((currentQuestionIndex) / quizQuestions.length) * 100 : 0;
    progressBar.style.width = `${progressPercentage}%`;
}

function startTimer() {
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    timerId = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerId);
            handleTimeOut();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
}

function handleTimeOut() {
    // Automatically mark incorrect or just show correct answer and move on
    const currentQuestion = quizQuestions[currentQuestionIndex];
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true;
        if (button.textContent === currentQuestion.answer) {
            button.style.backgroundColor = 'var(--correct-answer-bg, #a8e6a1)'; // Highlight correct answer
        }
    });
    // finalMessageDisplay.textContent = "Time's up!"; // Optional message
    nextBtn.disabled = false;
}

async function showFinalScore() {
    clearInterval(timerId);
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    progressBar.style.width = '100%'; // Mark progress as complete

    finalScoreDisplay.textContent = `Your Final Score: ${score} / ${quizQuestions.length}`;

    const uid = getUid(); // Assumes getUid() is synchronous or handles its own async logic to return a UID
    if (uid && selectedCategory) {
        try {
            finalMessageDisplay.textContent = "Saving your score...";
            const result = await addScore(uid, score, selectedCategory);
            if (result.status === 'success') {
                console.log("Score saved successfully:", result.message);
                finalMessageDisplay.textContent = "Your score has been saved!";
            } else {
                console.error("Failed to save score:", result.message);
                finalMessageDisplay.textContent = `Could not save your score: ${result.message}`;
            }
        } catch (error) {
            console.error("Error saving score:", error);
            finalMessageDisplay.textContent = "An error occurred while saving your score.";
        }
    } else if (!uid) {
        console.warn("Cannot save score: User ID not available. User might not be logged in.");
        finalMessageDisplay.textContent = "Could not save score: User not identified.";
    } else {
        console.warn("Cannot save score: Category not available.");
        finalMessageDisplay.textContent = "Could not save score: Quiz category missing.";
    }
}