'use strict';

const fs = require('fs');

function validate1(policy, password) {
  const range = policy.match(/\d+/g);
  const min = Number(range[0]);
  const max = Number(range[1]);
  const key = policy.match(/[a-z]/)[0];
  const n = password.split("").filter(c => c === key).length;
  return (n >= min && n <= max)
}

function validate2(policy, password) {
  const range = policy.match(/\d+/g);
  const pos1 = Number(range[0]) - 1;
  const pos2 = Number(range[1]) - 1;
  const key = policy.match(/[a-z]/)[0];
  const arr = password.split("");
  const keyInPos1 = arr[pos1] ? arr[pos1] === key : false;
  const keyInPos2 = arr[pos2] ? arr[pos2] === key : false;
  return ((keyInPos1 && !keyInPos2) || (!keyInPos1 && keyInPos2))
}

function extractData() {
  return fs
    .readFileSync('data/2020_day_2_input.txt')
    .toString()
    .split(/\n/);
}

function split(line) {
  const s = line.split(":");
  return { policy: s[0], password: s[1].trim() };
}

function solve(validate) {
  const data = extractData();
  let valid = 0;
  data.forEach((l) => {
    const s = split(l);
    if (validate(s.policy, s.password)) valid++;
  });
  console.log(`Number of valid password ${valid}`);
}

module.exports = {
  solve1: () => {
    solve(validate1);
  },

  solve2: () => {
    solve(validate2);
  }
}