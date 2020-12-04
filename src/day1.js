'use strict';

const fs = require('fs');

function extractData() {
  return fs
    .readFileSync('data/2020_day_1_input.txt')
    .toString()
    .split(/\n/)
    .map(n => Number(n))
    .filter(n => n > 0)
    .sort((a, b) =>  a - b);
}

module.exports = {

  solve1: () => {
    const data = extractData();
    const left = data.filter(n => n < 1010);
    const right = data.filter(n => n >= 1010).reverse();
    left.forEach(small => {
      let i = 0;
      let sum = 0;
      let big;
      do {
        big = right[i];
        sum = small + big;
        i++;
      } while (sum > 2020)
      if (sum === 2020) {
        console.log(`${small} + ${big} = ${sum}; product is ${small * big}`);
      }
    });
  },

  solve2: () => {
    const data = extractData();
    let small, middle, big, sum;
    for (let i = 0; i < data.length; i++) {
      small = data[i];
      for (let j = i + 1; j < data.length; j++) {
        middle = data[j];
        for (let k = j + 1; k < data.length; k++) {
          big = data[k];
          if (small + middle + big >= 2020) break;
        }
        if (small + middle + big >= 2020) break;
      }
      sum = small + middle + big;
      if (sum === 2020) break;
    }
    console.log(`${small} + ${middle} + ${big} = ${sum}; product is ${small * middle * big}`);
  }

}