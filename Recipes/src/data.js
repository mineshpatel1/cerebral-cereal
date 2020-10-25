const rawUnits = require('../assets/units.json');
const rawIngredients = require('../assets/ingredients.json');
const rawRecipes = require('../assets/recipes.json');
const rawLocations = require('../assets/locations.json');

class Ingredient {
  constructor(ingredient) {
    const {
      id, name, plural, unit_size, unit_id, category_id, api_id,
      image_url, image_aspect_ratio, location_id,
    } = ingredient;

    this.id = id;
    this.name = name;
    this.plural = plural;
    this.unit_size = unit_size;
    this.unit_id = unit_id;
    this.category_id = category_id;
    this.api_id = api_id;
    this.image_url = image_url;
    this.image_aspect_ratio = image_aspect_ratio;
    this.location_id = location_id;
  }

  formatPlural = quantity => this.plural && quantity !== 1 ? this.plural : this.name;
  formatQuantity = quantity => quantity + ' x ' + this.formatPlural(quantity);
}

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
export const ingredients = rawIngredients.ingredients.map(i => new Ingredient(i));
export const ingredientCategories = rawIngredients.categories;
export const recipes = rawRecipes.recipes;
export const cuisines = rawRecipes.cuisines;
export const locations = rawLocations.map(l => new Location(l));