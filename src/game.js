export const words = [
  { word: 'ORCHID', category: 'Nature', clue: 'An elegant flower that often grows on trees.', difficulty: 'easy' },
  { word: 'PLANET', category: 'Space', clue: 'A world that travels around a star.', difficulty: 'easy' },
  { word: 'PICNIC', category: 'Everyday joys', clue: 'A meal best enjoyed on a blanket outdoors.', difficulty: 'easy' },
  { word: 'MARBLE', category: 'Objects', clue: 'A tiny glass sphere, or a stone fit for a sculpture.', difficulty: 'easy' },
  { word: 'LANTERN', category: 'Objects', clue: 'A little light to carry into the dark.', difficulty: 'medium' },
  { word: 'WILDFLOWER', category: 'Nature', clue: 'A bloom that grows without a gardener’s help.', difficulty: 'medium' },
  { word: 'HORIZON', category: 'The outdoors', clue: 'Where the earth seems to meet the sky.', difficulty: 'medium' },
  { word: 'SOURDOUGH', category: 'Food & drink', clue: 'A slow-fermented loaf with a pleasantly tangy taste.', difficulty: 'medium' },
  { word: 'KALEIDOSCOPE', category: 'Objects', clue: 'A turn of this tube reveals a new colorful pattern.', difficulty: 'hard' },
  { word: 'QUIZZICAL', category: 'Expressions', clue: 'The look you give when something is rather puzzling.', difficulty: 'hard' },
  { word: 'JUXTAPOSE', category: 'Language', clue: 'To place two things side by side for comparison.', difficulty: 'hard' },
  { word: 'ZEPHYR', category: 'Nature', clue: 'A soft, gentle breeze with a poetic name.', difficulty: 'hard' },
];
export const limits = { easy: 8, medium: 6, hard: 5 };
export function createGame(difficulty = 'medium', previousWord = '') {
  const options = words.filter(item => item.difficulty === difficulty && item.word !== previousWord);
  return { ...options[Math.floor(Math.random() * options.length)], guesses: [], limit: limits[difficulty] };
}
export function status(game) {
  if ([...game.word].every(letter => game.guesses.includes(letter))) return 'won';
  if (mistakes(game).length >= game.limit) return 'lost';
  return 'playing';
}
export function mistakes(game) { return game.guesses.filter(letter => !game.word.includes(letter)); }
export function guess(game, letter) {
  letter = letter.toUpperCase();
  if (!/^[A-Z]$/.test(letter) || game.guesses.includes(letter) || status(game) !== 'playing') return false;
  game.guesses.push(letter);
  return true;
}
