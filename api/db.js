'use strict';

const pg = require('pg');
const Config = require('./config');

function db() {
  this.pgConfig = {
    user: Config.DB_USER,
    database: Config.DB_NAME,
    password: Config.DB_PASSWORD,
    port: Config.DB_PORT,
    max: Config.DB_MAX_POOL,
    idleTimeoutMillis: Config.DB_IDLE_TIMEOUT
  };

  this.pool = new pg.Pool(this.pgConfig);
}

db.prototype.insertObject = function(parentId, name, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_insert_object($1, $2)", [parentId, name], function (err, recordSet) {
      if (err) {
        console.error("error running db function func_insert_object", err);
        return cb(err);
      }

      done();

      if (recordSet && recordSet.rowCount > 0) {
        return cb(null, recordSet.rows[0]);
      } else {
        return cb(new Error("Unexpected result from db function func_insert_object"));
      }
    });
  });
}

module.exports = new db();