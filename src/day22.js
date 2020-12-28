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

function updateGame(game, card1, card2, winner) {
  if (winner === 'p1') {
    game.deck1.push(card1);
    game.deck1.push(card2);
  } else {
    game.deck2.push(card2);
    game.deck2.push(card1);
  }
}

function serializeGame(game) {
  return 'deck1-' + game.deck1.join('-') + '-deck2-' + game.deck2.join('-');
}

function recursiveCombat(game, history) {
  const s = serializeGame(game);
  if (history.includes(s)) {
    return 'p1';
  } else {
    history.push(s);
  }
  const card1 = game.deck1.shift(0);
  const card2 = game.deck2.shift(0);
  let winner;
  if (card1 <= game.deck1.length && card2 <= game.deck2.length) {
    const subGame = {
      deck1: game.deck1.slice(0, card1),
      deck2: game.deck2.slice(0, card2)
    }
    let h = [];
    winner = recursiveCombat(subGame, h);
  } else {
    winner = card1 > card2 ? 'p1' : 'p2';
  }
  updateGame(game, card1, card2, winner);
  if (game.deck1.length === 0) return 'p2';
  if (game.deck2.length === 0) return 'p1';
  return recursiveCombat(game, history);
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
    const game = extractGame();
    let h = [];
    const winner = recursiveCombat(game, h);
    console.log(`The winner is ${winner} with the score ${winnerScore(game)}`);
  }
}