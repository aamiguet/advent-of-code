'use strict';

const TestCups = [3, 8, 9, 1, 2, 5, 4, 6, 7];
const InputCups = [1, 2, 3, 4, 8, 7, 5, 9, 6];

function destination(current, pickedUp, highest) {
  let d = current;
  do {
    d = d === 1 ? highest : d - 1;
  } while (pickedUp.includes(d));
  return d;
}

function print(cupMap) {
  let current = cupMap.get(1);
  let val = [];
  while (current !== 1) {
    val.push(current);
    current = cupMap.get(current);
  }
  return val.join('');
}

function extend(cups, highest) {
  let c = cups.slice();
  const start = Math.max(...cups) + 1;
  for (let i = start; i <= highest; i++) {
    c.push(i);
  }
  return c;
}

function asMap(cups) {
  let m = new Map();
  for (let i = 0; i < cups.length; i++) {
    m.set(cups[i], cups[(i + 1) % cups.length]);
  }
  return m;
}

/**
 * Updates the cup map and returns the next key
 *
 * @param {*} cupMap
 * @param {*} key
 * @param {*} highest
 */
function updateMap(cupMap, key, highest) {
  const pickUpSize = 3;
  let pickedUp = [cupMap.get(key)];
  for (let i = 1; i < pickUpSize; i++) {
    pickedUp.push(cupMap.get(pickedUp[i-1]));
  }
  const dest = destination(key, pickedUp, highest);
  // key -> value following the last removed value
  cupMap.set(key, cupMap.get(pickedUp[pickedUp.length - 1]));
  // last removed value -> value following the destination
  cupMap.set(pickedUp[pickedUp.length - 1], cupMap.get(dest));
  // destination -> first removed value
  cupMap.set(dest, pickedUp[0]);
  return cupMap.get(key);
}

module.exports = {
  solve1: () => {
    const cups = InputCups;
    const highest = Math.max(...cups);
    let cupMap = asMap(cups);
    let key = cups[0]
    for (let i = 0; i < 100; i++) {
      key = updateMap(cupMap, key, highest);
    }
    console.log(print(cupMap));
  },

  solve2: () => {
    const heighest = 1000000;
    const cups = extend(InputCups, heighest);
    let cupMap = asMap(cups);
    let key = cups[0];
    for (let i = 0; i < 10000000; i++) {
      key = updateMap(cupMap, key, heighest);
    }
    const next = cupMap.get(1);
    console.log(`The following values are ${next} and ${cupMap.get(next)}. Their product is ${next * cupMap.get(next)}`);
  }
}