const activePage = window.location.pathname;
const navLinks = document.querySelectorAll('nav a').forEach (link => {
if(link.href.includes ( `${activePage}`)){
link.classList.add('active');
}
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".questions-icon-container");

  const pageMap = {
    "index.html": "web_dev",
    "comp_fundamentals.html": "computer_fundamentals",
    "programming_conc.html": "programming_concepts"
  };

  const path = window.location.pathname.split("/").pop();
  const endpoint = pageMap[path];

  if (!endpoint) return;

  fetch(`http://localhost:3000/${endpoint}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      data.forEach(questionObj => {
        container.insertBefore(createQuestionBlock(questionObj), container.lastElementChild);
      });
    })
    .catch(err => console.error("Failed to load questions:", err));
});

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function createQuestionBlock({ question, options, answer }) {
  const container = document.createElement("div");
  container.classList.add("questions-container");

  container.innerHTML = `
    <div class="quesion-textbox textbox">
      <label for="question">Question</label>
      <input type="text" class="question" placeholder="Question" value="${escapeHTML(question)}">
    </div>

    ${options.map((opt, idx) => `
      <div class="option${idx + 1}-textbox textbox">
        <label for="Option ${idx + 1}">Option ${idx + 1}</label>
        <input type="text" class="option${idx + 1}" placeholder="Option ${idx + 1}" value="${escapeHTML(opt)}">
      </div>
    `).join("")}

    <div class="answer-dropdown textbox">
      <label for="Answer">Answer</label>
      <select name="correct-answer">
        <option>Choose Correct Answer</option>
        ${options.map(opt => `
          <option value="${escapeHTML(opt)}" ${opt === answer ? "selected" : ""}>${escapeHTML(opt)}</option>
        `).join("")}
      </select>
    </div>

    <div class="delete-wrapper">
      <img src="imgs/delete.png" class="delete-icon" title="Delete Question" style="cursor: pointer;">
    </div>
  `;

  container.querySelector(".delete-icon").addEventListener("click", () => {
    container.remove(); 
  });

  return container;
}


document.addEventListener("DOMContentLoaded", () => {
 
  document.querySelector(".add-icon").addEventListener("click", () => {
    const newBlock = createQuestionBlock({
      question: "",
      options: ["", "", "", ""],
      answer: ""
    });

    const container = document.querySelector(".questions-icon-container");
    container.insertBefore(newBlock, container.lastElementChild);
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const scrollBtn = document.getElementById("scrollToBottomBtn");

  scrollBtn.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  });
});
