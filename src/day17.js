'use strict';

const fs = require('fs');

const dataPath = 'data/2020_day_17_input.txt';

class Cube {
  constructor(x, y, z, state) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.state = state;
    this.neighbors = [];
  }

  addNeighbor(cube) {
    if (this.canBeNeighbor(cube)) this.neighbors.push(cube);
  }

  canBeNeighbor(cube) {
    return (
      (this.x !== cube.x || this.y !== cube.y || this.z !== cube.z) &&
      Math.abs(this.x - cube.x) <= 1 &&
      Math.abs(this.y - cube.y) <= 1 &&
      Math.abs(this.z - cube.z) <= 1 &&
      (!this.neighbors.includes(cube))
    );
  }

  nextState() {
    const activeNeighbors = this.neighbors.filter(n => n.state).length;
    if (this.state) {
      return activeNeighbors === 2 || activeNeighbors === 3;
    } else {
      return activeNeighbors === 3;
    }
  }
}

function initPocket(xLength, yLength, zLength, cycles) {
  let cubes = [];
  for (let x = -cycles; x <= xLength + cycles; x++) {
    for (let y = -cycles; y <= yLength + cycles; y++) {
      for (let z = -cycles; z <= zLength + cycles; z++) {
        cubes.push(new Cube(x, y, z, false));
      }
    }
  }
  cubes.forEach((c, index, cs) => {
    cs.forEach(n => c.addNeighbor(n));
  });
  return cubes;
}

function extractData(cycles) {
  const lines = fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '');
  const cubes = initPocket(lines[0].length, lines.length, 0, cycles);
  cubes.forEach((c) => {
    if (c.z === 0 && typeof lines[c.y] !== 'undefined' && typeof lines[c.y][c.x] !== 'undefined') {
      c.state = lines[c.y][c.x] === '#';
    }
  });
  return cubes;
}

module.exports = {
  solve1: () => {
    const cycles = 6;
    const cubes = extractData(cycles);
    for (let i = 0; i < cycles; i++) {
      const nextStates = cubes.map(c => c.nextState());
      nextStates.forEach((v, index) => {
        cubes[index].state = v;
      });
    }
    const activeCubes = cubes.filter(c => c.state).length;
    console.log(`There are ${activeCubes} active cubes after ${cycles} cycles`);
  },

  solve2: () => {
  }
}