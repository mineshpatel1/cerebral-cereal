const pg = require('pg');
const utils = require(__dirname + '/utils');

exports.DEFAULT_DB = 'postgres';
const DATABASES = ['postgres', 'recipes'];
const config = {
  user: global.config.pg.user,
  password: global.config.pg.password,
  host: global.config.pg.host,
  port: global.config.pg.port, 
  max: 10, // Max number of clients in the pool
  idleTimeoutMillis: 1000, // How long a client is allowed to remain idle before being closed
};

// Creates a connection pool using the user specified database
createPool = db => {
  let _config = utils.clone(config);
  _config['database'] = db;
  return new pg.Pool(_config);
}

createAllPools = () => {
  let pools = {}
  DATABASES.forEach(db => {
    pools[db] = createPool(db);
  });
  return pools;
}

exports.pools = createAllPools();

exports.query = (sql, db=exports.DEFAULT_DB, params=null) => {
  return new Promise((resolve, reject) => {
    exports.pools[db].connect()
      .then(client => {
        client.query(sql, params)
          .then(result => resolve(result.rows))
          .catch(err => reject(err))
          .finally(() => client.release());
      });
  });
}
