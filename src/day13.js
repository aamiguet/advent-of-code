'use strict';

const fs = require('fs');

const dataPath = 'data/2020_day_13_input.txt';

function extractData1() {
  const lines = fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '');
  return {
    time: Number(lines[0]),
    bus: lines[1].split(',').filter(v => v !== 'x').map(Number)
  }
}

class Bus {
  constructor(id, shift) {
    this.id = id;
    this.shift = shift;
  }
}

function extractData2() {
  const lines = fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '');
  let bus = [];
  lines[1].split(',').forEach((id, index) => {
    if (id !== 'x') {
      bus.push(new Bus(Number(id), index));
    }
  });
  return bus;
}

module.exports = {
  solve1: () => {
    const data = extractData1();
    const waitTimes = data.bus.map((v) => {
      const wait = v - (data.time % v);
      return {
        bus: v,
        wait: wait
      };
    }).sort((a, b) => a.wait - b.wait);
    console.log(`Product of waiting time and bus id is ${waitTimes[0].bus * waitTimes[0].wait}`);
  },

  solve2: () => {
    const bus = extractData2();
    let increment = 1;
    let time = 0;
    bus.forEach((b) => {
      while ((time + b.shift) % b.id !== 0) {
        time += increment;
      }
      increment *= b.id;
    });
    console.log(`Time of first departure is ${time}`);
  }
}