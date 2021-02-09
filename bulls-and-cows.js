const prompt = require("prompt-sync")({ sigint: true });

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

let secretNumber = getSecreteNumber();
let playerName = prompt(`Your name: `) || "Stranger";
let level = prompt(`Choose difficulty level: (easy/medium/hard) `) || "easy";
let guess = prompt(`What's the secret number? `);
let guessNumber = 0;
let gamesPlayed = 0;
let scores = [];
let limit = null;

function getLevel(level) {
  if (level === "medium") {
    limit = 10;
  }
  if (level === "hard") {
    limit = 5;
  }
  return limit;
}
getLevel(level);

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

function compareNumbers(secretNumber, guess) {
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
    if (bulls === 4) {
      gamesPlayed++;
      scores.push(guessNumber);
      let averageScore = scores.reduce((a, x) => a + x, 0) / scores.length;
      return `Good job, ${playerName}! You found the secret number!
Number of tries: ${guessNumber}
Games played: ${gamesPlayed} Scores: ${scores} Average score: ${averageScore}`;
    }
    if (bulls === 0 && cows === 0) {
      return getFunnyMessage();
    }
    let word1 = bulls === 1 ? "bull" : "bulls";
    let word2 = cows === 1 ? "cow" : "cows";
    return `${playerName}'s try: ${guess}
Hint: ${bulls} ${word1} and ${cows} ${word2}`;
  } else {
    return `Please enter 4 unique digits!`;
  }
}

function play(secretNumber, guess) {
  //   console.log(secretNumber);
  console.log(compareNumbers(secretNumber, guess));
  while (secretNumber !== guess) {
    guess = prompt(`Your next guess: `);
    console.log(compareNumbers(secretNumber, guess));
    if (limit && guessNumber === limit) {
      gamesPlayed++;
      scores.push(guessNumber * 2);
      let averageScore = scores.reduce((a, x) => a + x, 0) / scores.length;
      console.log(`Too many tries, ${playerName}! You loose!
Number of tries: ${guessNumber} + ${guessNumber}(penalty)
Games played: ${gamesPlayed} Scores: ${scores} Average score: ${averageScore}`);
      return;
    }
  }
}

play(secretNumber, guess);

function playAgain() {
  let answer = prompt("Wanna play again, champion? (yes/no) ");
  if (answer === "yes") {
    secretNumber = getSecreteNumber();
    guess = prompt(`What's the secret number? `);
    guessNumber = 1;
    play(secretNumber, guess);
  } else if (answer === "no") {
    console.log(`Didn't think so, coward!`);
    return;
  }
  playAgain();
}

playAgain();
