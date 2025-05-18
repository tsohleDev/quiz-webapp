import { getUid } from '../data/authentication.js';
import { getQuestions, updateQuestions } from '../data/database-client.js';

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

// Global state
let currentCategoryKey = null;
let questionsDataCache = []; // To hold the currently displayed questions

// DOM Elements
const questionsDisplayContainer = document.querySelector(".questions-icon-container");
const addIconParentDiv = document.querySelector(".questions-icon-container .icon-container"); // The div containing the add icon
const saveChangesButton = document.getElementById("saveChangesBtn"); // Get the "Done" button

// Function to clear previously displayed questions and messages
function clearQuestionDisplayArea() {
    const existingBlocks = questionsDisplayContainer.querySelectorAll(".questions-container");
    existingBlocks.forEach(block => block.remove());

    const messages = questionsDisplayContainer.querySelectorAll("p[id$='-questions-message']"); // Matches loading-questions-message, no-questions-message etc.
    messages.forEach(msg => msg.remove());
}

// Function to render questions
function renderQuestions(questions) {
    clearQuestionDisplayArea(); // Clear before rendering
    if (questions && questions.length > 0) {
        questions.forEach(questionObj => {
            // Ensure questionObj has question, choices (as options), and answer
            const questionBlock = createQuestionBlock({
                question: questionObj.question,
                options: questionObj.choices, // Map 'choices' to 'options'
                answer: questionObj.answer,
                id: questionObj.id // Pass ID for potential future use (e.g., updating specific questions)
            });
            if (addIconParentDiv) {
                questionsDisplayContainer.insertBefore(questionBlock, addIconParentDiv);
            } else {
                questionsDisplayContainer.appendChild(questionBlock); // Fallback if addIconParentDiv is not found
            }
        });
    } else {
        const noQuestionsMessage = document.createElement('p');
        noQuestionsMessage.textContent = 'No questions found for this category. Click the "+" icon to add some!';
        noQuestionsMessage.id = 'no-questions-message';
        if (addIconParentDiv) {
            questionsDisplayContainer.insertBefore(noQuestionsMessage, addIconParentDiv);
        } else {
            questionsDisplayContainer.appendChild(noQuestionsMessage);
        }
    }
}

