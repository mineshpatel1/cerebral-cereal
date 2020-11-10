const USER_DB = 'postgres';
const { log } = require(__dirname + '/../utils/utils');
const pg = require(__dirname + '/../utils/pg');

class User {
  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.name = row.name;
  }
}

exports.get = (email=null, id=null) => {
  const clause = id ? 'id = $1::integer' : 'email = $1::text';
  const value = id ? id : email;

  return new Promise((resolve, reject) => {
    pg.query('SELECT * FROM users WHERE ' + clause, USER_DB, [value])
      .then(result => {
        if (result.length == 0) return resolve(null);
        if (result.length > 1) return reject(new Error("More than 1 user found for a single ID."));
        return resolve(new User(result[0]));
      })
      .catch(reject);
  });
}

/**
 * Creates a new user and writes it to the database.
*/
exports.new = (email, name) => {
  log.info('Creating new user from OAuth ' + email + '...');
  return new Promise((resolve, reject) => {
    pg.query(
      `INSERT INTO users(email, name, created_time) 
      VALUES ($1::text, $2::text, EXTRACT(epoch FROM now()))`,
      USER_DB,
      [email, name],
    ).then(() => {
      exports.get(email)
        .then(resolve)
        .catch(reject);
    })
    .catch(reject);
  });
}