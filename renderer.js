// DOM Elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const closeBtn = document.getElementById('close-btn');

// Timer State
let timer = null;
let currentMode = 'study';
let totalSeconds = 25 * 60;
let remainingSeconds = totalSeconds;
let isRunning = false;

const modeDurations = {
  study: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 10 * 60
};

// Web Audio API Chime for when time's up
function playChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 1.5);
  } catch (e) {
    console.log('Audio error:', e);
  }
}

function updateDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  minutesDisplay.textContent = String(minutes).padStart(2, '0');
  secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

// Mode Switcher
function setMode(mode) {
  currentMode = mode;
  modeBtns.forEach(btn => {
    if (btn.dataset.mode === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  totalSeconds = modeDurations[mode];
  resetTimer();
}

// Timer Controls
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  timer = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      playChime();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;
  clearInterval(timer);
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  remainingSeconds = totalSeconds;
  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => setMode(btn.dataset.mode));
});

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
});

closeBtn.addEventListener('click', () => {
  if (window.close) window.close();
});

// Initial Load
updateDisplay();
