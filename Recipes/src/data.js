const rawUnits = require('../assets/units.json');
const rawCuisines = require('../assets/cuisines.json');
const rawIngredients = require('../assets/ingredients.json');
const rawIngredientCategories = require('../assets/ingredientCategories.json');
const rawRecipes = require('../assets/recipes.json');
const rawLocations = require('../assets/locations.json');

class Location {
  constructor(location) {
    const {
      id, coords, description, aisle_number, associated_categories
    } = location;

    this.id = id;
    this.coords = coords;
    this.description = description;
    this.aisle_number = aisle_number;
    this.associated_categories = associated_categories;
  }

  formatName = (prefix='Aisle ') => {
    return (
      this.aisle_number ?
      prefix + this.aisle_number + ': ' + this.description :
      this.description
    );
  }
}

class Unit {
  constructor(_unit) {
    const {id, unit, display, plural} = _unit;
    this.id = id;
    this.unit = unit;
    this.display = display;
    this.plural = plural;
  }
  formatPlural = quantity => this.plural && quantity > 1 ? this.plural : this.display;
}

// May want to instantiate these into JS class objects.
export const units = rawUnits.units.map(u => new Unit(u));
export const conversions = rawUnits.conversions;
// export const ingredients = rawIngredients.map(i => new Ingredient(i));
export const ingredientCategories = rawIngredientCategories;
// export const recipes = rawRecipes;
export const cuisines = rawCuisines;
export const locations = rawLocations.map(l => new Location(l));