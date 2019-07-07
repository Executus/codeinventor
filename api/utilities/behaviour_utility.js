'use strict';

const db = require('../db');

function BehaviourUtility() {}

BehaviourUtility.prototype.getBehaviourDefs = function(cb) {
  db.getBehaviourDefs(function(err, records) {
    if (err) {
      return cb(err);
    }

    let behaviourDefs = [];

    for (let i = 0; i < records.length; i++) {
      behaviourDefs.push({
        id: records[i].k_behaviour_def,
        name: records[i].s_name,
        script: records[i].s_script,
        isSystemBehaviour: records[i].b_system
      });
    }

    return cb(null, behaviourDefs);
  });
};

BehaviourUtility.prototype.createBehaviourDef = function(behaviourDef, cb) {
  let script = behaviourDef.script;
  let name = behaviourDef.name;
  let isSystem = behaviourDef.isSystemBehaviour;

  db.createBehaviourDef(script, name, isSystem, function(err, newBehaviourDefId) {
    if (err) {
      return cb(err);
    }

    return cb(null, newBehaviourDefId);
  });
};

BehaviourUtility.prototype.updateBehaviourDef = function(behaviourDef, cb) {
  let behaviourDefId = behaviourDef.id;
  let script = behaviourDef.script;
  let name = behaviourDef.name;
  
  db.updateBehaviourDef(behaviourDefId, script, name, function(err, behaviourDefId) {
    if (err) {
      return cb(err);
    }

    return cb(null, behaviourDefId);
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