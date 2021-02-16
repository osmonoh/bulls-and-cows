"Use strict";

// GENERATES SECRET NUMBER
function getSecreteNumber() {
  let secretNumber = "";
  while (secretNumber.length < 4) {
    let randomNumber = Math.floor(Math.random() * 10);

    if (!secretNumber.includes(randomNumber)) {
      secretNumber += randomNumber;
    }
  }
  return secretNumber;
}

// VARIABLES
let secretNumber = getSecreteNumber();
let playerName = "Stranger";
let guess = "";
let guessNumber = 0;
let gamesPlayed = 0;
let scores = [];
let limit = null;
let message = "";

const startModal = document.querySelector(".start-modal");
const nameInput = document.querySelector(".name");
const startBtn = document.querySelector(".start");
const gameSubHeading = document.querySelector(".sub-heading");
const guessInput = document.querySelector(".guess");
const guessMessage = document.querySelector(".message1");
const hintMessage = document.querySelector(".message2");
const checkBtn = document.querySelector(".check");
const pastGuessesBox = document.querySelector(".guesses-box");
const endModalWin = document.querySelector(".end-modal-win");
const endModalLoss = document.querySelector(".end-modal-loss");
const noAgainModal = document.querySelector(".no-modal");
const quitButton = document.querySelector(".quit-btn");
const quitModal = document.querySelector(".quit-modal");
const overlay = document.querySelector(".overlay");

// SETS THE DIFFICULTY LEVEL
function getLevel(level) {
  if (level === "medium") {
    limit = 10;
  }
  if (level === "hard") {
    limit = 5;
  }
  return limit;
}

// VALIDATES THE INPUT
function validateGuess(guess) {
  if (guess.length !== 4) {
    return false;
  }
  for (let char of guess) {
    if (guess.indexOf(char) !== guess.lastIndexOf(char)) {
      return false;
    }
    if (!Number(char) && char !== "0") {
      return false;
    }
  }
  return true;
}

// GENERATES MESSAGE IF NO BULL AND NO COW
function getFunnyMessage() {
  const messages = [
    "You are clueless!",
    "Give up, smartass!",
    "Your cattle is on holiday!",
    "Literally zero!",
  ];
  let i = Math.floor(Math.random() * messages.length);
  return messages[i];
}

// COMPARES THE NUMBERS AND RETURNS THE RESULT
function compareNumbers(secretNumber, guess) {
  console.log(secretNumber);
  if (validateGuess(guess)) {
    guessNumber++;
    let bulls = 0;
    let cows = 0;
    function getAverageScore(scores) {
      return (
        Math.round((scores.reduce((a, x) => a + x, 0) / scores.length) * 100) /
        100
      );
    }
    for (let i = 0; i < guess.length; i++) {
      if (secretNumber[i] === guess[i]) {
        bulls++;
      } else if (secretNumber.includes(guess[i])) {
        cows++;
      }
    }

    // WIN
    if (bulls === 4) {
      gamesPlayed++;
      scores.push(guessNumber);
      let averageScore = getAverageScore(scores);

      document.querySelector(".end-modal-win").classList.remove("hidden");
      document.querySelector(
        ".win-heading"
      ).textContent = `Good job, ${playerName}!`;
      document.querySelector(
        ".win-sub-heading"
      ).textContent = `You found the secret number!`;
      document.querySelector(
        ".win-message2"
      ).textContent = `Number of tries: ${guessNumber}`;
      document.querySelector(
        ".win-message3"
      ).textContent = `Games played: ${gamesPlayed}`;
      document.querySelector(
        ".win-message4"
      ).textContent = `Scores: ${scores.join(", ")}`;
      document.querySelector(
        ".win-message5"
      ).textContent = `Average score: ${averageScore}`;
      return;
    }

    // LOSS
    if (limit && guessNumber === limit) {
      gamesPlayed++;
      scores.push(guessNumber * 2);
      let averageScore = getAverageScore(scores);

      document.querySelector(".end-modal-loss").classList.remove("hidden");
      document.querySelector(
        ".loss-heading"
      ).textContent = `You loose, ${playerName}!`;
      document.querySelector(
        ".loss-sub-heading"
      ).textContent = `You've tried too many times!`;
      document.querySelector(
        ".loss-message2"
      ).textContent = `Number of tries: ${guessNumber} + ${guessNumber}(penalty)`;
      document.querySelector(
        ".loss-message3"
      ).textContent = `Games played: ${gamesPlayed}`;
      document.querySelector(
        ".loss-message4"
      ).textContent = `Scores: ${scores.join(", ")}`;
      document.querySelector(
        ".loss-message5"
      ).textContent = `Average score: ${averageScore}`;
      return;
    }

    // 0 BULLS 0 COWS
    if (bulls === 0 && cows === 0) {
      return getFunnyMessage();
    }
    // HINT MESSAGE
    let word1 = bulls === 1 ? "bull" : "bulls";
    let word2 = cows === 1 ? "cow" : "cows";
    return `${bulls} ${word1} and ${cows} ${word2}`;

    // INVALID INPUT
  } else {
    return `Please enter 4 unique digits!`;
  }
}

