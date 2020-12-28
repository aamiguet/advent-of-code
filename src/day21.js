'use strict';

const fs = require('fs');

const dataPath = 'data/2020_day_21_input.txt';

class Food {
  constructor(line) {
    this.ingredients = line.match(/[\w\s]+/)[0].trim().split(' ');
    const allergensInfo = line.match(/\([\w\s\,]+\)/)[0];
    this.allergens = allergensInfo.substr(10, allergensInfo.length - 11).split(', ');
  }
}

function intersection(arr1, arr2) {
  return arr1.filter(value => arr2.includes(value));
}

function extractFoods() {
  return fs
    .readFileSync(dataPath)
    .toString()
    .split(/\n/)
    .filter(l => l.trim() !== '')
    .map(l => new Food(l));
}

function filterUsed(ingredients, used) {
  return ingredients.filter(i => !used.includes(i));
}

function findUniqueIngredient(foods, allergen, aiMap) {
  const usedIngredients = [...aiMap.values()];
  const filteredFoods = foods.filter(f => f.allergens.includes(allergen));
  const ingredients = filteredFoods.map(f => filterUsed(f.ingredients, usedIngredients));
  const r = ingredients.reduce(intersection, ingredients[0]);
  if (r.length === 1) {
    aiMap.set(allergen, r[0]);
  }
}

function allergensMap(foods) {
  const allAllergens = [...new Set(foods.flatMap(f => f.allergens))];
  const aiMap = new Map();
  while (allAllergens.length > aiMap.size) {
    allAllergens.forEach(a => findUniqueIngredient(foods, a, aiMap));
  }
  return aiMap;
}

module.exports = {
  solve1: () => {
    const foods = extractFoods();
    const aiMap = allergensMap(foods);
    const allIngredients = foods.flatMap(f => f.ingredients);
    const safeIngredientsOccurence = filterUsed(allIngredients, [...aiMap.values()]);
    console.log(`The number of occurence of ingredients that do not contain any allergen is ${safeIngredientsOccurence.length}`);
  },

  solve2: () => {
    const foods = extractFoods();
    const aiMap = allergensMap(foods);
    const allergens = [...aiMap.keys()].sort();
    const dangerIngredients = allergens.map(a => aiMap.get(a));
    console.log(dangerIngredients.join(','));
  }
}