// Function to handle category button clicks
async function handleCategorySelect(categoryKey, clickedButton) {
    if (!categoryKey) {
        console.error("Category key is undefined.");
        if (saveChangesButton) saveChangesButton.disabled = true; // Disable save if no key
        return;
    }
    currentCategoryKey = categoryKey;
    console.log(`Fetching questions for category: ${currentCategoryKey}`);

    document.querySelectorAll('.nav-links .category-button, .nav-links li button').forEach(btn => btn.classList.remove('active'));
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    if (saveChangesButton) saveChangesButton.disabled = false; // Enable save button

    clearQuestionDisplayArea();

    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Loading questions...';
    loadingMessage.id = 'loading-questions-message';
    if (addIconParentDiv) {
        questionsDisplayContainer.insertBefore(loadingMessage, addIconParentDiv);
    } else {
        questionsDisplayContainer.appendChild(loadingMessage);
    }

    const uid = getUid();
    if (!uid) {
        console.error("UID not found.");
        loadingMessage.remove();
        if (saveChangesButton) saveChangesButton.disabled = true; // Disable on error
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Error: User not identified. Cannot load questions.';
        errorMsg.style.color = 'red';
        errorMsg.id = 'error-questions-message';
        if (addIconParentDiv) {
            questionsDisplayContainer.insertBefore(errorMsg, addIconParentDiv);
        } else {
            questionsDisplayContainer.appendChild(errorMsg);
        }
        return;
    }

    const result = await getQuestions(uid, currentCategoryKey);
    loadingMessage.remove();

    if (result.status === 'success') {
        questionsDataCache = result.data || [];
        renderQuestions(questionsDataCache);
    } else {
        console.error("Failed to load questions:", result.message);
        if (saveChangesButton) saveChangesButton.disabled = true; // Disable on error
        const errorMsg = document.createElement('p');
        errorMsg.textContent = `Error loading questions: ${result.message}`;
        errorMsg.style.color = 'red';
        errorMsg.id = 'error-questions-message';
        if (addIconParentDiv) {
            questionsDisplayContainer.insertBefore(errorMsg, addIconParentDiv);
        } else {
            questionsDisplayContainer.appendChild(errorMsg);
        }
        questionsDataCache = [];
    }
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Modified to accept and potentially use an ID
function createQuestionBlock({ question, options, answer, id }) {
  const container = document.createElement("div");
  container.classList.add("questions-container");
  if (id) {
    container.dataset.id = id; // Store original ID if present
  }

  // Ensure options is an array, default to 4 empty strings if not
  const currentOptions = Array.isArray(options) ? options : ["", "", "", ""];
  // Ensure there are at least 4 options for the input fields, padding with empty strings if necessary
  const displayOptions = [...currentOptions];
  while (displayOptions.length < 4) {
    displayOptions.push("");
  }


  container.innerHTML = `
    <div class="quesion-textbox textbox">
      <label for="question-${id || 'new'}">Question</label>
      <input type="text" id="question-${id || 'new'}" class="question" placeholder="Question" value="${escapeHTML(question)}">
    </div>

    ${displayOptions.slice(0, 4).map((opt, idx) => `
      <div class="option${idx + 1}-textbox textbox">
        <label for="option${idx + 1}-${id || 'new'}">Option ${idx + 1}</label>
        <input type="text" id="option${idx + 1}-${id || 'new'}" class="option${idx + 1}" placeholder="Option ${idx + 1}" value="${escapeHTML(opt)}">
      </div>
    `).join("")}

    <div class="answer-dropdown textbox">
      <label for="answer-${id || 'new'}">Answer</label>
      <select name="correct-answer" id="answer-${id || 'new'}">
        <option value="">Choose Correct Answer</option>
        ${currentOptions.map(opt => opt ? // Only create options for non-empty strings from original options
          `<option value="${escapeHTML(opt)}" ${escapeHTML(opt) === escapeHTML(answer) ? "selected" : ""}>${escapeHTML(opt)}</option>` : ''
        ).join("")}
      </select>
    </div>

    <div class="delete-wrapper">
      <img src="src/asset/images/delete.png" class="delete-icon" title="Delete Question" style="cursor: pointer;">
    </div>
  `;

  container.querySelector(".delete-icon").addEventListener("click", () => {
    container.remove();
  });

  // Add event listeners to update select options if an option input changes
  displayOptions.slice(0, 4).forEach((_, idx) => {
    const optionInput = container.querySelector(`.option${idx + 1}`);
    if (optionInput) {
        optionInput.addEventListener('input', () => {
            const answerSelect = container.querySelector("select[name='correct-answer']");
            const currentAnswerValue = answerSelect.value;
            // Get all current option values from inputs
            const newOptionValues = Array.from(container.querySelectorAll('input[class^="option"]'))
                                       .map(input => input.value.trim())
                                       .filter(value => value !== ""); // Filter out empty options

            answerSelect.innerHTML = '<option value="">Choose Correct Answer</option>'; // Reset
            newOptionValues.forEach(optVal => {
                const optionElement = document.createElement('option');
                optionElement.value = escapeHTML(optVal);
                optionElement.textContent = escapeHTML(optVal);
                if (escapeHTML(optVal) === currentAnswerValue) {
                    optionElement.selected = true;
                }
                answerSelect.appendChild(optionElement);
            });
            // If the previously selected answer is no longer a valid option, reset selection
            if (currentAnswerValue && !newOptionValues.map(escapeHTML).includes(escapeHTML(currentAnswerValue))) {
                 answerSelect.value = "";
            }
        });
    }
  });


  return container;
}

document.addEventListener("DOMContentLoaded", () => {
    // Setup category button listeners
    const categoryButtons = document.querySelectorAll(".nav-links .category-button");
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener("click", () => {
                const categoryKey = button.dataset.categorykey;
                handleCategorySelect(categoryKey, button);
            });
        });
    } else {
        // Fallback for original HTML structure (less robust)
        console.warn("Using fallback for category buttons. Please update admin.html with 'category-button' class and 'data-categorykey' attribute for better reliability.");
        const navListItems = document.querySelectorAll(".nav-links li");
        const categoryMap = {
            0: { text: "Web Dev", key: "Web Development" },
            1: { text: "Comp Fund", key: "Computer Fundamentals" },
            2: { text: "Prog Conc", key: "Programming Concepts" }
        };
        navListItems.forEach((li, index) => {
            const button = li.querySelector('button');
            if (button && categoryMap[index]) {
                if (button.textContent.includes(categoryMap[index].text)) {
                    button.addEventListener("click", () => {
                        document.querySelectorAll('.nav-links li button').forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        handleCategorySelect(categoryMap[index].key, button);
                    });
                }
            }
        });
    }

    const addIcon = document.querySelector(".add-icon");
    if (addIcon && addIconParentDiv) {
        addIcon.addEventListener("click", () => {
            if (!currentCategoryKey) {
                alert("Please select a category first before adding questions.");
                return;
            }
            // Ensure save button is enabled if a category is selected and user adds a question
            if (saveChangesButton && currentCategoryKey) {
                saveChangesButton.disabled = false;
            }
            const newBlock = createQuestionBlock({
                question: "",
                options: ["", "", "", ""],
                answer: "",
                id: null // New question, no existing ID
            });
            questionsDisplayContainer.insertBefore(newBlock, addIconParentDiv);
        });
    } else {
        console.error("Add icon or its container not found. Add question functionality may not work.");
    }

    // --- Save Changes Functionality (Attached to the "Done" button) ---
    if (saveChangesButton) {
        saveChangesButton.addEventListener("click", async () => {
            if (!currentCategoryKey) {
                alert("Please select a category whose questions you want to save.");
                saveChangesButton.disabled = true; // Should already be, but ensure
                return;
            }
            const uid = getUid();
            if (!uid) {
                alert("User not identified. Cannot save changes.");
                return;
            }

            const questionBlocksOnPage = document.querySelectorAll(".questions-container");
            const questionsToSave = [];
            let validationPassed = true;

            questionBlocksOnPage.forEach((block, index) => {
                const questionInput = block.querySelector(".question");
                const optionInputs = [
                    block.querySelector(".option1"),
                    block.querySelector(".option2"),
                    block.querySelector(".option3"),
                    block.querySelector(".option4")
                ];
                const answerSelect = block.querySelector("select[name='correct-answer']");
                const originalId = block.dataset.id || `new_${Date.now()}_${index}`; // Use original ID or generate new

                const questionText = questionInput ? questionInput.value.trim() : "";
                const choices = optionInputs.map(optInput => optInput ? optInput.value.trim() : "");
                const answer = answerSelect ? answerSelect.value : "";

                if (!questionText) {
                    alert(`Question ${index + 1} text cannot be empty.`);
                    validationPassed = false; return;
                }
                if (choices.some(choice => choice === "")) { // Ensure all 4 options are filled
                    alert(`All 4 options for question ${index + 1} must be filled.`);
                    validationPassed = false; return;
                }
                if (!answer) {
                    alert(`Please select an answer for question ${index + 1}.`);
                    validationPassed = false; return;
                }
                if (!choices.includes(answer)) {
                    alert(`The selected answer for question ${index + 1} ("${answer}") is not among its options. Please correct.`);
                    validationPassed = false; return;
                }

                questionsToSave.push({
                    id: originalId,
                    question: questionText,
                    choices: choices,
                    answer: answer
                });
            });

            if (!validationPassed) {
                return; // Stop if any validation failed
            }
            
            if (questionsToSave.length === 0 && questionBlocksOnPage.length > 0) {
                alert("No valid questions to save. Please check the fields.");
                return;
            }
            if (questionsToSave.length === 0 && questionBlocksOnPage.length === 0) {
                if (!confirm(`There are no questions on the page for category "${currentCategoryKey}". Do you want to save an empty set (this will delete existing questions for this user and category)?`)) {
                    return;
                }
            } else if (!confirm(`Are you sure you want to save ${questionsToSave.length} questions to category "${currentCategoryKey}"? This will overwrite existing questions for this user and category.`)) {
                return;
            }


            saveChangesButton.disabled = true;
            saveChangesButton.textContent = "Saving...";

            const result = await updateQuestions(uid, currentCategoryKey, questionsToSave);
            alert(result.message);

            saveChangesButton.disabled = false;
            saveChangesButton.textContent = "Done"; // Reset button text

            if (result.status === 'success') {
                // Optionally, refresh the displayed questions
                handleCategorySelect(currentCategoryKey, document.querySelector(`.category-button[data-categorykey="${currentCategoryKey}"].active, .nav-links li button.active`));
            }
        });
    }
});