/* =============================================================
   WEEK 5 ASSIGNMENT — "Make It Interactive"
   JavaScript Quiz App Starter File

   HOW TO USE THIS FILE:
   ✅  index.html and styles/main.css are ALREADY COMPLETE.
       Do not edit them.

   ✅  The questions array (Part A) is filled in below.
       Replace the sample questions with your own topic.

   🔨 Your job: write the body of each function in Parts B and C.
       Each function has a comment describing what it should do.

   TIP: Open the browser console (F12 → Console) while you
        work — console.log() is your best debugging friend.
   ============================================================= */


/* =============================================================
   PART A: QUIZ DATA — REPLACE WITH YOUR OWN QUESTIONS ✏️
   ─────────────────────────────────────────────────────
   Rules:
   • At least 5 question objects
   • Each object needs:
       question:      the question text (string)
       options:       array of exactly 4 answer strings
       correctAnswer: must EXACTLY match one of the options
   ============================================================= */
const questions = [
  {
    question: "Which planet in our solar system is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  },
  {
    question: "How long does it take for the Earth to orbit the Sun?",
    options: ["1 day", "1 month", "1 year", "1 decade"],
    correctAnswer: "1 year"
  },
  {
    question: "Which planet in our solar system has the most moons?",
    options: ["Saturn", "Jupiter", "Uranus", "Neptune"],
    correctAnswer: "Saturn"
  },
  {
    question: "What is the name of the closest star to our Sun?",
    options: ["Sirius", "Betelgeuse", "Vega", "Proxima Centauri"],
    correctAnswer: "Proxima Centauri"
  },
  {
    question: "Approximately how long does it take for light from the Sun to reach Earth?",
    options: ["8 minutes", "30 seconds", "12 hours", "60 minutes"],
    correctAnswer: "8 minutes"
  }
];


/* =============================================================
   PART B: YOUR LOGIC FUNCTIONS
   Write the body of each function below.
   ============================================================= */

/*
 * checkAnswer(selected, correct)
 * ─────────────────────────────
 * Receives two strings — the answer the user picked and the
 * correct answer from the question object.
 * Should return true if they match, false if they don't.
 */
function checkAnswer(selected, correct) {
  return selected === correct;
}


/*
 * calculateScore(results)
 * ───────────────────────
 * Receives the results array — an array of true/false values,
 * one entry per question answered so far.
 * Should return how many of those values are true (correct answers).
 */
function calculateScore(results) {
  let score = 0;

  for (let i = 0; i < results.length; i++) {
    if (results[i] === true) {
      score++;
    }
  }
  return score;
}


/*
 * getGrade(score, total)
 * ──────────────────────
 * Receives the number of correct answers and the total questions.
 * Should calculate the percentage and return a letter grade:
 *   90% and above → 'A'
 *   80% and above → 'B'
 *   70% and above → 'C'
 *   60% and above → 'D'
 *   Below 60%     → 'F'
 */
function getGrade(score, total) {
  const percentage = (score / total) * 100;

  if (percentage >= 90) {
    return 'A';
  } else if (percentage >= 80) {
    return 'B';
  } else if (percentage >= 70) {
    return 'C';
  } else if (percentage >= 60) {
    return 'D';
  } else {
    return 'F';
  }

}


/* =============================================================
   PART C: DOM INTERACTION
   ─────────────────────────────────────────────────────
   The elements below are already selected for you using
   document.getElementById(). Each variable name matches an
   id in index.html — open that file to see what each one is.
   ============================================================= */

/* --- App State --- */
let currentIndex = 0;     // tracks which question we're on
let results = [];    // stores true/false per answered question
let answered = false; // prevents clicking more than once per question

/* --- Element References (already done ✅) --- */
const quizCard = document.getElementById('quizCard');
const resultsCard = document.getElementById('resultsCard');
const progressBar = document.getElementById('progressBar');
const questionCounter = document.getElementById('questionCounter');
const scoreBadge = document.getElementById('scoreBadge');
const questionText = document.getElementById('questionText');
const optionsGrid = document.getElementById('optionsGrid');
const feedbackBox = document.getElementById('feedbackBox');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

const resultsEmoji = document.getElementById('resultsEmoji');
const resultsTitle = document.getElementById('resultsTitle');
const resultsSubtitle = document.getElementById('resultsSubtitle');
const scoreDisplay = document.getElementById('scoreDisplay');
const gradeDisplay = document.getElementById('gradeDisplay');
const correctCount = document.getElementById('correctCount');
const wrongCount = document.getElementById('wrongCount');
const percentDisplay = document.getElementById('percentDisplay');

const LETTERS = ['A', 'B', 'C', 'D']; // used for the A B C D badges on buttons


/*
 * renderQuestion()
 * ────────────────
 * Reads the current question from the array (use currentIndex)
 * and updates the page to show it.
 *
 * This function needs to:
 *   1. Update the progress bar, question counter, and score badge
 *   2. Set the question text on the page
 *   3. Clear the options grid, then create one button per option
 *      — each button needs the letter badge, the option text,
 *        and a click event listener that calls handleOptionClick()
 *   4. Hide the feedback box and the Next button
 *
 * NOTE: When creating buttons, use document.createTextNode() to
 * add the option text — do NOT use innerHTML. Some answers contain
 * HTML tags like "<h1>" that would be parsed as real HTML otherwise.
 */
function renderQuestion() {
  answered = false;

  const currentQuestion = questions[currentIndex];
  const score = calculateScore(results);
  const progressPercent = (currentIndex / questions.length) * 100;

  progressBar.style.width = progressPercent + '%';
  questionCounter.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  scoreBadge.textContent = `Score: ${score}`;
  questionText.textContent = currentQuestion.question;

  optionsGrid.textContent = '';

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.classList.add('option-btn');

    const letterSpan = document.createElement('span');
    letterSpan.classList.add('option-letter');
    letterSpan.textContent = LETTERS[index];

    button.appendChild(letterSpan);
    button.appendChild(document.createTextNode(option));

    button.addEventListener('click', () => {
      handleOptionClick(option, button);
    });

    optionsGrid.appendChild(button);
  });

  feedbackBox.textContent = '';
  feedbackBox.className = 'feedback-box';
  nextBtn.classList.remove('show');
  nextBtn.textContent = 'Next Question →';
}


