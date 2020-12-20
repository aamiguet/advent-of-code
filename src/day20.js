'use strict';

const fs = require('fs');

const dataPath = 'data/2020_day_20_input.txt';

/** https://adventofcode.com/2020/day/20
 * Part I, depending on the position of the tile we have the following
 * - Inner tiles borders have at least 4 matching borders
 * - Border tiles borders have 3 matching borders
 * - Angle tiles borders have 2 matching borders
*/

function borderId(border, clockwise) {
  const b = (clockwise ? border : border.slice().reverse()).join('');
  const bin = b.replace(/\#/gi, '1').replace(/\./gi, '0');
  return parseInt(bin, 2);
}

function computeBorderIds(dots) {
  const sideLength = dots[0].length;
  const range = [...Array(sideLength).keys()];
  const topBorder = dots[0].split('');
  const rightBorder = range.map(r => dots[r][sideLength - 1]);
  const bottomBorder = dots[sideLength - 1].slice().split('').reverse();
  const leftBorder = range.map((r => dots[r][0])).reverse();

  const allBorders = [
    topBorder,
    rightBorder,
    bottomBorder,
    leftBorder,
  ];
  return {
    clockwise: allBorders.map(b => borderId(b, true)),
    anticlockwise: allBorders.map(b => borderId(b, false))
  };
}

function intersection(arr1, arr2) {
  return arr1.filter(value => arr2.includes(value));
}

function intersect(arr1, arr2) {
  return intersection(arr1, arr2).length > 0;
}

function matching(tiles, borderIds) {
  return tiles.filter(t => {
    return intersect(borderIds, t.borderIds.clockwise) || intersect(borderIds, t.borderIds.anticlockwise);
  });
}

class Tile {
  constructor(id, dots) {
    this.id = id;
    this.dots = dots;
    this.borderIds = computeBorderIds(dots);
  }

  matchingTiles(tiles) {
    const otherTiles = tiles.filter(t => t !== this);
    return {
      clockwise: matching(otherTiles, this.borderIds.clockwise),
      anticlockwise: matching(otherTiles, this.borderIds.anticlockwise)
    }
  }

  bestMatch(tiles) {
    const mTiles = this.matchingTiles(tiles);
    return Math.max(mTiles.clockwise.length, mTiles.anticlockwise.length);
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
    const bms = tiles.map(t => {
      return {
        id: t.id,
        affinity: t.bestMatch(tiles)
      };
    });
    const angles = bms.filter(bm => bm.affinity === 2);
    const product = angles.reduce((a, b) => a * b.id, 1);
    console.log(`The product of the angle tile ids is ${product}`);
  },

  solve2: () => {
  }
}