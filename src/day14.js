'use strict';

const fs = require('fs');

const dataPath = 'data/2020_day_14_input.txt';

function extractData() {
  const lines = fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '');
  return lines;
}

function applyMask1(n, mask) {
  const bin = n.toString(2).padStart(36, '0');
  const bits = bin.split('');
  const maskBits = mask.split('');
  let out = [];
  maskBits.forEach((m, index) => {
    if (m === 'X') out[index] = bits[index];
    else out[index] = m;
  });
  return parseInt(out.join(''), 2);
}

function applyMask2(address, mask) {
  const bin = address.toString(2).padStart(36, '0');
  const bits = bin.split('');
  const maskBits = mask.split('');
  let out = [];
  maskBits.forEach((m, index) => {
    if (m === '0') out[index] = bits[index];
    else out[index] = m;
  });
  return out.join('');
}

function newAcc(head, acc) {
  let a = [];
  acc.forEach((v) => {
    if (head === 'X') {
      a.push(v + '0');
      a.push(v + '1');
    } else {
      a.push(v + head);
    }
  });
  return a;
}

/**
 * Find all adresses recursively
 * @param {String} address
 * @param {Array} acc
 */
function all(address, acc) {
  const head = address.charAt(0);
  const tail = address.substr(1);
  const na = newAcc(head, acc);
  if (tail.length === 0) {
    return na;
  } else {
    return all(tail, na);
  }
}

/**
 * Set value for all keys corresponding to the floating address
 * @param {Map} mem
 * @param {String} floatingAddress
 * @param {Number} value
 */
function setAll(mem, floatingAddress, value) {
  const addresses = all(floatingAddress, ['']);
  addresses.forEach(v => {
    mem.set(v, value);
  });
}

module.exports = {
  solve1: () => {
    const data = extractData();
    let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    let mem = [];
    data.forEach(d => {
      if (d.startsWith('mask')) mask = d.split(' = ')[1];
      else {
        const m = d.match(/\d+/g);
        mem[Number(m[0])] = applyMask1(Number(m[1]), mask);
      }
    });
    const s = mem.reduce((a, b) => a + b);
    console.log(`The sum is ${s}`);
  },

  solve2: () => {
    const data = extractData();
    let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    let mem = new Map();
    data.forEach(d => {
      if (d.startsWith('mask')) mask = d.split(' = ')[1];
      else {
        const m = d.match(/\d+/g);
        const floatingAddress = applyMask2(Number(m[0]), mask);
        setAll(mem, floatingAddress, Number(m[1]))
      }
    });
    let ns = [];
    mem.forEach((val, index) => {
      ns.push(val);
    });
    const s = ns.reduce((a, b) => a + b);
    console.log(`The sum is ${s}`);
  }
}