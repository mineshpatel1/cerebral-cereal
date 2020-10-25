import sys
import operator
import requests
from PIL import Image
from os import path
from io import BytesIO

sys.path.append(path.abspath(path.join(path.dirname(__file__), '..', '..')))
from py_utils.utils import log, load_json, save_json, get_config

CURRENT_DIR = path.dirname(__file__)
ASSETS_DIR = path.abspath(path.join(CURRENT_DIR, '..', 'assets'))
INGREDIENTS_FILE = path.join(ASSETS_DIR, 'ingredients.json')
RECIPES_FILE = path.join(ASSETS_DIR, 'recipes.json')
UNITS_FILE = path.join(ASSETS_DIR, 'units.json')
LOCATIONS_FILE = path.join(ASSETS_DIR, 'locations.json')
OPERATORS = {
    'lt': operator.lt,
    'le': operator.le,
    'gt': operator.gt,
    'ge': operator.ge,
    'eq': operator.eq,
    'ne': operator.ne,
}

# Maps Spoonacular unit names to unit IDs
API_UNIT_MAPPING = {
    'serving': 2,
}

API_CATEGORY_MAPPING = {
    'Produce': 1,
    'Beverages': 7,
}

API_IMAGE_PREFIX = 'https://spoonacular.com/cdn/ingredients_500x500/'

class Unit:
    @staticmethod
    def from_dict(unit_dict):
        return Unit(unit_dict['id'], **unit_dict)

    def __init__(self, unit_id, unit, display, *args, **kwargs):
        self.id = unit_id
        self.unit = unit
        self.display = display


class Ingredient:
    @staticmethod
    def from_dict(ingredient_dict):
        return Ingredient(ingredient_dict['id'], **ingredient_dict)

    @staticmethod
    def new_from_api(ingredient_id, api_dict):
        return Ingredient(
            ingredient_id=ingredient_id,
            name=api_dict['original'],
            category_id=API_CATEGORY_MAPPING.get(api_dict['aisle'], 1),
            unit_id=API_UNIT_MAPPING[api_dict['unit']],
            unit_size=int(api_dict['amount']),
            api_id=api_dict['id'],
            api_image_name=api_dict['image'],
            image_aspect_ratio=get_image_aspect_ratio(f"{API_IMAGE_PREFIX}{api_dict['image']}"),
        )

    def __init__(
        self,
        ingredient_id,
        name,
        unit_size,
        unit_id,
        category_id,
        location_id = None,
        image_url = None,
        api_id = None,
        api_image_name = None,
        image_aspect_ratio = None,
        *args, **kwargs
    ):
        self.id = ingredient_id
        self.name = name
        self.unit_size = unit_size
        self.unit_id = unit_id
        self.category_id = category_id
        self.location_id = location_id
        self.api_id = api_id
        self.image_aspect_ratio = image_aspect_ratio
        self._image_url = image_url
        self._api_image_name = api_image_name

    def format_quantity(self, quantity, units=None):
        if units is None:
            units_data = load_json(UNITS_FILE)
            units = [Unit.from_dict(u) for u in units_data]
        unit = lookup(self.unit_id, units)
        return f"{quantity}{unit.display} {self.name}"

    @property
    def image_url(self):
        if self._image_url:
            return self._image_url
        elif self._api_image_name:
            return f"{API_IMAGE_PREFIX}{self._api_image_name}"

    @property
    def dict(self):
        out = {
            'id': self.id,
            'name': self.name,
            'unit_size': self.unit_size,
            'unit_id': self.unit_id,
            'category_id': self.category_id,
        }

        if self.image_url:
            out['image_url'] = self.image_url

        if self.api_id:
            out['api_id'] = self.api_id

        if self.image_aspect_ratio:
            out['image_aspect_ratio'] = self.image_aspect_ratio

        if self.location_id:
            out['location_id'] = self.location_id

        return out

    def __str__(self):
        return self.name


