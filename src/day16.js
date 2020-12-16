const fs = require('fs');
const { exit } = require('process');

const dataPath = 'data/2020_day_16_input.txt';

class Range {
  constructor(r) {
    const nums = r.match(/\d+/g);
    this.min = Number(nums[0]);
    this.max = Number(nums[1]);
  }

  isInRange(n) {
    return this.min <= n && this.max >= n;
  }
}

class Rule {
  constructor(line) {
    const split = line.split(': ');
    const splitRange = split[1].split(' or ');
    this.name = split[0];
    this.range = splitRange.map(r => new Range(r));
  }

  isInRange(n) {
    let b = false;
    for (var i = 0; i < this.range.length; i++) {
      if (this.range[i].isInRange(n)) {
        b = true;
        break;
      }
    }
    return b;
  }
}

function valueIsValid(val, rules) {
  let b = false;
  for (var i = 0; i < rules.length; i++) {
    if (rules[i].isInRange(val)) {
      b = true;
      break;
    }
  }
  return b;
}

class Ticket {
  constructor(line) {
    this.values = line.split(',').map(n => Number(n));
  }

  isValid(rules) {
    return this.values.every(v => { return valueIsValid(v, rules) });
  }

  invalidValues(rules) {
    return this.values.filter(v => { return !valueIsValid(v, rules); });
  }

  validPos(rule, excludedPos) {
    let pos = [];
    this.values.forEach((v, index) => {
      console.log(rule.isInRange(v));
      if (!excludedPos.includes(index) && rule.isInRange(v)) pos.push(index);
    });
    return pos;
  }
}

function extractData() {
  const lines = fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/);
  let rules = [];
  let myTicket;
  let nearbyTickets = [];
  let index = 0;
  let currentLine = lines[index];
  while (currentLine !== '') {
    rules.push(new Rule(currentLine));
    index++;
    currentLine = lines[index];
  }
  index += 2;
  myTicket = new Ticket(lines[index]);
  index += 3;
  currentLine = lines[index];
  while (currentLine !== '') {
    nearbyTickets.push(new Ticket(currentLine));
    index++;
    currentLine = lines[index];
  }
  return {
    rules: rules,
    myTicket: myTicket,
    nearbyTickets: nearbyTickets
  };
}

function extractDataWithoutInvalid() {
  const data = extractData();
  return {
    rules: data.rules,
    myTicket: data.myTicket,
    nearbyTickets: data.nearbyTickets.filter(t => { return t.isValid(data.rules); })
  }
}

function findPos(rule, values) {
  let pos = [];
  for (let i = 0; i < values.length; i++) {
    if (values[i].every(v => rule.isInRange(v))) {
      pos.push(i);
    }
  }
  return pos;
}

function onlySinglePos(ruleMap) {
  let b = true;
  ruleMap.forEach(v => b = b && v.length === 1);
  return b;
}

function findSingleAndUpdateMap(ruleMap, excludedPos) {
  let pos, excludedRule;
  ruleMap.forEach((v, k) => {
    if (v.length === 1 && !excludedPos.includes(v[0])) {
      pos = v[0];
      excludedRule = k;
    }
  });
  excludedPos.push(pos);
  ruleMap.forEach((v, k, m) => {
    if (k !== excludedRule) {
      m.set(k, v.filter(n => n !== pos));
    }
  });
}

module.exports = {
  solve1: () => {
    const data = extractData();
    const allInvalidValues = data.nearbyTickets.map(n => n.invalidValues(data.rules)).flat();
    const sum = allInvalidValues.reduce((a, b) => a + b);
    console.log(`The ticket scanning error rate is ${sum}`);
  },

  solve2: () => {
    const data = extractDataWithoutInvalid();
    let values = [];
    for (let i = 0; i < data.myTicket.values.length; i++) {
      const vs = data.nearbyTickets.map(t => t.values[i]);
      values.push(vs);
    }
    let ruleMap = new Map();
    data.rules.forEach((r) => {
      ruleMap.set(r, findPos(r, values));
    });
    let excludedPos = [];
    while (!onlySinglePos(ruleMap)) {
      findSingleAndUpdateMap(ruleMap, excludedPos);
    }
    let product = 1;
    ruleMap.forEach((v, k) => {
      if (k.name.startsWith('departure')) {
        product *= data.myTicket.values[v[0]];
      }
    })
    console.log(`The product of the six departure fields is ${product}`);
  }
}