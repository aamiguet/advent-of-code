'use strict';

const fs = require('fs');

const dataPath = 'data/2020_day_18_input.txt';

// given an expression x op y, computes the result
function computeOne(e) {
  const split = e.split(' ');
  const x = Number(split[0]);
  const y = Number(split[2]);
  const op = split[1];
  switch(op) {
    case '+':
      return x + y;
    case '*':
      return x * y;
    default:
      return undefined;
  }
}

function computeNoPrecedence(expression) {
  const e = expression.match(/\d+\s[\+\*]\s\d+/);
  if (e) {
    return computeNoPrecedence(computeOne(e[0]) + expression.substring(e[0].length));
  } else {
    return expression;
  }
}

function computeAdditivePrecedence(expression) {
  const eAdd = expression.match(/\d+\s[\+]\s\d+/);
  if (eAdd) {
    return computeAdditivePrecedence(expression.substring(0, eAdd.index) + computeOne(eAdd[0]) + expression.substring(eAdd.index + eAdd[0].length));
  } else {
    const eProd = expression.match(/\d+\s[\*]\s\d+/);
    if (eProd) {
      return computeAdditivePrecedence(expression.substring(0, eProd.index) + computeOne(eProd[0]) + expression.substring(eProd.index + eProd[0].length));
    } else {
      return expression;
    }
  }
}

function computeWithParentheses(expression, compute) {
  const startingPos = expression.indexOf('(');
  if (expression.indexOf('(') === -1) {
    return compute(expression);
  } else {
    let balance = 1;
    let endingPos;
    for (let i = startingPos + 1; i < expression.length; i++) {
      if (expression[i] === '(') balance++;
      else if (expression[i] === ')') balance--;
      if (balance === 0) {
        endingPos = i;
        break;
      }
    }
    const innerExpression = expression.substr(startingPos + 1, endingPos - startingPos - 1);
    return computeWithParentheses(
      expression.substring(0, startingPos) + computeWithParentheses(innerExpression, compute) + expression.substring(endingPos + 1),
      compute
    );
  }
}

function extractLines() {
  return fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '');
}

function solve(compute) {
  const lines = extractLines();
  const results = lines.map(l => Number(computeWithParentheses(l, compute)));
  const sum = results.reduce((a, b) => a + b);
  console.log(`The sum of all resulting values is ${sum}`);
}

module.exports = {
  solve1: () => {
    solve(computeNoPrecedence);
  },

  solve2: () => {
    solve(computeAdditivePrecedence);
  }
}