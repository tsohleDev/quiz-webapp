let currentQuestion = 0
let score = 0
let quizQuestions = []
let quizData = {}
let timer
let timeLeft = 15
let selectedTopic = ''

const startScreen = document.getElementById('start-screen')
const quizContainer = document.getElementById('quiz-container')
const startBtn = document.getElementById('start-btn')
const categoryCards = document.querySelectorAll('.category-card')

const questionText = document.getElementById('question-text')
const questionNumber = document.getElementById('question-number')
const optionsContainer = document.getElementById('options-container')
const scoreDisplay = document.getElementById('score')
const nextBtn = document.getElementById('next-btn')
const timerDisplay = document.getElementById('timer')
const progressBar = document.querySelector('.progress-bar')
const quizTopicDisplay = document.getElementById('quiz-topic')

fetch('quiz-data.json')
  .then((response) => response.json())
  .then((data) => {
    quizData = data
  })
  .catch((error) => {
    console.error('Error loading quiz data:', error)
  })

categoryCards.forEach((card) => {
  card.addEventListener('click', () => {
    categoryCards.forEach((c) => c.classList.remove('selected'))

    card.classList.add('selected')
    selectedTopic = card.dataset.topic
    startBtn.disabled = false
  })
})
startBtn.onclick = () => {
  if (!selectedTopic) return alert('Please select a category.')

  quizQuestions = shuffleArray(quizData[selectedTopic]).slice(0, 10)
  currentQuestion = 0
  score = 0

  scoreDisplay.textContent = 'Score: 0'
  progressBar.style.width = '0%'
  nextBtn.style.display = 'inline-block'
  startScreen.style.display = 'none'
  quizContainer.style.display = 'block'
  quizTopicDisplay.textContent = selectedTopic

  loadQuestion()
}
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5)
}

function loadQuestion() {
  clearInterval(timer)
  timeLeft = 15
  updateTimerDisplay()

  const q = quizQuestions[currentQuestion]
  questionText.textContent = q.question
  questionNumber.textContent = `Question ${currentQuestion + 1} of ${
    quizQuestions.length
  }`
  optionsContainer.innerHTML = ''
  nextBtn.disabled = true

  q.choices.forEach((choice) => {
    const btn = document.createElement('button')
    btn.textContent = choice
    btn.className = 'option-btn'
    btn.onclick = () => handleAnswer(btn, choice)
    optionsContainer.appendChild(btn)
  })

  startTimer()
}

function handleAnswer(button, selected) {
  clearInterval(timer)
  const q = quizQuestions[currentQuestion]
  const isCorrect = selected === q.answer

  if (isCorrect) {
    button.style.backgroundColor = '#a8e6a1'
    score++
    scoreDisplay.textContent = `Score: ${score}`
  } else {
    button.style.backgroundColor = '#f8a1a1'
    ;[...optionsContainer.children].find(
      (btn) => btn.textContent === q.answer
    ).style.backgroundColor = '#a8e6a1'
  }

  ;[...optionsContainer.children].forEach((btn) => (btn.disabled = true))
  nextBtn.disabled = false
}

nextBtn.onclick = () => {
  currentQuestion++
  if (currentQuestion < quizQuestions.length) {
    updateProgress()
    loadQuestion()
  } else {
    showFinalScore()
  }
}

function updateProgress() {
  const percent = (currentQuestion / quizQuestions.length) * 100
  progressBar.style.width = `${percent}%`
}

function startTimer() {
  timerDisplay.textContent = `Time Left: ${timeLeft}s`
  timer = setInterval(() => {
    timeLeft--
    updateTimerDisplay()

    if (timeLeft === 0) {
      clearInterval(timer)
      autoFailQuestion()
    }
  }, 1000)
}

function updateTimerDisplay() {
  timerDisplay.textContent = `Time Left: ${timeLeft}s`
}

function autoFailQuestion() {
  const q = quizQuestions[currentQuestion]
  const correctBtn = [...optionsContainer.children].find(
    (btn) => btn.textContent === q.answer
  )
  correctBtn.style.backgroundColor = '#a8e6a1'
  ;[...optionsContainer.children].forEach((btn) => (btn.disabled = true))
  nextBtn.disabled = false
}

function showFinalScore() {
  questionText.textContent = `Quiz Complete! Final Score: ${score}/${quizQuestions.length}`
  questionNumber.textContent = ''
  optionsContainer.innerHTML = ''
  timerDisplay.textContent = ''
  progressBar.style.width = '100%'

  nextBtn.style.display = 'none'

  saveScore(score, quizQuestions.length, selectedTopic)

  displayScoreboard()

  const restartBtn = document.createElement('button')
  restartBtn.textContent = 'Restart'
  restartBtn.className = 'next-btn'
  restartBtn.onclick = () => {
    startScreen.style.display = 'block'
    quizContainer.style.display = 'none'
    document.getElementById('scoreboard').style.display = 'none'
    restartBtn.remove()

    categoryCards.forEach((c) => c.classList.remove('selected'))
    selectedTopic = ''
    startBtn.disabled = true
  }
  quizContainer.appendChild(restartBtn)
}

function saveScore(score, totalQuestions, topic) {
  const scores = JSON.parse(localStorage.getItem('quizScores')) || []

  scores.push({
    score: score,
    total: totalQuestions,
    topic: topic,
    date: new Date().toISOString(),
  })

  localStorage.setItem('quizScores', JSON.stringify(scores))
}

function displayScoreboard() {
  const scoreboard = document.getElementById('scoreboard')
  const entriesContainer = document.getElementById('scoreboard-entries')

  const scores = JSON.parse(localStorage.getItem('quizScores')) || []

  const sortedScores = scores.sort((a, b) => {
    const percentageA = (a.score / a.total) * 100
    const percentageB = (b.score / b.total) * 100
    return percentageB - percentageA
  })

  entriesContainer.innerHTML = ''

  sortedScores.forEach((entry, index) => {
    const entryElement = document.createElement('div')
    entryElement.className = 'scoreboard-entry'

    const percentage = Math.round((entry.score / entry.total) * 100)

    entryElement.innerHTML = `
      <div>
        <span class="scoreboard-rank">${index + 1}.</span>
        <span class="scoreboard-score">${entry.score}/${
      entry.total
    } (${percentage}%)</span>
      </div>
      <div class="scoreboard-topic">${entry.topic}</div>
    `

    entriesContainer.appendChild(entryElement)
  })

  scoreboard.style.display = 'block'
}
