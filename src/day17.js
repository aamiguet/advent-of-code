'use strict';

const fs = require('fs');

const dataPath = 'data/2020_day_17_input.txt';

class Cube {
  constructor(coords, state) {
    this.coords = coords;
    this.state = state;
    this.neighbors = [];
  }

  addNeighbor(cube) {
    if (this.canBeNeighbor(cube)) this.neighbors.push(cube);
  }

  canBeNeighbor(cube) {
    return (
      this.coords.filter((c, index) => c !== cube.coords[index]).length > 0 &&
      this.coords.every((c, index) => Math.abs(c - cube.coords[index]) <= 1) &&
      !this.neighbors.includes(cube)
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

function extractLines() {
  return fs
  .readFileSync(dataPath)
  .toString()
  .split(/\n/)
  .filter(l => l.trim() !== '');
}

function initPocket3D(xLength, yLength, zLength, cycles) {
  let cubes = [];
  for (let x = -cycles; x <= xLength + cycles; x++) {
    for (let y = -cycles; y <= yLength + cycles; y++) {
      for (let z = -cycles; z <= zLength + cycles; z++) {
        cubes.push(new Cube([x, y, z], false));
      }
    }
  }
  cubes.forEach((c, index, cs) => {
    cs.forEach(n => c.addNeighbor(n));
  });
  return cubes;
}

function extractData3D(cycles) {
  const lines = extractLines();
  const cubes = initPocket3D(lines[0].length, lines.length, 0, cycles);
  cubes.forEach((c) => {
    if (c.coords[2] === 0 && typeof lines[c.coords[1]] !== 'undefined' && typeof lines[c.coords[1]][c.coords[0]] !== 'undefined') {
      c.state = lines[c.coords[1]][c.coords[0]] === '#';
    }
  });
  return cubes;
}

function initPocket4D(xLength, yLength, zLength, wLength, cycles) {
  // this is obviously an awful way of doing it, let's hope we don't get more dimensions :)
  let cubes = [];
  for (let x = -cycles; x <= xLength + cycles; x++) {
    for (let y = -cycles; y <= yLength + cycles; y++) {
      for (let z = -cycles; z <= zLength + cycles; z++) {
        for (let w = -cycles; w <= wLength + cycles; w++) {
          cubes.push(new Cube([x, y, z, w], false));
        }
      }
    }
  }
  cubes.forEach((c, index, cs) => {
    cs.forEach(n => c.addNeighbor(n));
  });
  return cubes;
}

function extractData4D(cycles) {
  const lines = extractLines();
  const cubes = initPocket4D(lines[0].length, lines.length, 0, 0, cycles);
  cubes.forEach((c) => {
    if (c.coords[3] === 0 && c.coords[2] === 0 && typeof lines[c.coords[1]] !== 'undefined' && typeof lines[c.coords[1]][c.coords[0]] !== 'undefined') {
      c.state = lines[c.coords[1]][c.coords[0]] === '#';
    }
  });
  return cubes;
}

function solve(extractData) {
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
}

module.exports = {
  solve1: () => {
    solve(extractData3D);
  },

  solve2: () => {
    solve(extractData4D);
  }
}