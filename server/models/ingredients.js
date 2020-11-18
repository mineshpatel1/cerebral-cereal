const RECIPE_DB = 'recipes';
const pg = require(__dirname + '/../utils/pg');

class Ingredient {
  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.plural = row.plural;
    this.category_id = row.category_id;
    this.unit_id = row.unit_id;
    this.unit_size = row.unit_size;
    this.location_id = row.location_id;
    this.image_url = row.image_url;
    this.image_aspect_ratio = row.image_aspect_ratio;
    this.api_id = row.api_id;
  }
}

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    pg.query('SELECT * FROM ingredients', RECIPE_DB)
      .then(results => {
        const _results = results.map(row => new Ingredient(row));
        return resolve(_results);
      })
      .catch(reject);
  });
}