class Location:
    """Class representing the in store location."""

    @staticmethod
    def sort_locations(locations):
        pass

    @staticmethod
    def from_dict(location_dict):
        location_id = location_dict['id']
        coords = location_dict['coords']
        x = coords['x']
        y = coords['y']
        z = coords['z']
        return Location(location_id, x, y, z, **location_dict)

    def __init__(
        self,
        location_id,
        x, y, z,
        description,
        aisle_number=None,
        associated_categories=None,
        *args,
        **kwargs
    ):
        self.id = location_id
        self.x = x
        self.y = y
        self.z = z
        self.description = description
        self.aisle_number = aisle_number
        self.associated_categories = associated_categories

    @property
    def dict(self):
        out = {
            "id": self.id,
            "coords": {"x": self.x, "y": self.y, "z": self.z},
            "description": self.description,
        }

        if self.aisle_number:
            out['aisle_number'] = self.aisle_number

        if self.associated_categories:
            out['associated_categories'] = self.associated_categories

        return out

    def _compare(self, other, op):
        _op = OPERATORS[op]
    
        # This algorithm snakes around the store going from the top
        # floor first, then moving through the aisles and coming back
        # one self.
        if self.z != other.z:
            return _op(other.z, self.z)  # Top floor first
        elif self.x != other.x:
            return _op(self.x, other.x)
        else:
            # Nearly always start with Fruit & Veg, so ignore
            # the first aisle
            if (self.x) % 2 != 0:
                return _op(self.y, other.y)
            else:
                return _op(other.y, self.y)

    def __str__(self):
        if self.aisle_number:
            return f"{self.aisle_number}: {self.description}"
        else:
            return self.description
  
    def __lt__(self, other):
        return self._compare(other, 'lt')

    def __le__(self, other):
        return self._compare(other, 'le')

    def __gt__(self, other):
        return self._compare(other, 'gt')

    def __ge__(self, other):
        return self._compare(other, 'ge')

    def __ne__(self, other):
        return self._compare(other, 'ne')

    def __eq__(self, other):
        return self._compare(other, 'eq')


def _update_items(new_items, old_items):
    for new_item in new_items:
        found = False
        for old_item in old_items:
            if new_item.id == old_item['id']:
                found = True
                old_item.update(new_item.dict)

        if not found:
            old_items.append(new_item.dict)


def get_max_ingredient_id():
    data = load_json(INGREDIENTS_FILE)
    ingredient_ids = []
    for _ingredient in data['ingredients']:
        ingredient_ids.append(_ingredient['id'])
    return max(ingredient_ids)


def get_api_key():
    api_key = get_config('SPOONACULAR_API_KEY')
    if not api_key:
        raise ValueError("Need to configure SPOONACULAR API KEY")
    return api_key


def update_ingredients(ingredients=(), data_file=INGREDIENTS_FILE):
    data = load_json(data_file)
    _update_items(ingredients, data['ingredients'])
    data['ingredients'] = sorted(data['ingredients'], key=lambda i: i['name'])
    save_json(data, data_file)


def update_locations(locations=(), data_file=LOCATIONS_FILE):
    data = load_json(data_file)
    _update_items(locations, data)
    
    _locations = sorted([Location.from_dict(l) for l in data])
    data = [l.dict for l in _locations]
    save_json(data, data_file)


def get_ingredients_from_api(ingredient_list):
    base_url = f'https://api.spoonacular.com/recipes/parseIngredients?apiKey={get_api_key()}'
    res = requests.post(base_url, {
        'ingredientList': '\n'.join(ingredient_list),
        'servings': 1,
        'includeNutrition': False,
    })
    return res.json()


def lookup(item_id, items):
    match_ingredient = list(filter(lambda i: i.id == item_id, items))
    try:
        return match_ingredient[0]
    except IndexError:
        log.warning(f'Item with ID {item_id} cannot be found.')
        return None


def get_image_aspect_ratio(uri):
    r = requests.get(uri)
    image = Image.open(BytesIO(r.content))
    image_size = image.size
    return image_size[0] / image_size[1]


def add_ingredients_from_api(new_ingredients):
    max_id = get_max_ingredient_id() + 1
    ingredients = []
    for api_dict in get_ingredients_from_api(new_ingredients):
        ingredients.append(
            Ingredient.new_from_api(max_id, api_dict),
        )
        max_id += 1

    update_ingredients(ingredients)


def main():
    items = [
        'Plain Flour',
        'Cane Sugar',
        'Salt',
        'Cocoa Powder',
        'Ground Ginger',
        'Coconut Oil',
        'Vanilla Extract',
        'Cider Vinegar',
        'Coffee',
        'Water',
    ]

    add_ingredients_from_api(items)


if __name__ == '__main__':
    main()
