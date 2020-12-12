'use strict';

const fs = require('fs');
const dataPath = 'data/2020_day_12_input.txt';

class Direction {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const East = new Direction(1, 0);
const North = new Direction(0, 1);
const West = new Direction(-1, 0);
const South = new Direction(0, -1);

const AllDirections = [East, North, West, South];

function nextDirection(direction, move) {
  const pos = AllDirections.indexOf(direction);
  let shift;
  switch(move.type) {
    case 'L':
      if (move.value === 270) shift = 3;
      else if (move.value === 180) shift = 2;
      else shift = 1;
      break;
    case 'R':
      if (move.value === 270) shift = 1;
      else if (move.value === 180) shift = 2;
      else shift = 3;
      break;
  }
  const nextPos = (pos + shift) % 4;
  return AllDirections[nextPos];
}

class Move {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

class Waypoint {
  constructor(east, north) {
    this.east = east;
    this.north = north;
  }

  update(move) {
    switch(move.type) {
      case 'N':
        this.north += move.value;
        break;
      case 'S':
        this.north -= move.value;
        break;
      case 'E':
        this.east += move.value;
        break;
      case 'W':
        this.east -= move.value;
        break;
      default:
        const currentEast = this.east;
        const currentNorth = this.north;
        if ((move.type === 'L' && move.value === 270) || (move.type === 'R' && move.value === 90)) {
          this.east = currentNorth;
          this.north = -currentEast;
        } else if (move.value === 180) {
          this.east = -currentEast;
          this.north = -currentNorth;
        } else {
          this.east = -currentNorth;
          this.north = currentEast;
        }
    }
  }
}

class Position1 {
  constructor(east, north, direction) {
    this.east = east;
    this.north = north;
    this.direction = direction;
  }

  update(move) {
    switch(move.type) {
      case 'N':
        this.north += move.value;
        break;
      case 'S':
        this.north -= move.value;
        break;
      case 'E':
        this.east += move.value;
        break;
      case 'W':
        this.east -= move.value;
        break;
      case 'L':
        this.direction = nextDirection(this.direction, move);
        break;
      case 'R':
        this.direction = nextDirection(this.direction, move);
        break;
      case 'F':
        this.east += move.value * this.direction.x;
        this.north += move.value * this.direction.y;
        break;
      default:
    }
  }

  distance() {
    return Math.abs(this.east) + Math.abs(this.north);
  }
}

class Position2 {
  constructor(east, north, waypoint) {
    this.east = east;
    this.north = north;
    this.waypoint = waypoint;
  }

  update(move) {
    switch(move.type) {
      case 'F':
        this.east += move.value * this.waypoint.east;
        this.north += move.value * this.waypoint.north;
        break;
      default:
        this.waypoint.update(move);
    }
  }

  distance() {
    return Math.abs(this.east) + Math.abs(this.north);
  }
}

function extractMoves() {
  const lines = fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '');
  return lines.map(l => {
    const type = /[A-Z]/.exec(l)[0];
    const value = Number(/\d+/.exec(l)[0]);
    return new Move(type, value);
  });
}

module.exports = {
  solve1: () => {
    const pos = new Position1(0, 0, East);
    const moves = extractMoves();
    moves.forEach(m => {
      pos.update(m);
    });
    console.log(`The distance is ${pos.distance()}`);
  },

  solve2: () => {
    const pos = new Position2(0, 0, new Waypoint(10, 1));
    const moves = extractMoves();
    moves.forEach(m => {
      pos.update(m);
    });
    console.log(`The distance is ${pos.distance()}`);
  }
}