// START BUTTON
startBtn.addEventListener("click", function () {
  for (let radio of document.querySelectorAll(".level")) {
    if (radio.checked) {
      let level = radio.value;
      getLevel(level);
    }
  }
  playerName = nameInput.value || "Stranger";
  startModal.classList.add("hidden");
  gameSubHeading.textContent += `, ${playerName}!`;
  document.querySelector(".quit-btn").classList.remove("hidden");
});

// CHECK THE PLAYER'S GUESS
function checkPlayersGuess() {
  let result = compareNumbers(secretNumber, guess);
  guessMessage.textContent = guess;
  hintMessage.textContent = result;

  if (validateGuess(guess)) {
    let messageGuess = document.createElement("p");
    messageGuess.appendChild(document.createTextNode(guess));
    let messageHint = document.createElement("p");
    messageHint.appendChild(document.createTextNode(result));
    pastGuessesBox.insertBefore(messageHint, pastGuessesBox.firstChild);
    pastGuessesBox.insertBefore(messageGuess, pastGuessesBox.firstChild);
  }

  guessInput.value = "";
}
////// BY CLICKING CHECK BUTTON
checkBtn.addEventListener("click", function () {
  guess = guessInput.value;
  checkPlayersGuess();
});
////// BY PRESSING ENTER
document.addEventListener("keydown", function (e) {
  guess = guessInput.value;
  if (guess && e.key === "Enter") {
    checkPlayersGuess();
  }
});

// NO PLAY AGAIN BUTTON
function showNoContinueScreen() {
  if (!endModalWin.classList.contains("hidden")) {
    endModalWin.classList.add("hidden");
  }
  if (!endModalLoss.classList.contains("hidden")) {
    endModalLoss.classList.add("hidden");
  }
  noAgainModal.classList.remove("hidden");
}
////// WIN
document
  .querySelector(".no-btn-win")
  .addEventListener("click", showNoContinueScreen);
////// LOSS
document
  .querySelector(".no-btn-loss")
  .addEventListener("click", showNoContinueScreen);

// YES PLAY AGAIN BUTTON
function playAgainReset() {
  secretNumber = getSecreteNumber();
  guessNumber = 0;
  guessMessage.textContent = "Go on!";
  hintMessage.textContent = "Try your luck!";
  pastGuessesBox.textContent = "";
}
////// WIN
document.querySelector(".yes-btn-win").addEventListener("click", function () {
  endModalWin.classList.add("hidden");
  playAgainReset();
});
////// LOSS
document.querySelector(".yes-btn-loss").addEventListener("click", function () {
  endModalLoss.classList.add("hidden");
  playAgainReset();
});

// QUIT BUTTON
quitButton.addEventListener("click", function () {
  quitModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

// QUIT MODAL
function closeQuitModal() {
  quitModal.classList.add("hidden");
  overlay.classList.add("hidden");
}
////// NO QUIT BUTTON
document.querySelector(".quit-no").addEventListener("click", closeQuitModal);
////// NO QUIT CLICK ON OVERLAY
overlay.addEventListener("click", closeQuitModal);
////// NO QUIT PRESS ESC
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !quitModal.classList.contains("hidden")) {
    closeQuitModal();
  }
});
////// YES QUIT BUTTON
document.querySelector(".quit-yes").addEventListener("click", function () {
  closeQuitModal();

  if (!endModalWin.classList.contains("hidden")) {
    endModalWin.classList.add("hidden");
  }
  if (!endModalLoss.classList.contains("hidden")) {
    endModalLoss.classList.add("hidden");
  }
  if (!noAgainModal.classList.contains("hidden")) {
    noAgainModal.classList.add("hidden");
  }

  startModal.classList.remove("hidden");
  quitButton.classList.add("hidden");
  gameSubHeading.textContent = "Guess the secret number";
  nameInput.value = "";
  document.querySelector("#easy").checked = true;
  guessInput.value = "";
  playAgainReset();
  gamesPlayed = 0;
  scores = [];
});
