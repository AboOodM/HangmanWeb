import './style.css';
import { createGame, guess, mistakes, status } from './game.js';

const icons = {
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>',
  refresh: '<svg viewBox="0 0 24 24"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 7a7 7 0 0 1 11.6-1L20 9M4 15l2.3 3A7 7 0 0 0 18 17"/></svg>',
  bulb: '<svg viewBox="0 0 24 24"><path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 .8-1 2-1 2H9s0-1.2-1-2Z"/></svg>',
};
let game = createGame();
let hintOpen = false;
let recorded = false;
let stats;
try { stats = JSON.parse(localStorage.getItem('hangman-stats')) || {}; } catch { stats = {}; }
stats = { played: Number(stats.played) || 0, won: Number(stats.won) || 0, streak: Number(stats.streak) || 0 };

document.querySelector('#app').innerHTML = `
  <header class="site-header"><a class="brand" href="./" aria-label="Hangman home"><span class="brand-icon">h<span>·</span></span>hangman<span class="brand-dot">.</span></a><button class="help-button" id="help"><span>?</span> How to play</button></header>
  <main>
    <section class="intro"><div class="eyebrow"><span></span> A LITTLE WORDPLAY FOR YOUR DAY</div><h1>Good guesses.<br><em>Great escapes.</em></h1><p>One mystery word. A handful of chances.<br>Let’s see where your letters take you.</p></section>
    <section class="game-card" aria-label="Hangman game">
      <div class="game-toolbar"><div class="live-label"><span></span> LET’S PLAY</div><div class="difficulty-control"><label for="difficulty">Difficulty</label><select id="difficulty"><option value="easy">Easy</option><option value="medium" selected>Medium</option><option value="hard">Hard</option></select></div></div>
      <div class="play-area"><div class="drawing-panel"><div class="paper-label">THE HANGOUT</div><svg class="hangman" viewBox="0 0 260 255" role="img" aria-label="Hangman drawing"><g class="scaffold"><path d="M38 228H226M68 228V27H168V57M68 59l32-32"/></g><g class="person"><circle data-part="1" cx="168" cy="80" r="23"/><path data-part="2" d="M168 103v59"/><path data-part="3" d="m168 117-34 27"/><path data-part="4" d="m168 117 34 27"/><path data-part="5" d="m168 162-28 41"/><path data-part="6" d="m168 162 28 41"/></g><g class="face"><path d="m159 77 3 1m11-1 3 1m-14 9q6 6 12 0"/></g></svg><div class="chances" id="chances"></div><p class="drawing-caption" id="drawing-caption">Every letter is a new possibility.</p><span class="doodle">✳</span></div>
      <div class="word-panel"><div class="category" id="category"></div><h2 id="prompt">Find the hidden word</h2><p class="word-subtitle" id="word-subtitle">A little curiosity goes a long way.</p><div class="word" id="word" aria-label="Hidden word"></div><div class="guess-info" id="guess-info" aria-live="polite"></div><button class="hint-button" id="hint">${icons.bulb}<span>Need a little hint?</span><span class="hint-plus">+</span></button><p id="clue" class="clue" hidden></p></div></div>
      <div class="keyboard-area"><div class="keyboard" id="keyboard" aria-label="Letter keyboard"></div><div class="keyboard-footer"><span><span class="keyboard-icon">⌨</span> Your keyboard works here, too</span><button id="new-game">${icons.refresh} New word</button></div></div>
    </section>
    <section class="stats" aria-label="Your statistics"><div><span class="stat-icon">⚑</span><div><strong id="played">0</strong><span>WORDS PLAYED</span></div></div><div><span class="stat-icon">☆</span><div><strong id="won">0</strong><span>WORDS SOLVED</span></div></div><div><span class="stat-icon streak-icon">ϟ</span><div><strong id="streak">0</strong><span>CURRENT STREAK</span></div></div></section>
    <p class="daily-note">A small pause. A little puzzle. A sharper mind.</p>
  </main><footer><span>Made for the love of words.</span><span>TAKE A GUESS. MAKE IT COUNT. <span class="footer-star">✳</span></span></footer>
  <dialog id="help-dialog"><button class="close-dialog" aria-label="Close instructions">×</button><div class="eyebrow">THE SHORT VERSION</div><h2>A word is waiting.</h2><p>Guess the hidden word one letter at a time. Click a letter or use your keyboard. Correct guesses reveal every matching letter; wrong guesses add to the drawing.</p><p>Solve the word before your chances run out. Easy gives you 8 chances, Medium 6, and Hard 5. Hints are always free.</p><p>Your stats stay in this browser. Choosing a new word or difficulty starts a fresh round.</p><button class="primary-button" id="got-it">Let’s play ${icons.arrow}</button></dialog>`;

