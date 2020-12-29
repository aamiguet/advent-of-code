'use strict';

const fs = require('fs');

const dataPath = 'data/2020_day_24_input.txt';

function key(pos) {
  return pos.x + ':' + pos.y;
}

function moveReduce(position, move) {
  return {
    x: position.x + move.x,
    y: position.y + move.y
  };
}

class Move {
  constructor(id) {
    let x, y;
    switch(id) {
      case 'e':
        x = 1;
        break;
      case 'w':
        x = -1;
        break;
      case 'ne':
        x = 0.5;
        y = 1;
        break;
      case 'se':
        x = 0.5;
        y = -1;
        break;
      case 'nw':
        x = -0.5;
        y = 1;
        break;
      case 'sw':
        x = -0.5;
        y = -1;
        break;
    }
    this.x = x ? x : 0;
    this.y = y ? y : 0;
  }
}

class Tile {
  constructor(pos) {
    this.x = pos.x;
    this.y = pos.y;
    this.black = false;
    this.neighbors = undefined;
  }

  flip() {
    this.black = !this.black;
  }

  setNeighbors(tileMap) {
    if (typeof this.neighbors === 'undefined') {
      this.neighbors = [];
      const adjacentMoves = ['e', 'w', 'se', 'sw', 'ne', 'nw'].map(id => new Move(id));
      const pos = {x: this.x, y: this.y};
      const adjacentPos = adjacentMoves.map(m => moveReduce(pos, m));
      adjacentPos.forEach(p => {
        const k = key(p);
        if (!tileMap.has(k)) tileMap.set(k, new Tile(p));
        this.neighbors.push(tileMap.get(k));
      });
    }
  }

  willFlip(tileMap) {
    this.setNeighbors(tileMap);
    const blackNeighbors = this.neighbors.filter(t => t.black).length;
    if (this.black) {
      return blackNeighbors === 0 || blackNeighbors > 2;
    } else {
      return blackNeighbors === 2;
    }
  }
}

function position(moves) {
  return moves.reduce(moveReduce, {x: 0, y: 0});
}

function moves(line) {
  return line.match(/(se|sw|ne|nw|e|w)/g).map(id => new Move(id))
}

function extractTiles() {
  const lines = fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '');
  let tileMap = new Map();
  lines.forEach(l => {
    const pos = position(moves(l));
    const k = key(pos);
    if (!tileMap.has(k)) tileMap.set(k, new Tile(pos));
    tileMap.get(k).flip();
  });
  return tileMap;
}

module.exports = {
  solve1: () => {
    const tm = extractTiles();
    const blackTiles = [...tm.values()].filter(t => t.black);
    console.log(`The number of black tiles is ${blackTiles.length}`);
  },

  solve2: () => {
    const tm = extractTiles();
    let day = 1;
    while (day <= 100) {
      // expending the known tiles
      const tiles = [...tm.values()];
      tiles.forEach(t => t.setNeighbors(tm));
      // the flipping part
      const expendedTiles = [...tm.values()];
      expendedTiles.filter(t => t.willFlip(tm)).forEach(t => t.flip());
      if (day === 100) {
        const blackTiles = [...tm.values()].filter(t => t.black);
        console.log(`Day ${day}: ${blackTiles.length}`);
      }
      day++;
    }
  }
}