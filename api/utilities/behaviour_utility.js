'use strict';

const db = require('../db');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const async = require('async');

const config = require('../config');

function BehaviourUtility() {}

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

  db.createBehaviourDef(script, name, isSystem, filename, function(err, newBehaviourDefId) {
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
  db.deleteBehaviourDef(behaviourDefId, function(err) {
    if (err) {
      return cb(err);
    }

    return cb();
  });
};

module.exports = new BehaviourUtility();