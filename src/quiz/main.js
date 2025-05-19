import { shuffleArray } from './utils.js';
import { getUid } from '../data/authentication.js';
import { getQuestions } from '../data/database-client.js';

document.addEventListener("DOMContentLoaded", () => {
  const categoryButtons = document.querySelectorAll(".category-btn");
  const categorySelectionView = document.getElementById("category-selection-view");
  const nameInputView = document.getElementById("name-input-view");
  const usernameInput = document.getElementById("usernameInput");
  const startQuizBtn = document.getElementById("startQuizBtn");

  // Map simple keys to actual category names
  const categoryMap = {
    "javascript": "Web Development",
    "html-css": "HTML & CSS",
    "git": "Git",
    // add other mappings as needed
  };

  let selectedCategoryKey = null;

  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      const rawCategory = button.getAttribute("data-category");
      selectedCategoryKey = categoryMap[rawCategory] || rawCategory;

      // Show name input view, hide category selection
      categorySelectionView.style.display = "none";
      nameInputView.style.display = "block";
    });
  });

  startQuizBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    if (username === "") {
      alert("Please enter your name to start.");
      return;
    }

    // Store username and category locally for later use
    localStorage.setItem("quizUsername", username);
    localStorage.setItem("quizCategory", selectedCategoryKey);

    // Fetch questions for selected category and prepare quiz
    const uid = getUid();
    if (!uid) {
      alert("You need to be logged in to start a quiz.");
      return;
    }

    try {
      const returnObject = await getQuestions(uid, selectedCategoryKey);

      if (returnObject.status === 'success') {
        const allQuestions = returnObject.data;

        if (!allQuestions || !Array.isArray(allQuestions) || allQuestions.length === 0) {
          alert(`Sorry, no questions are currently available for the category: ${selectedCategoryKey}.`);
          return;
        }

        // Shuffle questions and select up to 10
        const quizQuestions = shuffleArray(allQuestions).slice(0, 10);

        if (quizQuestions.length === 0) {
          alert(`Not enough questions for the category: ${selectedCategoryKey}. Please try another one.`);
          return;
        }

        // Save questions and category for quiz page
        localStorage.setItem('selectedQuizCategory', selectedCategoryKey);
        localStorage.setItem('quizQuestions', JSON.stringify(quizQuestions));

        // Redirect to quiz page
        window.location.href = 'quiz.html';
      } else {
        alert(`Error loading questions: ${returnObject.message}. Please try again or select a different category.`);
      }
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      alert('An unexpected error occurred while preparing the quiz. Please try again.');
    }
  });
});

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
} else {
  if (document.getElementById('landing-page')) {
    console.error("Hamburger menu (.hamburger-menu) or navigation menu (.nav-menu) not found in index.html!");
  }
}
