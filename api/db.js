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

db.prototype.insertObject = function(parentId, name, nestedLevel, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_insert_object($1, $2, $3)", [parentId, name, nestedLevel], function (err, recordSet) {
      if (err) {
        console.error("error running db function func_insert_object", err);
        return cb(err);
      }

      done();

      if (recordSet && recordSet.rowCount > 0) {
        return cb(null, recordSet.rows[0].func_insert_object);
      } else {
        return cb(new Error("Unexpected result from db function func_insert_object"));
      }
    });
  });
}

db.prototype.getObjects = function(cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_get_objects()", [], function (err, recordSet) {
      if (err) {
        console.error("error running db function func_get_objects", err);
        return cb(err);
      }

      done();

      if (recordSet) {
        return cb(null, recordSet);
      } else {
        return cb(new Error("Unexpected result from db function func_get_objects"));
      }
    });
  });
}

db.prototype.updateObject = function(objectId, name, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_update_object($1, $2)", [objectId, name], function (err, objectId) {
      if (err) {
        console.error("error running db function func_update_object", err);
        return cb(err);
      }

      done();

      return cb(null);
    });
  });
}

db.prototype.deleteObjects = function(objectId, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_delete_objects($1)", [objectId], function (err, numObjectsDeleted) {
      if (err) {
        console.error("error running db function func_delete_objects", err);
        return cb(err);
      }

      done();

      return cb(null);
    });
  });
}

db.prototype.getFiles = function(type, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_get_files($1)", [type], function (err, fileRecords) {
      if (err) {
        console.error("error running db function func_get_files", err);
        return cb(err);
      }

      done();

      return cb(null, fileRecords);
    });
  });
}

db.prototype.getBehaviourDefs = function(cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_get_behaviour_defs()", [], function (err, result) {
      if (err) {
        console.error("error running db function func_get_behaviour_defs", err);
        return cb(err);
      }

      done();

      return cb(null, result.rows);
    });
  });
}

db.prototype.createBehaviourDef = function(script, name, system, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_insert_behaviour_def($1, $2, $3)", [script, name, system], function (err, newBehaviourDefId) {
      if (err) {
        console.error("error running db function func_insert_behaviour_def", err);
        return cb(err);
      }

      done();

      return cb(null, newBehaviourDefId);
    });
  });
}

db.prototype.updateBehaviourDef = function(behaviourDefId, script, name, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_update_behaviour_def($1, $2, $3)", [behaviourDefId, script, name], function (err, behaviourDefId) {
      if (err) {
        console.error("error running db function func_update_behaviour_def", err);
        return cb(err);
      }

      done();

      return cb(null, behaviourDefId);
    });
  });
}

db.prototype.deleteBehaviourDef = function(behaviourDefId, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_delete_behaviour_def($1)", [behaviourDefId], function (err, numRecordsDeleted) {
      if (err) {
        console.error("error running db function func_delete_behaviour_def", err);
        return cb(err);
      }

      done();

      return cb(null);
    });
  });
}

module.exports = new db();