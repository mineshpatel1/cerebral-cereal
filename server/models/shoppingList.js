const RECIPE_DB = 'recipes';
const pg = require(__dirname + '/../utils/pg');
const pgFormat = require('pg-format');

class ShoppingListItem {
  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.quantity = row.quantity;
    this.ingredient_id = row.ingredient_id;
    this.location_id = row.location_id;
    this.checked = row.checked;
  }
}

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    pg.query('SELECT * FROM shopping_list', RECIPE_DB)
      .then(results => {
        const _results = results.map(row => new ShoppingListItem(row));
        return resolve(_results);
      })
      .catch(reject);
  });
}
  
exports.addItems = items => {
  const _items = items.map(i => {
    return [i.name, i.quantity, i.ingredient_id, i.location_id, i.checked];
  });
  return pg.query(
    pgFormat(
      'INSERT INTO shopping_list(name, quantity, ingredient_id, location_id, checked) VALUES %L',
      _items,
    ),
    RECIPE_DB,
  );
}

exports.toggleItem = (itemId, checked) => {
  return pg.query(
    'UPDATE shopping_list SET checked = $1::boolean WHERE id = $2::integer;',
    RECIPE_DB, [checked, itemId],
  );
}