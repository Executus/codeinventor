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

db.prototype.createBehaviourDef = function(script, name, system, filename, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_insert_behaviour_def($1, $2, $3, $4)", [script, name, system, filename], function (err, result) {
      if (err) {
        console.error("error running db function func_insert_behaviour_def", err);
        return cb(err);
      }

      done();

      if (result && result.rowCount > 0) {
        return cb(null, result.rows[0].func_insert_behaviour_def);
      }

      return cb(new Error("Unknown error - failed to create behaviour definition."));
    });
  });
}

db.prototype.updateBehaviourDef = function(behaviourDefId, script, name, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_update_behaviour_def($1, $2, $3)", [behaviourDefId, script, name], function (err, result) {
      if (err) {
        console.error("error running db function func_update_behaviour_def", err);
        return cb(err);
      }

      done();

      if (result && result.rowCount > 0) {
        return cb(null, result.rows[0]);
      }

      return cb(null);
    });
  });
}

db.prototype.deleteBehaviourDef = function(behaviourDefId, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_delete_behaviour_def($1)", [behaviourDefId], function (err, result) {
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

db.prototype.createBehaviourDefProperty = function(name, behaviourDefId, dataType, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_insert_behaviour_def_property($1, $2, $3)", [name, behaviourDefId, dataType], function (err, result) {
      if (err) {
        console.error("error running db function func_insert_behaviour_def_property", err);
        return cb(err);
      }

      done();

      if (result && result.rowCount > 0) {
        return cb(null, result.rows[0].func_insert_behaviour_def_property);
      }

      return cb(new Error("Unknown error - failed to create behaviour definition property."));
    });
  });
}

db.prototype.getPropertyDataTypes = function(cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_get_property_data_types()", [], function (err, result) {
      if (err) {
        console.error("error running db function func_get_property_data_types", err);
        return cb(err);
      }

      done();

      return cb(null, result.rows);
    });
  });
}

db.prototype.getBehaviourDef = function(behaviourDefId, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_get_behaviour_def($1)", [behaviourDefId], function (err, result) {
      if (err) {
        console.error("error running db function func_get_behaviour_def", err);
        return cb(err);
      }

      done();

      return cb(null, result.rows);
    });
  });
}

db.prototype.getBehaviourDefProperties = function(behaviourDefId, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_get_behaviour_def_properties($1)", [behaviourDefId], function (err, result) {
      if (err) {
        console.error("error running db function func_get_behaviour_def_properties", err);
        return cb(err);
      }

      done();

      return cb(null, result.rows);
    });
  });
}

db.prototype.deleteBehaviourDefProperty = function(behaviourDefPropId, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_delete_behaviour_def_property($1)", [behaviourDefPropId], function (err, result) {
      if (err) {
        console.error("error running db function func_delete_behaviour_def_property", err);
        return cb(err);
      }

      done();

      return cb(null);
    });
  });
}

db.prototype.createBehaviourInstance = function(objectId, behaviourDefId, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_insert_behaviour_instance($1, $2)", [objectId, behaviourDefId], function (err, result) {
      if (err) {
        console.error("error running db function func_insert_behaviour_instance", err);
        return cb(err);
      }

      done();

      if (result && result.rowCount > 0) {
        return cb(null, result.rows[0].func_insert_behaviour_instance);
      }

      return cb(new Error("Unknown error - failed to create behaviour instance."));
    });
  });
}

db.prototype.deleteBehaviourInstance = function(behaviourInstanceId, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_delete_behaviour_instance($1)", [behaviourInstanceId], function (err, result) {
      if (err) {
        console.error("error running db function func_delete_behaviour_instance", err);
        return cb(err);
      }

      done();

      return cb(null);
    });
  });
}

db.prototype.createBehaviourInstanceProp = function(behaviourInstanceId, behaviourDefPropId, intVal, floatVal, stringVal, boolVal, timeVal, fileVal, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_insert_behaviour_instance_prop($1, $2, $3, $4, $5, $6, $7, $8)", [behaviourInstanceId, behaviourDefPropId, intVal, floatVal, stringVal, boolVal, timeVal, fileVal], function (err, result) {
      if (err) {
        console.error("error running db function func_insert_behaviour_instance_prop", err);
        return cb(err);
      }

      done();

      if (result && result.rowCount > 0) {
        return cb(null, result.rows[0].func_insert_behaviour_instance_prop);
      }

      return cb(new Error("Unknown error - failed to create behaviour instance property."));
    });
  });
}

db.prototype.deleteBehaviourInstanceProp = function(behaviourInstancePropId, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_delete_behaviour_instance_prop($1)", [behaviourInstancePropId], function (err, result) {
      if (err) {
        console.error("error running db function func_delete_behaviour_instance_prop", err);
        return cb(err);
      }

      done();

      return cb(null);
    });
  });
}

db.prototype.getBehaviourInstances = function(objectId, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_get_behaviour_instances($1)", [objectId], function (err, result) {
      if (err) {
        console.error("error running db function func_get_behaviour_instances", err);
        return cb(err);
      }

      done();

      return cb(null, result.rows);
    });
  });
}

db.prototype.getBehaviourInstanceProperties = function(behaviourInstanceId, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_get_behaviour_instance_properties($1)", [behaviourInstanceId], function (err, result) {
      if (err) {
        console.error("error running db function func_get_behaviour_instance_properties", err);
        return cb(err);
      }

      done();

      return cb(null, result.rows);
    });
  });
}

db.prototype.getPropertyType = function(propertyDefId, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_get_property_type($1)", [propertyDefId], function (err, result) {
      if (err) {
        console.error("error running db function func_get_property_type", err);
        return cb(err);
      }

      done();

      if (result && result.rowCount > 0) {
        return cb(null, result.rows[0].func_get_property_type);
      }

      return cb(new Error("Unknown error - failed to get property type."));
    });
  });
}

db.prototype.updateBehaviourInstanceProp = function(propertyInstanceId, intVal, floatVal, stringVal, boolVal, timeVal, fileVal, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_update_behaviour_instance_property($1, $2, $3, $4, $5, $6, $7)", [propertyInstanceId, intVal, floatVal, stringVal, boolVal, timeVal, fileVal], function (err, result) {
      if (err) {
        console.error("error running db function func_update_behaviour_instance_property", err);
        return cb(err);
      }

      done();

      return cb(null, result.rows);
    });
  });
}

db.prototype.insertFile = function(type, data, filename, cb) {
  this.pool.connect(function (err, client, done) {
    if (err) {
      console.error("error fetching client from pool", err);
      return cb(err);
    }

    client.query("SELECT * FROM func_insert_file($1, $2, $3)", [type, data, filename], function (err, result) {
      if (err) {
        console.error("error running db function func_insert_file", err);
        return cb(err);
      }

      done();

      if (result && result.rowCount > 0) {
        return cb(null, result.rows[0].func_insert_file);
      }

      return cb(new Error("Unknown error - failed to create behaviour instance."));
    });
  });
}