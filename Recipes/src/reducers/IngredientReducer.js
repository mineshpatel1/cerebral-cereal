import AsyncStorage from '@react-native-community/async-storage';
import { SET_INGREDIENTS, INIT_INGREDIENTS } from '../actions/types';

const INITIAL_STATE = [];

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
    this.image_aspect_ratio = parseFloat(image_aspect_ratio);
    this.location_id = location_id;
  }

  formatPlural = quantity => this.plural && quantity !== 1 ? this.plural : this.name;
  formatQuantity = quantity => quantity + ' x ' + this.formatPlural(quantity);
}

const IngredientReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_INGREDIENTS:
      const _ingredients = action.ingredients || [];
      return _ingredients.map(i => new Ingredient(i));

    case SET_INGREDIENTS:
      AsyncStorage.setItem('ingredients', JSON.stringify(action.ingredients));
      return action.ingredients.map(i => new Ingredient(i));
      
    default:
      return state;
  }
};

export default IngredientReducer;
