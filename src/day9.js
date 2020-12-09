'use strict';

const fs = require('fs');
const dataPath = 'data/2020_day_9_input.txt';

function extractNumbers() {
  return fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '')
    .map(l => Number(l));
}

function summable(value, arr) {
  const sorted = arr.sort((a, b) => a - b);
  if (value < sorted[0] + sorted[1] || value > sorted[sorted.length] + sorted[sorted.length - 1]) {
    return false;
  }
  return true;
}

function firstNonSummable(nums) {
  const preambleSize = 25;
  let fns;
  nums.forEach((v, index, arr) => {
    if (index >= preambleSize) {
      if (!summable(v, arr.slice(index - preambleSize, index - 1))) {
        fns = {value: v, index: index};
      }
    }
  });
  return fns;
}

module.exports = {
  solve1: () => {
    const nums = extractNumbers();
    console.log(`The first non summable value is ${firstNonSummable(nums).value}`);
  },

  solve2: () => {
    const nums = extractNumbers();
    const fns = firstNonSummable(nums);
    let sum = 0;
    let arr;
    let sortedArr;
    let left = 0, right = 0;
    do {
      sum < fns.value ? right++ : left++;
      arr = nums.slice(left, right);
      sum = arr.reduce((a, b) => a + b);
    } while (sum !== fns.value);
    sortedArr = arr.sort((a, b) => a - b);
    console.log(`The sum of the smalles and largest number is ${sortedArr[0] + sortedArr[sortedArr.length - 1]}`);
  }
}