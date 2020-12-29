'use strict';

const Prime = 20201227;
const Subject = 7;

const CardPub = 10604480;
const DoorPub = 4126658;

function loop(n, subject) {
  return n * subject % Prime;
}

function loopSize(pubKey) {
  let n = 1;
  let ls = 0;
  while (n !== pubKey) {
    n = loop(n, Subject);
    ls++;
  }
  return ls;
}

module.exports = {
  solve1: () => {
    const cardLoopSize = loopSize(CardPub);
    let key = 1;
    for (let i = 0; i < cardLoopSize; i++) {
      key = loop(key, DoorPub);
    }
    console.log(`The key is ${key}`);
  },

  solve2: () => {
  }
}