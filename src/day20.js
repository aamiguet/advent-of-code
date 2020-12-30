'use strict';

const fs = require('fs');

const Top = 'TOP';
const Right = 'RIGHT';
const Bottom = 'BOTTOM';
const Left = 'LEFT';

const dataPath = 'data/2020_day_20_input.txt';

String.prototype.reverse = function() {
  return this.valueOf().split('').reverse().join('');
}

function nextSide(side) {
  switch(side) {
    case Top:
      return Right;
    case Right:
      return Bottom;
    case Bottom:
      return Left;
    case Left:
      return Top;
  }
}

function neighborSide(side) {
  switch(side) {
    case Top:
      return Bottom;
    case Right:
      return Left;
    case Bottom:
      return Top;
    case Left:
      return Right;
  }
}

function computeBorders(dots) {
  const sideLength = dots[0].length;
  const range = [...Array(sideLength).keys()];
  const topBorder = dots[0];
  const rightBorder = range.map(r => dots[r][sideLength - 1]).join('');
  const bottomBorder = dots[sideLength - 1].reverse();
  const leftBorder = range.map((r => dots[r][0])).join('').reverse();
  return [
    topBorder,
    rightBorder,
    bottomBorder,
    leftBorder,
  ];
}

/** https://adventofcode.com/2020/day/20
 * Part I, depending on the position of the tile we have the following
 * - Inner tiles borders have at least 4 matching borders
 * - Border tiles borders have 3 matching borders
 * - Angle tiles borders have 2 matching borders
*/
class Tile {
  constructor(id, dots) {
    this.id = id;
    this.dots = dots;
    this.borders = new Map();
    this.neighbors = new Map();
    this.clockwiseBorders = computeBorders(dots);
    // flipping a tile means not only flipping the borders but also flipping their order
    this.anticlockwiseBorders = this.clockwiseBorders.slice().reverse().map(b => b.reverse());
  }

  matchingBorders(side, border) {
    if (this.borders.has(side)) {
      return this.borders.get(side).reverse() === border;
    } else {
      const all = this.clockwiseBorders.concat(this.anticlockwiseBorders);
      return all.includes(border);
    }
  }

  canBeNeighbor(side, border) {
    if (this.neighbors.has(side)) {
      return false;
    } else {
      return this.matchingBorders(side, border);
    }
  }

  setBorders(side, border) {
    const that = this;
    function setBorder0(side, borders, index) {
      if (!that.borders.has(side)) {
        that.borders.set(side, borders[index % 4]);
        setBorder0(nextSide(side), borders, index + 1);
      }
    }

    if (this.clockwiseBorders.includes(border)) {
      setBorder0(side, this.clockwiseBorders, this.clockwiseBorders.indexOf(border));
    } else {
      setBorder0(side, this.anticlockwiseBorders, this.anticlockwiseBorders.indexOf(border));
    }
  }

  setNeighbor(tile, side, border) {
    this.neighbors.set(side, tile);
    this.setBorders(side, border.reverse());
  }

  setNeighbors(tiles) {
    // arbitrary orienting the first tile
    if (!this.borders.has(Top)) this.setBorders(Top, this.clockwiseBorders[0]);
    const that = this;
    const otherTiles = tiles.filter(t => t !== this);
    const sides = [...this.borders.keys()];
    sides.forEach(s => {
      if (!that.neighbors.has(s)) {
        const nSide = neighborSide(s);
        const border = that.borders.get(s);
        const neighbor = otherTiles.filter(t => t.canBeNeighbor(nSide, border));
        if (neighbor.length === 1) {
          that.neighbors.set(s, neighbor[0]);
          neighbor[0].setNeighbor(that, nSide, border);
          neighbor[0].setNeighbors(tiles);
        }
      }
    });
  }
}

function extractLines() {
  return fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '');
}

function extractTiles() {
  const lines = extractLines();
  let tiles = [];
  const increment = 11;
  let index = 0;
  while (index < lines.length) {
    const id = Number(lines[index].match(/\d+/)[0]);
    const dots = lines.slice(index + 1, index + increment);
    tiles.push(new Tile(id, dots));
    index += increment;
  }
  return tiles;
}

module.exports = {
  solve1: () => {
    const tiles = extractTiles();
    tiles[0].setNeighbors(tiles);
    const angleIds = tiles.filter(t => t.neighbors.size === 2).map(t => t.id);
    const product = angleIds.reduce((a, b) => a * b, 1);
    console.log(`The product of the angle tile ids is ${product}`);
  },

  solve2: () => {
    const tiles = extractTiles();
    tiles[0].setNeighbors(tiles);
  }
}