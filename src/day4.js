'use strict';

const fs = require('fs');
const dataPath = 'data/2020_day_4_input.txt';

function isValid1(passport) {
  const oblProps = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
  let v = [];
  oblProps.forEach((p) => {
    v.push(passport.has(p));
  });
  return v.length > 0 && v.reduce((acc, c) => c && acc);
}

function validYear(val, min, max) {
  const m = val.match(/^\d{4}$/);
  if (m !== null) {
    const y = Number(m[0]);
    return typeof y !== 'undefined' && y >= min && y <= max;
  } else {}
    return false;
}

function validByr(byr) {
  return validYear(byr, 1920, 2002);
}

function validIyr(iyr) {
  return validYear(iyr, 2010, 2020);
}

function validEyr(eyr) {
  return validYear(eyr, 2020, 2030);
}

function validHgt(hgt) {
  const m = hgt.match(/(\d+)(cm|in)/);
  if (m !== null) {
    const size = Number(m[1]);
    switch(m[2]) {
      case "cm":
        return size >= 150 && size <= 193;
      case "in":
        return size >= 59 && size <= 76;
      default:
        return false;
    }
  }
}

function validHcl(hcl) {
  const re = new RegExp(/^\#\w{6}$/);
  return re.test(hcl);
}

function validEcl(ecl) {
  const colors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
  return colors.includes(ecl);
}

function validPid(pid) {
  const re = new RegExp(/^\d{9}$/);
  return re.test(pid);
}

function isValid2(passport) {
  const oblProps = [
    {key: 'byr', validation: validByr},
    {key: 'iyr', validation: validIyr},
    {key: 'eyr', validation: validEyr},
    {key: 'hgt', validation: validHgt},
    {key: 'hcl', validation: validHcl},
    {key: 'ecl', validation: validEcl},
    {key: 'pid', validation: validPid}
  ];

  let v = [];
  oblProps.forEach((p) => {
    v.push(passport.has(p.key) && p.validation(passport.get(p.key)));
  });
  return v.length > 0 && v.reduce((acc, c) => c && acc);
}

function passportFromKV(kvs) {
  let m = new Map();
  kvs.forEach((kv) => {
    const a = kv.split(":");
    if (a.length >= 2 && a[1] !== "") m.set(a[0], a[1])
  });
  return m;
}

function passports(data) {
  let ps = [];
  let kvs = [];
  data.forEach((l) => {
    if (l === "") {
      ps.push(passportFromKV(kvs));
      kvs = [];
    } else {
      kvs = kvs.concat(l.split(" "));
    }
  });
  return ps;
}

function extractData() {
  return fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/);
}

function solve(validation) {
  const ps = passports(extractData());
  const v = ps.filter(p => validation(p));
  console.log(`Number of valid passports is ${v.length}`);
}

module.exports = {
  solve1: () => {
    solve(isValid1);
  },

  solve2: () => {
    solve(isValid2);
  }
}