const RECIPE_DB = 'recipes';
const pg = require(__dirname + '/../utils/pg');

class Recipe {
  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.cuisine_id = row.cuisine_id;
    this.serving_size = row.serving_size;
    this.method = row.method;
    this.ingredients = row.ingredients;
  }
}

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    pg.query('SELECT * FROM recipes', RECIPE_DB)
      .then(results => {
        const _results = results.map(row => new Recipe(row));
        return resolve(_results);
      })
      .catch(reject);
  });
}
