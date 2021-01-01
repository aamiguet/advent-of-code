'use strict';

const fs = require('fs');

const Top = 'TOP';
const Right = 'RIGHT';
const Bottom = 'BOTTOM';
const Left = 'LEFT';

const dataPath = 'data/2020_day_20_input.txt';

const SeaMonster = [
  '                  # ',
  '#    ##    ##    ###',
  ' #  #  #  #  #  #   '
];
const SeaMonsterLength = SeaMonster[0].length;
const SeaMonsterCount = sharpCount(SeaMonster);

String.prototype.reverse = function() {
  return this.valueOf().split('').reverse().join('');
}

function sharpCount(lines) {
  return lines.join('').split('').filter(c => c === '#').length;
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

function sideIndex(side) {
  switch(side) {
    case Top:
      return 0;
    case Right:
      return 1;
    case Bottom:
      return 2;
    case Left:
      return 3;
  }
}

function computeBorders(lines) {
  const sideLength = lines[0].length;
  const range = [...Array(sideLength).keys()];
  const topBorder = lines[0];
  const rightBorder = range.map(r => lines[r][sideLength - 1]).join('');
  const bottomBorder = lines[sideLength - 1].reverse();
  const leftBorder = range.map((r => lines[r][0])).join('').reverse();
  return [
    topBorder,
    rightBorder,
    bottomBorder,
    leftBorder,
  ];
}

function flip(lines) {
  return lines.map(l => l.reverse());
}

function stripBorders(lines) {
  return lines.slice(1, lines.length - 1).map(l => l.slice(1, l.length - 1));
}

function rotateRight(lines) {
  const dots = lines.map(l => l.split(''));
  let rotatedDots = [];
  for (let i = 0; i < dots[0].length; i++) {
    rotatedDots[i]
    let col = [];
    for (let j = 0; j < dots.length; j++) {
      col.push(dots[j][i]);
    }
    rotatedDots[i] = col.reverse().join('');
  }
  return rotatedDots;
}

/** https://adventofcode.com/2020/day/20
 * Part I, depending on the position of the tile we have the following
 * - Inner tiles borders have at least 4 matching borders
 * - Border tiles borders have 3 matching borders
 * - Angle tiles borders have 2 matching borders
*/
class Tile {
  constructor(id, lines) {
    this.id = id;
    this.lines = lines;
    this.borders = new Map();
    this.neighbors = new Map();
    this.startingBorders = computeBorders(lines);
    this.flippedBorders = computeBorders(flip(lines));
  }

  alignLines() {
    let ls = this.flipped ? flip(this.lines) : this.lines;
    const steps = (this.rotation + 4) % 4;
    for (let i = 0; i < steps; i++) {
      ls = rotateRight(ls);
    }
    return ls;
  }

  imageLines() {
    const ls = this.alignLines();
    return stripBorders(ls);
  }

  matchingBorders(side, border) {
    if (this.borders.has(side)) {
      return this.borders.get(side).reverse() === border;
    } else {
      const all = this.startingBorders.concat(this.flippedBorders);
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

    if (this.startingBorders.includes(border)) {
      this.flipped = false;
      const index = this.startingBorders.indexOf(border);
      this.rotation = sideIndex(side) - index;
      setBorder0(side, this.startingBorders, index);
    } else {
      this.flipped = true;
      const index = this.flippedBorders.indexOf(border);
      this.rotation = sideIndex(side) - index;
      setBorder0(side, this.flippedBorders, index);
    }
  }

  setNeighbor(tile, side, border) {
    this.neighbors.set(side, tile);
    this.setBorders(side, border.reverse());
  }

  setNeighbors(tiles) {
    // arbitrary orienting the first tile
    if (!this.borders.has(Top)) this.setBorders(Top, this.startingBorders[0]);
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
    const ls = lines.slice(index + 1, index + increment);
    tiles.push(new Tile(id, ls));
    index += increment;
  }
  return tiles;
}

function buildImage(tiles) {
  let leftTile = tiles.filter(t => t.neighbors.size === 2 && t.neighbors.has(Right) && t.neighbors.has(Bottom))[0];
  let i = 0;
  let arr = [];
  while (true) {
    arr[i] = [leftTile];
    let tile = leftTile;
    let j = 1;
    while (true) {
      tile = tile.neighbors.get(Right);
      arr[i][j] = tile;
      j++;
      if (!tile.neighbors.has(Right)) break;
    }
    if (!tile.neighbors.has(Bottom)) break;
    leftTile = leftTile.neighbors.get(Bottom);
    i++;
  }
  const initialValue = [...Array(arr[0][0].lines.length - 2).keys()].map(n => '');
  const arrLines = arr.map(a => {
    return a.reduce((prev, curr) => {
      const ls = curr.imageLines();
      return prev.map((s, index) => {
        return s + ls[index];
      });
    }, initialValue)
  });
  return arrLines.flat();
}

function countMonster(imageSegment) {
  const SeaMonsterPattern = SeaMonster.map(l => { const rep = l.replace(/\s/g, '.'); return new RegExp(rep, 'g'); });
  const potentialSeaMonster = SeaMonsterPattern[1].exec(imageSegment[1]);
  if (potentialSeaMonster) {
    const endIndex = potentialSeaMonster.index + SeaMonsterLength;
    const top = imageSegment[0].substring(potentialSeaMonster.index, endIndex);
    const bottom = imageSegment[2].substring(potentialSeaMonster.index, endIndex);
    if (top.match(SeaMonsterPattern[0]) && bottom.match(SeaMonsterPattern[2])) {
      return 1 + countMonster(imageSegment.map(is => is.slice(endIndex)));
    } else {
      return countMonster(imageSegment.map(is => is.slice(potentialSeaMonster.index + 2)));
    }
  } else {
    return 0;
  }
}

function printImage(image) {
  image.forEach(l => console.log(l));
}

function processImage(image, iter) {
  let count = 0;
  for (let i = 0; i < image.length - 2; i++) {
    count += countMonster(image.slice(i, i+3));
  }
  if (count > 0) {
    return count;
  } else {
    if (iter === 3) {
      return processImage(flip(image), 0);
    } else {
      return processImage(rotateRight(image), iter + 1);
    }
  }
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
    const image = buildImage(tiles);
    const seaMonsters = processImage(image, 0);
    const count = sharpCount(image) - seaMonsters * SeaMonsterCount;
    console.log(`The number of sea monsters is ${seaMonsters}`)
    console.log(`The number of # not part of a sea monster is ${count}`);
  }
}