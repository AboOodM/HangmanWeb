import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, guess, mistakes, status, limits } from './game.js';

test('each difficulty supplies a new word and the correct chance limit', () => {
  for (const difficulty of Object.keys(limits)) {
    const game = createGame(difficulty);
    assert.equal(game.difficulty, difficulty);
    assert.equal(game.limit, limits[difficulty]);
    assert.notEqual(createGame(difficulty, game.word).word, game.word);
  }
});
test('correct guesses reveal repeated letters; duplicates and invalid input cost no chances', () => {
  const game = { word: 'LETTER', guesses: [], limit: 6 };
  assert.equal(guess(game, 't'), true);
  assert.equal(guess(game, 'T'), false);
  assert.equal(guess(game, 'Enter'), false);
  assert.deepEqual(mistakes(game), []);
  for (const letter of 'LER') guess(game, letter);
  assert.equal(status(game), 'won');
  assert.equal(guess(game, 'Z'), false);
});
test('wrong guesses exhaust chances and finish the round', () => {
  const game = { word: 'CAT', guesses: [], limit: 5 };
  for (const letter of 'BDEFG') guess(game, letter);
  assert.equal(mistakes(game).length, 5);
  assert.equal(status(game), 'lost');
  assert.equal(guess(game, 'C'), false);
});
