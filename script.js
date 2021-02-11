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
    for (let i = 0; i < guess.length; i++) {
      if (secretNumber[i] === guess[i]) {
        bulls++;
      } else if (secretNumber.includes(guess[i])) {
        cows++;
      }
    }

    // WIN
    if (bulls === 4) {
      // checkBtn.classList.add("disabled");
      gamesPlayed++;
      scores.push(guessNumber);
      let averageScore =
        Math.round((scores.reduce((a, x) => a + x, 0) / scores.length) * 100) /
        100;

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
      document.querySelector(".win-message4").textContent = `Scores: ${scores}`;
      document.querySelector(
        ".win-message5"
      ).textContent = `Average score: ${averageScore}`;
      return `Good job, ${playerName}! You found the secret number!
  Number of tries: ${guessNumber}
  Games played: ${gamesPlayed} Scores: ${scores} Average score: ${averageScore}`;
    }

    // LOSS
    if (limit && guessNumber === limit) {
      // checkBtn.classList.add("disabled");
      gamesPlayed++;
      scores.push(guessNumber * 2);
      let averageScore =
        Math.round((scores.reduce((a, x) => a + x, 0) / scores.length) * 100) /
        100;

      document.querySelector(".end-modal-loss").classList.remove("hidden");
      // document.querySelector(".end-modal-loss").style.backgroundColor = "red";
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
      ).textContent = `Scores: ${scores}`;
      document.querySelector(
        ".loss-message5"
      ).textContent = `Average score: ${averageScore}`;

      return `Too many tries, ${playerName}! You loose!
      Number of tries: ${guessNumber} + ${guessNumber}(penalty)
      Games played: ${gamesPlayed} Scores: ${scores} Average score: ${averageScore}`;
    }

    // 0 BULLS 0 COWS
    if (bulls === 0 && cows === 0) {
      return getFunnyMessage();
    }
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
});

// CHECK BUTTON
document.querySelector(".check").addEventListener("click", function () {
  guess = document.querySelector(".guess").value;

  document.querySelector(".message1").textContent = guess;
  document.querySelector(".message2").textContent = compareNumbers(
    secretNumber,
    guess
  );
  document.querySelector(".guess").value = "";
});

// PRESS ENTER TO CHECK NUMBER
document.addEventListener("keydown", function (e) {
  guess = document.querySelector(".guess").value;
  if (guess && e.key === "Enter") {
    document.querySelector(".message1").textContent = guess;
    document.querySelector(".message2").textContent = compareNumbers(
      secretNumber,
      guess
    );
    document.querySelector(".guess").value = "";
  }
});

// NO CONTINUE BUTTON
// WIN
document.querySelector(".no-btn-win").addEventListener("click", function () {
  document.querySelector(".end-modal-win").classList.add("hidden");
  document.querySelector(".no-modal").classList.remove("hidden");
});
// LOSS
document.querySelector(".no-btn-loss").addEventListener("click", function () {
  document.querySelector(".end-modal-win").classList.add("hidden");
  document.querySelector(".no-modal").classList.remove("hidden");
});

// YES PLAY AGAIN BUTTON
// WIN
document.querySelector(".yes-btn-win").addEventListener("click", function () {
  document.querySelector(".end-modal-win").classList.add("hidden");
  secretNumber = getSecreteNumber();
  guessNumber = 0;
  document.querySelector(".message1").textContent = "Go on!";
  document.querySelector(".message2").textContent = "Try your luck!";
});
// LOSS
document.querySelector(".yes-btn-loss").addEventListener("click", function () {
  document.querySelector(".end-modal-loss").classList.add("hidden");
  secretNumber = getSecreteNumber();
  guessNumber = 0;
  document.querySelector(".message1").textContent = "Go on!";
  document.querySelector(".message2").textContent = "Try your luck!";
});
