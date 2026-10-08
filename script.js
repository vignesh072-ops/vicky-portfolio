const soundToggle = document.querySelector(".sound-toggle");
const introCard = document.querySelector(".intro-card");
const mascot = document.querySelector(".mascot-stage");
const helloButton = document.querySelector(".hello-button");
const toast = document.querySelector(".toast");
const year = document.querySelector("#year");
const gameDialog = document.querySelector("#number-game-dialog");
const gameLaunch = document.querySelector(".game-launch");
const gameClose = document.querySelector(".dialog-close");
const guessForm = document.querySelector(".guess-form");
const guessInput = document.querySelector("#number-guess");
const gameFeedback = document.querySelector(".game-feedback");
const gameAttempts = document.querySelector(".game-attempts span");
const gameRestart = document.querySelector(".game-restart");
const bankDialog = document.querySelector("#banking-dialog");
const bankLaunch = document.querySelector(".bank-launch");
const bankClose = document.querySelector(".bank-dialog-close");
const bankingForm = document.querySelector(".banking-form");
const transactionAmount = document.querySelector("#transaction-amount");
const balanceValue = document.querySelector(".balance-value");
const bankingFeedback = document.querySelector(".banking-feedback");
const transactionList = document.querySelector(".transaction-list");

let soundEnabled = true;
let audioContext;
let toastTimer;
let secretNumber;
let guesses;
let balance;
let crewReadyTimer;
let helloButtonTimer;

year.textContent = new Date().getFullYear();

function startGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  guesses = 0;
  guessForm.reset();
  guessInput.disabled = false;
  guessForm.querySelector('button[type="submit"]').disabled = false;
  gameAttempts.textContent = "0";
  gameFeedback.textContent = "Make your first guess!";
  gameFeedback.classList.remove("is-won");
  gameRestart.hidden = true;
}

gameLaunch.addEventListener("click", () => {
  startGame();
  gameDialog.showModal();
  guessInput.focus();
});

gameClose.addEventListener("click", () => gameDialog.close());
gameDialog.addEventListener("click", (event) => {
  if (event.target === gameDialog) gameDialog.close();
});

guessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const guess = Number(guessInput.value);
  guesses += 1;
  gameAttempts.textContent = String(guesses);

  if (guess === secretNumber) {
    gameFeedback.textContent = `You got it! The number was ${secretNumber}. 🎉`;
    gameFeedback.classList.add("is-won");
    guessInput.disabled = true;
    guessForm.querySelector('button[type="submit"]').disabled = true;
    gameRestart.hidden = false;
  } else if (guess < secretNumber) {
    gameFeedback.textContent = "Too low — try a higher number!";
  } else {
    gameFeedback.textContent = "Too high — try a lower number!";
  }
});

gameRestart.addEventListener("click", () => {
  startGame();
  guessInput.focus();
});

function resetBankingDemo() {
  balance = 1250;
  balanceValue.textContent = formatCurrency(balance);
  bankingForm.reset();
  bankingFeedback.textContent = "Choose a transaction to try the demo.";
  transactionList.replaceChildren();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
}

bankLaunch.addEventListener("click", () => {
  resetBankingDemo();
  bankDialog.showModal();
  transactionAmount.focus();
});

bankClose.addEventListener("click", () => bankDialog.close());
bankDialog.addEventListener("click", (event) => {
  if (event.target === bankDialog) bankDialog.close();
});

bankingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = Number(transactionAmount.value);
  const action = event.submitter.value;

  if (!Number.isFinite(amount) || amount <= 0) {
    bankingFeedback.textContent = "Enter an amount greater than zero.";
    return;
  }

  if (action === "withdraw" && amount > balance) {
    bankingFeedback.textContent = "Not enough demo funds for that withdrawal.";
    return;
  }

  const isDeposit = action === "deposit";
  balance += isDeposit ? amount : -amount;
  balanceValue.textContent = formatCurrency(balance);
  bankingFeedback.textContent = `${isDeposit ? "Deposit" : "Withdrawal"} added to this demo.`;

  const transaction = document.createElement("li");
  const description = document.createElement("span");
  const transactionValue = document.createElement("span");
  description.textContent = isDeposit ? "Demo deposit" : "Demo withdrawal";
  transactionValue.textContent = `${isDeposit ? "+" : "−"}${formatCurrency(amount)}`;
  transactionValue.classList.add(isDeposit ? "deposit-amount" : "withdraw-amount");
  transaction.append(description, transactionValue);
  transactionList.prepend(transaction);
  bankingForm.reset();
  transactionAmount.focus();
});

function sayHello(message = "Hello! Nice to meet you. ✦") {
  introCard.classList.remove("is-playing");
  requestAnimationFrame(() => introCard.classList.add("is-playing"));
  window.setTimeout(() => introCard.classList.remove("is-playing"), 700);
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);

  if (!soundEnabled) return;

  audioContext ??= new AudioContext();
  if (audioContext.state === "suspended") audioContext.resume();

  const now = audioContext.currentTime;
  [880, 1174.66, 1567.98].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = now + index * 0.14;
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.985, start + 0.26);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.1, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.33);
  });
}

soundToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", `Turn intro sound ${soundEnabled ? "off" : "on"}`);
  soundToggle.querySelector(".sound-label").textContent = `Sound ${soundEnabled ? "on" : "off"}`;
});

mascot.addEventListener("click", () => {
  mascot.classList.add("is-ready");
  window.clearTimeout(crewReadyTimer);
  crewReadyTimer = window.setTimeout(() => mascot.classList.remove("is-ready"), 1800);
  sayHello("Heads up—we’re ready!");
});
introCard.addEventListener("click", (event) => {
  if (!event.target.closest(".sound-toggle")) sayHello();
});
helloButton.addEventListener("click", () => {
  helloButton.classList.remove("is-greeting");
  requestAnimationFrame(() => helloButton.classList.add("is-greeting"));
  window.clearTimeout(helloButtonTimer);
  helloButtonTimer = window.setTimeout(() => helloButton.classList.remove("is-greeting"), 600);
  sayHello();
});

const revealTargets = document.querySelectorAll(
  ".site-header, .hero-copy, .mascot-stage, .about .section-label, .about-content, .section-heading, .project-card, .contact, footer"
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -28px 0px" });

  revealTargets.forEach((target) => {
    target.dataset.reveal = "";
    revealObserver.observe(target);
  });
  document.body.classList.add("motion-ready");
}
