'use strict';

const fs = require('fs');

const dataPath = 'data/2020_day_19_input.txt';

function buildReFromSubRules(rules, subrules) {
  const split = subrules.split(' ').map(r => Number(r));
  return split.map(i => buildRe(rules, i)).join('');
}

function buildRe(rules, index) {
  const r = rules.get(index);
  if (r === '"a"') return 'a';
  else if (r === '"b"') return 'b';
  else if (index === 8) return '(' + buildRe(rules, 42) + ')+';
  else if (index === 11) {
    // can we do the following with regular expression ?
    // pattern1 repeated n times followed by pattern2 also repeated n times
    // hard wiring 10 repetitions
    const re42 = buildRe(rules, 42);
    const re31 = buildRe(rules, 31);
    let a = [re42 + re31];
    for (var i = 1; i < 10; i++) {
      a.push(re42 + a[i-1] + re31);
    }
    return '(' + a.join('|') + ')';
  } else {
    const splitOr = r.split(' | ');
    return '(' + splitOr.map(s => buildReFromSubRules(rules, s)).join('|') + ')'
  }
}

function extractLines() {
  return fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '');
}

function extractData() {
  const lines = extractLines();
  let rules = new Map();
  lines.filter(l => /^\d/.test(l)).forEach(l => {
    const split = l.split(': ');
    rules.set(Number(split[0]), split[1]);
  });
  const messages = lines.filter(l => /^[ab]/.test(l));
  return {
    rules: rules,
    messages: messages
  }
}

module.exports = {
  solve1: () => {
    const data = extractData();
    const re0 = new RegExp('^' + buildRe(data.rules, 0) + '$');
    const validMesssages = data.messages.filter(m => re0.test(m)).length;
    console.log(`The number of matching messages is ${validMesssages}`);
  },

  solve2: () => {
  }
}