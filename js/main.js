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

init();

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
  
function render() {
  renderMessage();
  renderKeyboard();
}
  
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

function handleSubmitWord() {
  const currentWord = getCurrentWordArr().join('');

  if (currentWord.length !== 5) {
    return;
  } else if (currentWord === secretAnimal) {
    winner = 1;
  }

  if (guessedAnimal.length === 6) {
    loser = 1;
  }

  guessedAnimal.push([]);

  let row = document.querySelectorAll('.row' + turn);

  row.forEach((letter) => {
    letter.classList.add('locked')
  })

  render();
}

function handleDelete() {
  const lastletterEl = document.getElementById((nextSquare - 1));

  if (lastletterEl && !lastletterEl.classList.contains('locked')) {
    let currentWordArr = getCurrentWordArr()
    currentWordArr.pop();

    lastletterEl.textContent = '';
    nextSquare = nextSquare - 1;
  }
}

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

function getCurrentWordArr() {
  const numberOfGuessedWords = guessedAnimal.length
  return guessedAnimal[numberOfGuessedWords - 1];
}

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