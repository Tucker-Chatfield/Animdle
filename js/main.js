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
  render();
  renderBoard();
}
  
function render() {
  //renderMessage();
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
  letters.forEach((letter) => {
    letter.onclick = ({ target }) => {
      const letter = target.getAttribute('id');
      
      updateGuessedWords(letter);
      
      // if(key === 'ENTER') {
      //   handleSubmitGuess();
      //   turn += 1;
      //   return;
      // } else if(key === 'DEL') {
      //   handleDelete();
      //   return;
      // }
    }
  })
}

function getCurrentWordArr() {
  const numberOfGuessedWords = guessedAnimal.length
  return guessedAnimal[numberOfGuessedWords - 1];
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