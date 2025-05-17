let currentQuestion = 0
let score = 0
let quizQuestions = []

const questionText = document.getElementById('question-text')
const optionsContainer = document.getElementById('options-container')
const questionNumber = document.getElementById('question-number')
const scoreDisplay = document.getElementById('score')
const nextBtn = document.getElementById('next-btn')

fetch('quiz-data.json')
  .then((response) => response.json())
  .then((data) => {
    quizQuestions = data['Web Development']
    loadQuestion()
  })
  .catch((error) => {
    console.error('Failed to load quiz data:', error)
    questionText.textContent = 'Failed to load quiz. Please try again later.'
  })

function loadQuestion() {
  const q = quizQuestions[currentQuestion]
  questionText.textContent = q.question
  questionNumber.textContent = `Question ${currentQuestion + 1} of ${
    quizQuestions.length
  }`
  optionsContainer.innerHTML = ''
  nextBtn.disabled = true

  q.choices.forEach((choice) => {
    const button = document.createElement('button')
    button.textContent = choice
    button.className = 'option-btn'
    button.onclick = () => handleAnswer(button, choice)
    optionsContainer.appendChild(button)
  })
}

function handleAnswer(button, selected) {
  const q = quizQuestions[currentQuestion]
  const isCorrect = selected === q.answer

  if (isCorrect) {
    button.style.backgroundColor = '#a8e6a1' // Green
    score++
    scoreDisplay.textContent = `Score: ${score}`
  } else {
    button.style.backgroundColor = '#f8a1a1' // Red
    const correctBtn = [...optionsContainer.children].find(
      (btn) => btn.textContent === q.answer
    )
    if (correctBtn) correctBtn.style.backgroundColor = '#a8e6a1'
  }

  ;[...optionsContainer.children].forEach((btn) => (btn.disabled = true))
  nextBtn.disabled = false
}

nextBtn.onclick = () => {
  currentQuestion++
  if (currentQuestion < quizQuestions.length) {
    loadQuestion()
  } else {
    showFinalScore()
  }
}

function showFinalScore() {
  questionText.textContent = `Quiz Complete! Your final score is ${score} out of ${quizQuestions.length}.`
  optionsContainer.innerHTML = ''
  nextBtn.style.display = 'none'
  questionNumber.textContent = ''
}
