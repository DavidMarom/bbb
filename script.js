
const scoreEls = [document.getElementById('score-0'), document.getElementById('score-1')];
const playerEls = [document.querySelector('.player-0'), document.querySelector('.player-1')];
const dice1El = document.getElementById('dice1');
const dice2El = document.getElementById('dice2');
const statusText = document.getElementById('statusText');
const targetScoreInput = document.getElementById('targetScoreInput');

const btnNew = document.getElementById('btnNew');
const btnRoll = document.getElementById('btnRoll');
const btnHold = document.getElementById('btnHold');

let scores, activePlayer, targetScore, playing;

function getRandomPlayer() { return Math.random() < 0.5 ? 0 : 1 }

function setStatus(message, isDanger = false) {
  statusText.textContent = message;
  statusText.classList.toggle('status-danger', isDanger);
}

function updateUI() {
  scoreEls[0].textContent = scores[0];
  scoreEls[1].textContent = scores[1];

  playerEls.forEach((el, idx) => {
    el.classList.toggle('player-active', idx === activePlayer && playing);
    el.classList.toggle('player-winner', playing ? false : scores[idx] >= targetScore);
    el.classList.toggle('player-faded', !playing && scores[idx] < targetScore);
  });
}

function enableGameButtons(enabled) {
  btnRoll.disabled = !enabled;
  btnHold.disabled = !enabled;
}

function init(newTargetFromInput = true) {
  const minTarget = 10;
  const maxTarget = 500;

  if (newTargetFromInput) {
    let t = Number(targetScoreInput.value) || 50;
    if (t < minTarget) t = minTarget;
    if (t > maxTarget) t = maxTarget;
    targetScore = t;
    targetScoreInput.value = t;
  }

  scores = [0, 0];
  activePlayer = getRandomPlayer();
  playing = true;

  dice1El.textContent = '-';
  dice2El.textContent = '-';

  updateUI();
  enableGameButtons(true);

  setStatus(`Player ${activePlayer + 1} starts. Target score: ${targetScore}.`);
}

function switchPlayer(message) {
  activePlayer = activePlayer === 0 ? 1 : 0;
  updateUI();
  setStatus(message);
}

function rollDie() {
  return Math.trunc(Math.random() * 6) + 1;
}

btnRoll.addEventListener('click', () => {
  if (!playing) return;

  const d1 = rollDie();
  const d2 = rollDie();

  dice1El.textContent = d1;
  dice2El.textContent = d2;

  if (d1 === d2) {
    scores[activePlayer] = 0;
    updateUI();
    setStatus(
      `Double ${d1}! Player ${activePlayer + 1}'s total resets to 0. Turn passes to the other player.`,
      true
    );
    switchPlayer(`Player ${activePlayer + 1}'s turn.`);
    return;
  }

  const sum = d1 + d2;
  scores[activePlayer] += sum;
  updateUI();

  if (scores[activePlayer] >= targetScore) {
    playing = false;
    enableGameButtons(false);
    updateUI();
    setStatus(`Player ${activePlayer + 1} wins with ${scores[activePlayer]} points!`);
    return;
  }

  setStatus(`Player ${activePlayer + 1} rolled ${d1} + ${d2} = ${sum}. Total: ${scores[activePlayer]}. Roll again or pass?`);
});

btnHold.addEventListener('click', () => {
  if (!playing) return;
  switchPlayer(`Player ${activePlayer + 1}'s turn. Previous player passed.`);
});

btnNew.addEventListener('click', () => { init(true) });
targetScoreInput.addEventListener('change', () => { init(true) });

init(true);

