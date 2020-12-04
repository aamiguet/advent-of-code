'use strict';

const fs = require('fs');
const dataPath = 'data/2020_day_3_input.txt';

function hasTree(line, x) {
  const arr = line.trim().split("");
  const pos = x % arr.length;
  return arr[pos] === '#';
}

function extractData() {
  return fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim().length > 0);
}

class Slope {
  constructor(right, down) {
    this.right = right;
    this.down = down;
  }
}

function treeMap(slopes) {
  const data = extractData();
  let tree = new Map();
  slopes.forEach((s) => {
    let x = 0, y = 0, t = 0;
    do {
      if (hasTree(data[y], x)) t++;
      y += s.down;
      x += s.right;
    } while (y < data.length)
    tree.set(s, t);
  });
  return tree;
}

module.exports = {
  solve1: () => {
    const slope = new Slope(3, 1);
    const tree = treeMap([slope]);
    console.log(`Number of trees is ${tree.get(slope)}`);
  },

  solve2: () => {
    const slopes = [new Slope(1, 1), new Slope(3, 1), new Slope(5, 1), new Slope(7, 1), new Slope(1, 2)];
    const tree = treeMap(slopes);
    let product = 1;
    tree.forEach((v, s) => {
      product *= v;
    });
    console.log(`Product is ${product}`);
  }
}