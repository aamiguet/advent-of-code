'use strict';

const fs = require('fs');
const dataPath = 'data/2020_day_5_input.txt';

function replaceLetter(c) {
  switch(c) {
    case "F": return 0;
    case "B": return 1;
    case "L": return 0;
    case "R": return 1;
  }
}

function boardpassId(seating) {
  const bin = seating.replace(/\w/gi, replaceLetter);
  const row = parseInt(bin.substr(0, 7), 2);
  const column = parseInt(bin.substr(7, 3), 2);
  return row * 8 + column;
}

function extractData() {
  return fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim().length > 0);
}

module.exports = {
  solve1: () => {
    const seatings = extractData();
    const ids = seatings.map(boardpassId);
    const maxId = ids.sort((a, b) => b - a)[0];
    console.log(`Highest seat id is ${maxId}`);
  },

  solve2: () => {
    const seatings = extractData();
    const sortedIds = seatings.map(boardpassId).sort((a, b) => a - b);
    for (var i = 0; i < sortedIds.length; i++) {
      if (i < sortedIds.length - 1 && sortedIds[i] + 2 === sortedIds[i + 1]) {
        console.log(`My id must be ${sortedIds[i] + 1}`)
      }
    }
  }
}