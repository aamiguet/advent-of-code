const PickUpSize = 3;
const Highest = 9;

const TestState = {
  cups: [3,8,9,1,2,5,4,6,7],
  index: 0,
  move: 10
};
const InputState = {
  cups: [1, 2, 3, 4, 8, 7, 5, 9, 6],
  index: 0,
  move: 100
};

function destination(current, pickedUp) {
  let d = current;
  do {
    d = d === 1 ? Highest : d - 1;
  } while (pickedUp.includes(d));
  return d;
}

function move(state) {
  const current = state.cups[state.index];
  let relativeCups = state.cups.slice(state.index + 1).concat(state.cups.slice(0, state.index));
  const pickedUp = relativeCups.splice(0, PickUpSize);
  const dest = destination(current, pickedUp);
  const destIndex = relativeCups.indexOf(dest);
  const newRelativeCups = relativeCups.slice(0, destIndex + 1).concat(pickedUp).concat(relativeCups.slice(destIndex + 1));
  const leftCups = state.index > 0 ? newRelativeCups.slice(-state.index) : [];
  const rightCups = state.index < newRelativeCups.length ? newRelativeCups.slice(0, newRelativeCups.length - state.index) : [];
  const newCups = leftCups.concat([current]).concat(rightCups);
  const newIndex = state.index === newCups.length - 1 ? 0 : state.index + 1;
  return {
    cups: newCups,
    index: newIndex,
    move: state.move
  };
}

function print(state) {
  const index = state.cups.indexOf(1);
  const arrangedCups = state.cups.slice(index + 1).concat(state.cups.slice(0, index));
  return arrangedCups.join('');
}

module.exports = {
  solve1: () => {
    let state = InputState;
    for (let i = 0; i < state.move; i++) {
      state = move(state);
    }
    console.log(print(state));
  },

  solve2: () => {
  }
}