const input = [9,3,1,0,8,4];

function updateMap(map, val, pos) {
  map.has(val) ? map.get(val).push(pos) : map.set(val, [pos]);
}

function solve(nth) {
  const map = new Map();
  let count = 0;
  let last;
  input.forEach(v => {
    updateMap(map, v, count);
    last = v;
    count++;
  });
  while (count < nth) {
    const a = map.get(last);
    last = a.length === 1 ? 0 : a[a.length - 1] - a[a.length - 2];
    updateMap(map, last, count);
    count++;
  }
  console.log(last);
}

module.exports = {
  solve1: () => {
    solve(2020);
  },

  solve2: () => {
    solve(30000000);
  }
}