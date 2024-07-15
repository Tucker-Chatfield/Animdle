/*-------------------------------- Constants --------------------------------*/
import {animals} from "./animals.js"
/*---------------------------- Variables (state) ----------------------------*/
let secretAnimal;
let winner;
let loser;
let turn;
let nextSquare;
let guessedAnimal;
let guessedCount;
/*------------------------ Cached Element References ------------------------*/
const messageEl = document.querySelector('.message');
const resetBtn = document.getElementById('reset-btn');
const board = document.querySelectorAll('#board > div');
const letters = document.querySelectorAll('.key-row button');

/*----------------------------- Event Listeners -----------------------------*/
resetBtn.addEventListener('click', init);

/*-------------------------------- Functions --------------------------------*/

// initializes the game
function init() {
  secretAnimal = animals[Math.floor(Math.random() * animals.length)].toUpperCase();
  console.log(secretAnimal);
  winner = 0;
  loser = 0;
  guessedAnimal = [[]];
  turn = 1;
  nextSquare = 1;
  guessedCount = 0;
  resetBtn.style.visibility = 'hidden'
  render();
  renderBoard();
}

// renders the game state
function render() {
  renderMessage();
  renderKeyboard();
}


// loads the tiles for the board in, and secures the winner/loser message hidden when it shouldn't be there.
function renderBoard() {
  board.forEach((div) => {
    div.style.backgroundColor = '';
    div.innerText = '';
  })
    
  letters.forEach((key) => {
    key.style.backgroundColor = '';
  })
    
  messageEl.style.visibility = 'hidden';
}

// loads the keyboard in, has added functions for enter key and delete key.
function renderKeyboard() {
  letters.forEach((letterEl) => {
    letterEl.onclick = ({ target }) => {
      const letter = target.getAttribute('id');
      
      if(letter === 'enter-key') {
        handleSubmitWord();
        turn += 1;
        return;
      } else if(letter === 'delete-key') {
        handleDelete();
        return;
      } else {
        updateGuessedWords(letter);
      }
    }
  });
}

// Handles the submission, checks for valid word, checks word length, if correct winner, if wrong next row, pushes word into row, and moves to next row.
function handleSubmitWord() {
  const currentWord = getCurrentWordArr().join('');

  if (!animals.includes(currentWord.toLowerCase())) {
    handleInvalidWord();
    return;
  }

  guessedAnimal.push([]);

  guessCheck(currentWord);

  if (currentWord.length !== 5) {
    return;
  } else if (currentWord === secretAnimal) {
    winner = 1;
  }

  if (guessedAnimal.length === 6 && !winner) {
    loser = 1;
  }


  let row = document.querySelectorAll('.row' + turn);

  row.forEach((letter) => {
    letter.classList.add('locked')
  })

  render();
}

// delete key function
function handleDelete() {
  const lastletterEl = document.getElementById((nextSquare - 1));

  if (lastletterEl && !lastletterEl.classList.contains('locked')) {
    let currentWordArr = getCurrentWordArr()
    currentWordArr.pop();

    lastletterEl.textContent = '';
    nextSquare -= 1;
  }
}

// Adds letter to square, and moves to next square.
function updateGuessedWords(letter) {
  const currentWordArr = getCurrentWordArr()
  
  if (currentWordArr && currentWordArr.length < 5) {
    currentWordArr.push(letter);
    
    const nextSquareEl = document.getElementById(nextSquare);
    
    if(nextSquareEl) { 
      nextSquareEl.textContent = letter;
      nextSquare = nextSquare + 1;
    }
  }
}

// referenced YouTube video for logic: https://www.youtube.com/watch?v=oKM2nQdQkIU
function guessCheck(guess) {
  const row = turn
  const animation_duration = 500;

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;
    const numOfOccurrencesSecret = getNumOfOccurencesInWord(secretAnimal, letter);
    const numOfOccurrencesGuess = getNumOfOccurencesInWord(guess, letter);
    const letterPosition = getPositionOfOccurence(guess, letter, i);

    setTimeout(() => {
      if (
        numOfOccurrencesGuess > numOfOccurrencesSecret && letterPosition > numOfOccurrencesSecret
      ) {
        box.classList.add('empty');
      } else {
        if (letter === secretAnimal[i]) {
          box.classList.add('right');
        } else if (secretAnimal.includes(letter)) {
          box.classList.add('wrong');
        } else {
          box.classList.add('empty');
        }
      }
    }, ((i + 1) * animation_duration) / 2);

    box.classList.add('animated');
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }
}

// Helper to get the number of occurrences of a letter in a word
function getNumOfOccurencesInWord(word, letter) {
  return word.split(letter).length - 1;
}

// Helper to get the position of a letter's occurrence in a word
function getPositionOfOccurence(word, letter, occurrence) {
  let position = -1;
  for (let i = 0; i <= occurrence; i++) {
    position = word.indexOf(letter, position + 1);
    if (position === -1) break;
  }
  return position;
}

// Determines how many words have been guessed so far, and puts them into a new array just for guessed words.
function getCurrentWordArr() {
  const numberOfGuessedWords = guessedAnimal.length
  return guessedAnimal[numberOfGuessedWords - 1] || [];
}

// message for when a word isn't a valid animal name.
function handleInvalidWord() {
  messageEl.style.visibility = 'visible';
  messageEl.innerText = 'Invalid word, enter animal name';

  setTimeout(() => {
    messageEl.style.visibility = 'hidden';
  }, 3500);
}

// sends the winner/loser message when appropriate
function renderMessage() {
  if (winner === 1) {
    setTimeout(() => {
      messageEl.style.visibility = 'visible';
      messageEl.innerText = 'You got it!';
      resetBtn.style.visibility = 'visible';
    }, 800)
  } else if (loser === 1) {
    setTimeout(() => {
      messageEl.style.visibility = 'visible';
      messageEl.innerText = `Nice try! The word was ${secretAnimal}`;
      resetBtn.style.visibility = 'visible';
    }, 800)
  }
}

init();