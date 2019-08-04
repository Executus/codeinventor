'use strict';

const db = require('../db');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const async = require('async');

const config = require('../config');

function BehaviourUtility() {
  this.propertyTypes = [];

  let self = this;
  db.getPropertyDataTypes(function(err, results) {
    if (err) {
      console.error('Failed to get property data types from database - ' + err);
      return;
    }

    for (let i = 0; i < results.length; i++) {
      self.propertyTypes.push({
        id: results[i].k_property_data_type,
        name: results[i].s_name
      });
    }
  });
}

BehaviourUtility.prototype.getBehaviourDefs = function(cb) {
  db.getBehaviourDefs(function(err, records) {
    if (err) {
      return cb(err);
    }

    let behaviourDefs = [];

    async.each(records, function(record, next){
      let filename = config.BASE_FILE_DIR + 'tmp/' + record.u_filename + '.js';
      fs.access(filename, fs.F_OK, (err) => {
        if (err) {
          fs.writeFile(filename, record.s_script, 'utf8', function(err2) {
            if (err2) {
              return next(err2);
            }

            behaviourDefs.push({
              id: record.k_behaviour_def,
              name: record.s_name,
              script: record.s_script,
              isSystemBehaviour: record.b_system,
              filename: record.u_filename
            });
  
            return next();
          });
        } else {
          behaviourDefs.push({
            id: record.k_behaviour_def,
            name: record.s_name,
            script: record.s_script,
            isSystemBehaviour: record.b_system,
            filename: record.u_filename
          });

          return next();
        }
      })
    }, function(err) {
      if (err) {
        return cb(err);
      }

      return cb(null, behaviourDefs);
    })
  });
};

BehaviourUtility.prototype.createBehaviourDef = function(behaviourDef, cb) {
  let script = behaviourDef.script;
  let name = behaviourDef.name;
  let isSystem = behaviourDef.isSystemBehaviour;
  let filename = uuidv1();

  let self = this;
  db.createBehaviourDef(script, name, isSystem, filename, function(err, newBehaviourDefId) {
    if (err) {
      return cb(err);
    }

    self.createPropertyDefs(newBehaviourDefId, script, function(err) {
      if (err) {
        return cb(err);
      }

      fs.writeFile(config.BASE_FILE_DIR + 'tmp/' + filename + '.js', script, 'utf8', function(err) {
        if (err) {
          return cb(err);
        }
  
        return cb(null, newBehaviourDefId);
      });
    });
  });
};

BehaviourUtility.prototype.createPropertyDefs = function(behaviourDefId, script, cb) {
  async.each(this.propertyTypes, function(propertyType, next) {
    let startIndex = 0;
    let foundIndex = -1;

    async.whilst(function() {
      foundIndex = script.indexOf('new ' + propertyType.name, startIndex);
      return foundIndex > -1;
    }, function(callback) {
      let nameStartIdx = script.indexOf('\'', foundIndex) + 1;
      let nameEndIdx = script.indexOf('\'', nameStartIdx + 1);
      let name = script.substring(nameStartIdx, nameEndIdx);
      startIndex = nameEndIdx;
      
      db.createBehaviourDefProperty(name, behaviourDefId, propertyType.id, function(err, newPropertyDefId) {
        if (err) {
          return callback(err);
        }
        callback();
      });
    }, next);

  }, cb);
};

BehaviourUtility.prototype.updateBehaviourDef = function(behaviourDef, cb) {
  let behaviourDefId = behaviourDef.id;
  let script = behaviourDef.script;
  let name = behaviourDef.name;
  
  db.updateBehaviourDef(behaviourDefId, script, name, function(err, result) {
    if (err) {
      return cb(err);
    }

    let updatedDef = {
      id: result.k_behaviour_def,
      name: result.s_name,
      script: result.s_script,
      isSystemBehaviour: result.b_system,
      filename: result.u_filename
    };

    fs.writeFile(config.BASE_FILE_DIR + 'tmp/' + updatedDef.filename + '.js', updatedDef.script, 'utf8', function(err) {
      if (err) {
        return cb(err);
      }

      return cb(null, updatedDef);
    });
  });
};

BehaviourUtility.prototype.deleteBehaviourDef = function(behaviourDefId, cb) {
  db.getBehaviourDef(behaviourDefId, function(err, result) {
    if (err) {
      return cb(err);
    }

    if (result && result[0]) {
      let filename = result[0].u_filename;

      db.deleteBehaviourDef(behaviourDefId, function(err) {
        if (err) {
          return cb(err);
        }

        fs.unlink(config.BASE_FILE_DIR + 'tmp/' + filename + '.js', function(err) {
          if (err) {
            return cb(err);
          }

          return cb();
        })
      });
    } else {
      return cb(new Error("Could not find behaviour definition in database."));
    }
  });
};

module.exports = new BehaviourUtility();