function render() {
  const state = status(game);
  const wrong = mistakes(game);
  if (state !== 'playing' && !recorded) {
    stats.played++;
    if (state === 'won') { stats.won++; stats.streak++; } else stats.streak = 0;
    recorded = true;
    try { localStorage.setItem('hangman-stats', JSON.stringify(stats)); } catch { /* Storage is optional. */ }
  }
  document.querySelector('#category').textContent = game.category;
  document.querySelector('#prompt').textContent = state === 'won' ? 'Beautifully guessed!' : state === 'lost' ? 'The word got away.' : 'Find the hidden word';
  document.querySelector('#word-subtitle').textContent = state === 'won' ? 'A little wordplay, a well-earned victory.' : state === 'lost' ? 'A fresh word is a fresh start. Try again!' : 'A little curiosity goes a long way.';
  document.querySelector('#word').innerHTML = [...game.word].map(letter => `<span class="letter ${game.guesses.includes(letter) ? 'revealed' : ''} ${state === 'lost' && !game.guesses.includes(letter) ? 'missed' : ''}">${game.guesses.includes(letter) || state === 'lost' ? letter : ''}</span>`).join('');
  document.querySelector('#guess-info').textContent = state === 'playing' ? `${game.word.length} letters · ${wrong.length === 0 ? 'You’ve got this' : `${wrong.length} incorrect ${wrong.length === 1 ? 'guess' : 'guesses'}`}` : state === 'won' ? 'You saved the day. Ready for another?' : `The answer was ${game.word.toLowerCase()}.`;
  document.querySelector('#chances').innerHTML = `<div class="chance-dots">${Array.from({length:game.limit}, (_,i) => `<span class="${i < wrong.length ? 'used' : ''}"></span>`).join('')}</div><strong>${game.limit-wrong.length}</strong> chances left`;
  document.querySelector('#drawing-caption').textContent = state === 'won' ? 'A happy ending, one letter at a time.' : state === 'lost' ? 'There’s always another word.' : 'Every letter is a new possibility.';
  const parts = Math.ceil(wrong.length / game.limit * 6);
  document.querySelectorAll('[data-part]').forEach(el => el.classList.toggle('visible', Number(el.dataset.part) <= parts));
  document.querySelector('.face').classList.toggle('visible', parts >= 1);
  document.querySelector('.game-card').classList.toggle('is-won',state === 'won');
  document.querySelector('#keyboard').innerHTML = ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'].map(row => `<div class="key-row">${[...row].map(letter => { const used = game.guesses.includes(letter); return `<button class="key ${used ? game.word.includes(letter) ? 'correct' : 'incorrect' : ''}" data-letter="${letter}" aria-label="Guess ${letter}" ${used || state !== 'playing' ? 'disabled' : ''}>${letter}</button>`; }).join('')}</div>`).join('');
  document.querySelector('#clue').textContent = game.clue;
  document.querySelector('#clue').hidden = !hintOpen;
  document.querySelector('#hint').setAttribute('aria-expanded', String(hintOpen));
  document.querySelector('.hint-plus').textContent = hintOpen ? '−' : '+';
  for (const key of ['played','won','streak']) document.querySelector(`#${key}`).textContent = stats[key];
}
function newGame() { game = createGame(document.querySelector('#difficulty').value,game.word); hintOpen = false; recorded = false; render(); }
document.querySelector('#keyboard').addEventListener('click', event => { const key = event.target.closest('[data-letter]'); if (key && guess(game,key.dataset.letter)) render(); });
document.addEventListener('keydown', event => { if (event.ctrlKey || event.metaKey || event.altKey || document.querySelector('#help-dialog').open || ['SELECT','INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return; if (/^[a-z]$/i.test(event.key) && guess(game,event.key)) render(); });
document.querySelector('#new-game').addEventListener('click',newGame);
document.querySelector('#difficulty').addEventListener('change',newGame);
document.querySelector('#hint').addEventListener('click', () => { hintOpen = !hintOpen; render(); });
const dialog = document.querySelector('#help-dialog');
document.querySelector('#help').addEventListener('click', () => dialog.showModal());
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#got-it').addEventListener('click', () => dialog.close());
dialog.addEventListener('click',event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
render();
