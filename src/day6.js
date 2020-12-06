'use strict';

const fs = require('fs');
const dataPath = 'data/2020_day_6_input.txt';

function count1(group) {
  const allResponses = group.match(/[a-z]/gi);
  return new Set(allResponses).size;
}

function count2(group) {
  const people = group.split(/\n/).filter(l => l.trim().length > 0);
  let commonResp = people[0].match(/[a-z]/gi);
  people.splice(1).forEach(person => {
    const resp = person.match(/[a-z]/gi);
    commonResp = commonResp.filter(c => resp.includes(c));
  });
  return commonResp.length;
}

function extractData() {
  return fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n\n/)
    .filter(l => l.trim().length > 0);
}

function solve(count) {
  const groups = extractData();
  const counts = groups.map(count);
  const total = counts.reduce((a, b) => a + b);
  console.log(`Total is ${total}`);
}

module.exports = {
  solve1: () => {
    solve(count1);
  },

  solve2: () => {
    solve(count2);
  }
}
