'use strict';

const fs = require('fs');

const dataPath = 'data/2020_day_22_input.txt';

function extractGame() {
  const lines = fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '');
  let deck1 = [];
  let deck2 = [];
  let currentDeck = deck1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].startsWith('Player')) currentDeck = deck2;
    else currentDeck.push(Number(lines[i]))
  }
  return {
    deck1: deck1,
    deck2: deck2
  }
}

function nextRound(game) {
  const card1 = game.deck1.shift(0);
  const card2 = game.deck2.shift(0);
  if (card1 > card2) {
    game.deck1.push(card1);
    game.deck1.push(card2);
  } else {
    game.deck2.push(card2);
    game.deck2.push(card1);
  }
}

function isCompleted(game) {
  return game.deck1.length === 0 || game.deck2.length === 0;
}

function score(deck) {
  const rdeck = deck.slice().reverse();
  const scores = rdeck.map((v, ind) => v * (ind + 1));
  return scores.reduce((a, b) => a + b);
}

function winnerScore(game) {
  return game.deck1.length > 0 ? score(game.deck1) : score(game.deck2);
}

module.exports = {
  solve1: () => {
    const game = extractGame();
    while (!isCompleted(game)) {
      nextRound(game);
    }
    console.log(`The winner score is ${winnerScore(game)}`);
  },

  solve2: () => {
  }
}