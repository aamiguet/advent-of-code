'use strict';

const fs = require('fs');
const dataPath = 'data/2020_day_11_input.txt';

// state is one of
// . = floor
// L = empty seat
// # = occupied seat
const Floor = '.';
const EmptySeat = 'L';
const OccupiedSeat = '#';

class Tile {
  constructor(state) {
    this.state = state;
  }

  isOccupied() {
    return this.state === OccupiedSeat;
  }

  isFloor() {
    return this.state === Floor;
  }

  hasSeat() {
    return this.state === EmptySeat || this.state === OccupiedSeat;
  }

  nextState(neighbors, tolerance) {
    if (this.state === Floor) {
      return Floor;
    } else if (this.state === EmptySeat) {
      return neighbors.filter(n => n.isOccupied()).length === 0 ? OccupiedSeat : EmptySeat;
    } else if (this.state === OccupiedSeat) {
      return neighbors.filter(n => n.isOccupied()).length >= tolerance ? EmptySeat : OccupiedSeat;
    }
  }
}

function extractTiles() {
  const lines = fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '');
  return lines.map(l => l.split('').map(c => new Tile(c)));
}

function nextTiles1(tiles) {
  const next = tiles.map((row, rowIndex) => {
    const nextRow = row.map((tile, tileIndex) => {
      let neighbors = [];
      for (var i = rowIndex - 1; i <= rowIndex + 1; i++) {
        for (var j = tileIndex - 1; j <= tileIndex + 1; j++) {
          if ((i !== rowIndex || j !== tileIndex) && typeof tiles[i] !== 'undefined' && typeof tiles[i][j] !== 'undefined') {
            neighbors.push(tiles[i][j]);
          }
        }
      }
      return new Tile(tile.nextState(neighbors, 4));
    });
    return nextRow;
  });
  return next;
}

function nextTiles2(tiles) {
  const directions = [
    {x: -1, y: -1},
    {x: -1, y: 0},
    {x: -1, y: 1},
    {x: 0, y: -1},
    {x: 0, y: 1},
    {x: 1, y: -1},
    {x: 1, y: 0},
    {x: 1, y: 1}
  ];
  const next = tiles.map((row, rowIndex) => {
    const nextRow = row.map((tile, tileIndex) => {
      let neighbors = [];
      directions.forEach((dir) => {
        let i = rowIndex, j = tileIndex;
        do {
          i += dir.y;
          j += dir.x;
        } while (typeof tiles[i] !== 'undefined' && typeof tiles[i][j] !== 'undefined' && !tiles[i][j].hasSeat());
        if (typeof tiles[i] !== 'undefined' && typeof tiles[i][j] !== 'undefined') {
          neighbors.push(tiles[i][j]);
        }
      });
      return new Tile(tile.nextState(neighbors, 5));
    });
    return nextRow;
  });
  return next;
}

function equalBool(a, b) {
  return a && b;
}

function sum(a, b) {
  return a + b;
}

function isEqual(tiles1, tiles2) {
  return tiles1.map((row, indexRow) => {
    const equalRow = row.map((tile, indexTile) => {
      return tile.state === tiles2[indexRow][indexTile].state;
    }).reduce(equalBool, true);
    return equalRow;
  }).reduce(equalBool, true);
}

function solve(nextTiles) {
  let currentTiles = extractTiles();
  let pastTiles;
  do {
    pastTiles = currentTiles;
    currentTiles = nextTiles(pastTiles);
  } while (!isEqual(pastTiles, currentTiles));
  const total = currentTiles.map(row => {
    return row.filter(tile => tile.isOccupied()).length;
  }).reduce(sum)
  console.log(`Total number of seat occupied is ${total}`);
}

module.exports = {
  solve1: () => {
    solve(nextTiles1);
  },

  solve2: () => {
    solve(nextTiles2);
  }
}