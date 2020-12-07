'use strict';

const fs = require('fs');
const dataPath = 'data/2020_day_7_input.txt';

class Bag {
  constructor(color, content) {
    this.color = color;
    this.content = content;
  }
}

class Content {
  constructor(color, quantity) {
    this.color = color;
    this.quantity = quantity;
  }
}

function bagFromRule(rule) {
  const s = rule.split(" bags contain ");
  const ctRule = s[1].split(',').map(e => e.trim());
  const ct = ctRule
    .filter(c => !c.startsWith('no'))
    .map(c => {
      const elems = c.split(' ');
      return new Content(`${elems[1]} ${elems[2]}`, Number(c[0]));
    });
  return new Bag(s[0], ct);
}

function extractData() {
  return fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '');
}

function bags() {
  const rules = extractData();
  return rules.map(r => bagFromRule(r));
}

function recursiveBags(bags, color, done) {
  if (!done.includes(color)) {
    done.push(color);
    const colors = bags
      .filter(b => {
        return b.content.filter(c => c.color === color).length > 0
      })
      .map(b => b.color);
    let rest = colors.flatMap(c => recursiveBags(bags, c, done));
    return colors.concat(rest);
  } else {
    return [];
  }
}

function findBag(bags, color) {
  return bags.filter(b => b.color === color)[0];
}

function sumOfContent(bag, bs) {
  if (bag.content.length > 0) {
    const innerSums = bag.content.map(c => c.quantity * sumOfContent(findBag(bs, c.color), bs));
    return 1 + innerSums.reduce((a, b) => a + b);
  } else {
    return 1;
  }
}

module.exports = {
  solve1: () => {
    const bs = bags();
    // Set to remove duplicate: that's bad !?
    const allContainers = new Set(recursiveBags(bs, 'shiny gold', []));
    console.log(`Number of containers is ${allContainers.size}`);
  },

  solve2: () => {
    const bs = bags();
    const startingBag = findBag(bs, 'shiny gold');
    const count = sumOfContent(startingBag, bs);
    // -1 to remove startingBag from the count
    console.log(`Number of bag contained is ${count - 1}`);
  }
}