/*
 * handleOptionClick(selected, clickedBtn)
 * ───────────────────────────────────────
 * Called when the user clicks an answer button.
 *
 * This function needs to:
 *   1. Do nothing if the question has already been answered
 *   2. Check whether the selected answer is correct
 *   3. Record the result (push true or false into results)
 *   4. Disable all buttons so the user can't change their answer
 *   5. Add the 'correct' or 'wrong' CSS class to the clicked button
 *      (if wrong, also highlight which button was the correct answer)
 *   6. Show a feedback message telling the user if they were right or wrong
 *   7. Reveal the Next button (change its text to "See Results →" on the last question)
 */
function handleOptionClick(selected, clickedBtn) {
  if (answered) {
    return;
  }

  answered = true;

  const currentQuestion = questions[currentIndex];
  const isCorrect = checkAnswer(selected, currentQuestion.correctAnswer);
  results.push(isCorrect);

  const optionButtons = optionsGrid.querySelectorAll('.option-btn');

  optionButtons.forEach((button) => {
    button.disabled = true;

    const optionText = button.textContent.slice(1);
    if (optionText === currentQuestion.correctAnswer) {
      button.classList.add('correct');
    }
  });

  if (isCorrect) {
    clickedBtn.classList.add('correct');
    feedbackBox.textContent = 'Correct! Great job.';
    feedbackBox.className = 'feedback-box show correct';
  } else {
    clickedBtn.classList.add('wrong');
    feedbackBox.textContent = `Wrong. The correct answer is ${currentQuestion.correctAnswer}.`;
    feedbackBox.className = 'feedback-box show wrong';
  }

  scoreBadge.textContent = `Score: ${calculateScore(results)}`;
  nextBtn.classList.add('show');

  if (currentIndex === questions.length - 1) {
    nextBtn.textContent = 'See Results →';
  }
}


/*
 * showResults()
 * ─────────────
 * Called after the user answers the last question.
 *
 * This function needs to:
 *   1. Calculate the final score, percentage, and letter grade
 *   2. Fill in all the results screen elements
 *      (score, grade badge, correct count, wrong count, percentage)
 *   3. Hide the quiz card and reveal the results card
 */
function showResults() {
  const score = calculateScore(results);
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  const grade = getGrade(score, total);

  progressBar.style.width = '100%';
  scoreDisplay.innerHTML = `${score}<span>/${total}</span>`;
  gradeDisplay.textContent = grade;
  correctCount.textContent = score;
  wrongCount.textContent = total - score;
  percentDisplay.textContent = `${percentage}%`;

  if (grade === 'A' || grade === 'B') {
    resultsEmoji.textContent = '🎉';
    resultsTitle.textContent = 'Great work!';
    resultsSubtitle.textContent = 'You know your basketball facts.';
  } else if (grade === 'C' || grade === 'D') {
    resultsEmoji.textContent = '👍';
    resultsTitle.textContent = 'Nice effort!';
    resultsSubtitle.textContent = 'A little review and you can improve your score.';
  } else {
    resultsEmoji.textContent = '📚';
    resultsTitle.textContent = 'Keep practicing!';
    resultsSubtitle.textContent = 'Try again and see if you can beat your score.';
  }

  quizCard.style.display = 'none';
  resultsCard.classList.add('show');
}


/*
 * restartQuiz()
 * ─────────────
 * Called when the user clicks "Try Again".
 *
 * This function needs to:
 *   1. Reset currentIndex, results, and answered back to their starting values
 *   2. Hide the results card and show the quiz card again
 *   3. Call renderQuestion() to start from the first question
 */
function restartQuiz() {
  currentIndex = 0;
  results = [];
  answered = false;

  resultsCard.classList.remove('show');
  quizCard.style.display = 'block';
  renderQuestion();
}


/* =============================================================
   EVENT LISTENERS — ALREADY DONE FOR YOU ✅
   You do not need to change anything here.
   ============================================================= */

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
});

restartBtn.addEventListener('click', restartQuiz);


/* =============================================================
   INIT — runs renderQuestion() when the page first loads
   ============================================================= */
renderQuestion();
