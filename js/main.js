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
const messageEl = document.querySelector();
const resetBtn = document.getElementById();
const board = document.querySelectorAll();

/*----------------------------- Event Listeners -----------------------------*/

/*-------------------------------- Functions --------------------------------*/

function init() {
  secretAnimal = animals[Math.floor(Math.random() * Animals.length)].toUpperCase();
  console.log(secretAnimal);
  winner = 0;
  loser = 0;
  guessedAnimal = [[]];
  turn =1;
  nextSquare = 1;
  guessedCount = 0;
  render();
  renderBoard();
}

function render() {
  renderMessage();
}

function renderBoard() {
  document.querySelectorAll('#board > div').forEach((div, i) => {
    div.style.backgroundColor = '';
    div.innerText = '';
  })
  

  messageEl.style.visibility = 'hidden';
}