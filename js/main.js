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
document.addEventListener('keydown', handleKeyPress); // used this link for reference https://stackoverflow.com/questions/38502560/whats-the-difference-between-keyup-keydown-keypress-and-input-events
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
    div.style.color = '';
    div.innerText = '';
    div.classList.remove('locked');
  });
  
  letters.forEach((key) => {
    key.style.backgroundColor = '';
    key.classList.remove('used');
  })
  
  messageEl.style.visibility = 'hidden';
}

// loads the keyboard in, has added functions for enter key and delete key.
function renderKeyboard() {
  letters.forEach((letterEl) => {
    letterEl.onclick = ({ target }) => {
      const letter = target.getAttribute('id');
      
      if (letter === 'enter-key') {
        handleSubmitWord();
        turn += 1;
        return;
      } else if (letter === 'delete-key') {
        handleDelete();
        return;
      } else {
        updateGuessedWords(letter);
        greyOutLetter(letter);
      }
    };
  });
}

function greyOutLetter(letter) {
  const letterButton = document.getElementById(letter);
  if (letterButton) {
    letterButton.classList.add('used');
  }
}

function handleKeyPress(event) {
  const key = event.key.toUpperCase();

  if (key === 'ENTER') {
    handleSubmitWord();
  } else if (key === 'BACKSPACE') {
    handleDelete();
  } else if (/^[A-Z]$/.test(key)) {
    updateGuessedWords(key);
  }
}

// Handles the submission, checks for valid word, checks word length, if correct winner, if wrong next row, pushes word into row, and moves to next row.
function handleSubmitWord() {
  const currentWord = getCurrentWordArr().join('');
  
  if (!animals.includes(currentWord.toLowerCase())) {
    handleInvalidWord();
    return;
  }
  
  
  guessedAnimal.push([]);
  
  if (currentWord.length !== 5) {
    return;
  } else if (currentWord === secretAnimal) {
    winner = 1;
  }
    
  if (guessedAnimal.length === 7 && !winner) {
    loser = 1;
  }
  
  let row = document.querySelectorAll('.row' + turn);
  
  row.forEach((letter) => {
    letter.classList.add('locked')
  })
  
  colorTile(currentWord, row);

  turn += 1;
  nextSquare = (turn - 1) * 5 + 1;
  render();
}

// delete key function
function handleDelete() {
  if (nextSquare <= 1) return;
  
  const lastletterEl = document.getElementById(nextSquare - 1);
  
  if (lastletterEl && !lastletterEl.classList.contains('locked')) {
    let currentWordArr = getCurrentWordArr();
    currentWordArr.pop();
    
    lastletterEl.textContent = '';
    
    nextSquare -= 1;
  }
}

// message for when a word isn't a valid animal name.
function handleInvalidWord() {
  messageEl.style.visibility = 'visible';
  messageEl.innerText = 'Invalid word, enter animal name';
  
  setTimeout(() => {
    messageEl.style.visibility = 'hidden';
  }, 3500);
}

// Adds letter to square, and moves to next square.
function updateGuessedWords(letter) {
  const currentWordArr = getCurrentWordArr();
  
  if (currentWordArr && currentWordArr.length < 5) {
    currentWordArr.push(letter);
    
    const nextSquareEl = document.getElementById(nextSquare.toString());
    
    if (nextSquareEl) { 
      nextSquareEl.textContent = letter.toUpperCase();
      nextSquare = nextSquare + 1;
    }
  }
}

// Determines how many words have been guessed so far, and puts them into a new array just for guessed words.
function getCurrentWordArr() {
  const numberOfGuessedWords = guessedAnimal.length
  return guessedAnimal[numberOfGuessedWords - 1] || [];
}

// logic for highlighting and flipping letters. Got help from AI tools, mainly just error correction. also referenced this YT video for the animations: https://youtube.com/shorts/TPzVxaqvNMg?si=xoJRAWqSQSpp81tx
function colorTile(guess, row) {
  row.forEach((tile, index) => {
    const letter = guess[index];

    const delay = index * 300; // 300ms delay between tile flip

    // Adds the flip animation class with delay
    setTimeout(() => {
      tile.classList.add('flip');

      tile.addEventListener('animationend', () => {
        tile.classList.remove('flip');
        
        if (secretAnimal[index] === letter) {
          // Letter is in the correct place
          tile.setAttribute("data-state", "correct");
          tile.style.backgroundColor = "#538d4e";
          tile.style.color = "white";
        } else if (secretAnimal.includes(letter)) {
          // Letter is in the word but in the incorrect place
          tile.setAttribute("data-state", "wrong-location");
          tile.style.backgroundColor = "#b59f3b";
          tile.style.color = "white";
        } else {
          // Letter is not in the word
          tile.setAttribute("data-state", "wrong");
          tile.style.backgroundColor = "#3a3a3c";
          tile.style.color = "white";
        }

        greyOutLetter(letter);

      }, {once: true});

    }, delay);
  });
}
    
// sends the winner/loser message when appropriate
function renderMessage() {
  if (winner === 1) {
    setTimeout(() => {
      messageEl.style.visibility = 'visible';
      messageEl.innerText = 'You got it!';
      resetBtn.style.visibility = 'visible';
    }, 2000)
  } else if (loser === 1) {
    setTimeout(() => {
      messageEl.style.visibility = 'visible';
      messageEl.innerText = `Nice try! The word was ${secretAnimal}`;
      resetBtn.style.visibility = 'visible';
    }, 2000)
  }
}

init();