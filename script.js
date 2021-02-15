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

const checkBtn = document.querySelector(".check");
const startBtn = document.querySelector(".start");

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
  playerName = document.querySelector(".name").value || "Stranger";
  document.querySelector(".start-modal").classList.add("hidden");
  document.querySelector(".sub-heading").textContent += `, ${playerName}!`;
  document.querySelector(".quit-btn").classList.remove("hidden");
});

// CHECK THE PLAYER'S GUESS
function checkPlayersGuess() {
  let result = compareNumbers(secretNumber, guess);
  document.querySelector(".message1").textContent = guess;
  document.querySelector(".message2").textContent = result;

  if (validateGuess(guess)) {
    let messageGuess = document.createElement("p");
    messageGuess.appendChild(document.createTextNode(guess));
    let messageHint = document.createElement("p");
    messageHint.appendChild(document.createTextNode(result));
    document
      .querySelector(".guesses-box")
      .insertBefore(
        messageHint,
        document.querySelector(".guesses-box").firstChild
      );
    document
      .querySelector(".guesses-box")
      .insertBefore(
        messageGuess,
        document.querySelector(".guesses-box").firstChild
      );
  }

  document.querySelector(".guess").value = "";
}
////// BY CLICKING CHECK BUTTON
document.querySelector(".check").addEventListener("click", function () {
  guess = document.querySelector(".guess").value;
  checkPlayersGuess();
});
////// BY PRESSING ENTER
document.addEventListener("keydown", function (e) {
  guess = document.querySelector(".guess").value;
  if (guess && e.key === "Enter") {
    checkPlayersGuess();
  }
});

// MORE VARIABLES - MOVE UP!!!!!!!! todo
// plus check other stuff for refactoring!!!!! todo
const endModalWin = document.querySelector(".end-modal-win");
const endModalLoss = document.querySelector(".end-modal-loss");
const noAgainModal = document.querySelector(".no-modal");
const quitModal = document.querySelector(".quit-modal");
const overlay = document.querySelector(".overlay");

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
  document.querySelector(".message1").textContent = "Go on!";
  document.querySelector(".message2").textContent = "Try your luck!";
  document.querySelector(".guesses-box").textContent = "";
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
document.querySelector(".quit-btn").addEventListener("click", function () {
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

  document.querySelector(".start-modal").classList.remove("hidden");
  document.querySelector(".quit-btn").classList.add("hidden");
  document.querySelector(".sub-heading").textContent =
    "Guess the secret number";
  document.querySelector(".name").value = "";
  document.querySelector("#easy").checked = true;
  playAgainReset();
  gamesPlayed = 0;
  scores = [];
});
