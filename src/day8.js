'use strict';

const fs = require('fs');
const dataPath = 'data/2020_day_8_input.txt';

class Instruction {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

function instructionFromLine(line) {
  const s = line.split(' ');
  return new Instruction(s[0], Number(s[1]));
}

function extractData() {
  return fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '');
}

function instructions(data) {
  return extractData().map(instructionFromLine)
}

function swapOne(instrs, pos) {
  const swapsInscr = ['nop', 'jmp'];
  let c = 0;
  let out = [];
  let swappable;
  for (var i = 0; i < instrs.length; i++) {
    swappable = swapsInscr.includes(instrs[i].name);
    if (swappable && c === pos) {
      if (instrs[i].name === 'nop') {
        out.push(new Instruction('jmp', instrs[i].value))
      } else {
        out.push(new Instruction('nop', instrs[i].value))
      }
    } else {
      out.push(instrs[i]);
    }
    if (swappable) c++;
  }
  return out;
}

function verify(instrs) {
  const terminalPosition = instrs.length;
  let nextStep = 0;
  let acc = 0;
  let steps = [nextStep];
  do {
    steps.push(nextStep);
    const instr = instrs[nextStep];
    switch (instr.name) {
      case 'nop':
        nextStep++;
        break;
      case 'acc':
        acc += instr.value;
        nextStep++;
        break;
      case 'jmp':
        nextStep += instr.value;
        break;
      default:
        break;
    }
  } while (!steps.includes(nextStep) && nextStep < terminalPosition);
  return {
    terminate: nextStep === terminalPosition,
    acc: acc
  };
}

module.exports = {
  solve1: () => {
    const instrs = instructions();
    const v = verify(instrs);
    console.log(`Accumulator value before looping is ${v.acc}`);
  },

  solve2: () => {
    const instrs = instructions();
    let is;
    let v;
    let nextPos = 0;
    // brute forcing, can we do better? For example, by backtracking from last instruction?
    do {
      is = swapOne(instrs, nextPos);
      v = verify(is);
      nextPos++;
    } while (!v.terminate);
    console.log(`Accumulator value after terminating is ${v.acc}`);
  }
}