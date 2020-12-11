'use strict';

const fs = require('fs');
const dataPath = 'data/2020_day_10_input.txt';

function sortedAdapters() {
  return fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '')
    .map(l => Number(l))
    .sort((a, b) => a - b);
}

module.exports = {
  solve1: () => {
    const adapters = sortedAdapters();
    let diffs = [0, 0, 0, 0];
    let lastVal = 0;
    adapters.forEach((val) => {
      let diff = val - lastVal;
      diffs[diff] += 1;
      lastVal = val;
    });
    diffs[3] += 1; // device
    console.log(`Number of 1-jolt multiplied by number of 3-jolt is ${diffs[1] * diffs[3]}`);
  },

  solve2: () => {
    const adapters = sortedAdapters();
    const endToEnd = [0].concat(adapters, [adapters[adapters.length-1] + 3]);
    let currentSeq = 0;
    let seqs = [];
    endToEnd.forEach((val, index, arr) => {
      if (index === 0 || index === arr.length - 1) {
        // port & device
      } else if (val === arr[index + 1] - 1 && val === arr[index - 1] + 1) {
        currentSeq++;
      } else {
        if (currentSeq > 0) seqs.push(currentSeq);
        currentSeq = 0;
      }
    });
    // after analysing the data, we find that the maximum length of a sequence of optional adapter is 3
    // thus it's easy to find for each length the number of possibilities
    const perm = new Map();
    perm.set(1, 2);
    perm.set(2, 4);
    perm.set(3, 7);
    const possibilities = seqs.map(v => perm.get(v)).reduce((a, b) => a * b);
    console.log(`Total number of distinct ways is ${possibilities}`);
  }
}