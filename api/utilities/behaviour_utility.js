'use strict';

const db = require('../db');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const async = require('async');

const config = require('../config');

function BehaviourUtility() {
  this.propertyTypes = [];
  this.propertyTypeIdMap = {};

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
      self.propertyTypeIdMap[results[i].s_name] = results[i].k_property_data_type;
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

        let newBehaviourDef = {
          id: newBehaviourDefId,
          script: script,
          name: name,
          isSystem: isSystem,
          filename: filename
        }
  
        return cb(null, newBehaviourDef);
      });
    });
  });
};

BehaviourUtility.prototype.parseScriptForProperties = function(script) {
  let properties = {
    'PropertyFloat': [],
    'PropertyInteger': [],
    'PropertyString': [],
    'PropertyBoolean': [],
    'PropertyDate': [],
    'PropertyFile': []
  };

  let inComment = false;
  let inBlockComment = false;
  let inString = false;
  let strChar = '';
  let refObj = {
    buff: ''
  };

  let addOrResetBuffer = function(ref, char, expectedBuff, expectedChar) {
    if (ref.buff === expectedBuff) {
      if (char === expectedChar) {
        ref.buff += char;
      } else {
        ref.buff = '';
      }
      return true;
    }
    return false;
  }

  // Iterate through each character in the script
  for (let i = 0; i < script.length; i++) {
    let c = script.charAt(i);

    // If we're in a comment, check for newline
    if (inComment) {
      if (c === '\n') {
        inComment = false;
      }
      continue;
    }

    // If we're in a block comment, check for '/' or '*'
    if (inBlockComment && c !== '/' && c !== '*') {
      continue;
    }

    // Check for strings
    if (c === '\'' || c === '\"') {
      if (!inString) {
        inString = true;
        strChar = c;
      } else {
        if (strChar === c) {
          inString = false;
          strChar = '';
        }
      }
      continue;
    }

    if (inString) {
      continue;
    }

    // Check for comment
    if (c === '/') {
      if (refObj.buff === '/') {
        inComment = true;
        refObj.buff = '';
      } else if (inBlockComment && refObj.buff === '*') {
        inBlockComment = false;
        refObj.buff = '';
      } else {
        refObj.buff = c;
      }
      continue;
    }

    // Check for block comment
    if (c === '*') {
      if (refObj.buff === '/') {
        inBlockComment = true;
        refObj.buff = '';
      } else {
        refObj.buff = c;
      }
      continue;
    }

    // If the buffer is empty and the character isn't 'n', continue
    if (refObj.buff === '') {
      if (c === 'n') {
        refObj.buff = c;
      }
      continue;
    }

    if (addOrResetBuffer(refObj, c, 'n', 'e') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'ne', 'w') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new', ' ') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new ', 'P') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new P', 'r') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new Pr', 'o') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new Pro', 'p') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new Prop', 'e') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new Prope', 'r') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new Proper', 't') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new Propert', 'y') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new Property', 'F') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new PropertyF', 'l') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new PropertyFl', 'o') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new PropertyFlo', 'a') === true) { continue; }
    if (addOrResetBuffer(refObj, c, 'new PropertyFloa', 't') === true) {
      if (refObj.buff === 'new PropertyFloat') {
        // Found a PropertyFloat
        let nameStartIdx = i + 3;
        let nameEndIdx = script.indexOf('\'', nameStartIdx + 1);
        let name = script.substring(nameStartIdx, nameEndIdx);
        properties['PropertyFloat'].push(name);
        refObj.buff = '';
        continue;
      }
    }
  }

  return properties;
}

BehaviourUtility.prototype.createPropertyDefs = function(behaviourDefId, script, cb) {
  let properties = this.parseScriptForProperties(script);

  async.each(this.propertyTypes, function(propertyType, nextTypeCb) {
    async.each(properties[propertyType.name], function(property, nextPropCb) {
      db.createBehaviourDefProperty(property, behaviourDefId, propertyType.id, function(err, newPropertyDefId) {
        if (err) {
          return nextPropCb(err);
        }
        nextPropCb();
      });
    }, nextTypeCb);
  }, cb);
};

BehaviourUtility.prototype.updatePropertyDefs = function(behaviourDefId, script, cb) {
  let self = this;
  let properties = this.parseScriptForProperties(script);
  let existingPropertyMap = {};

  db.getBehaviourDefProperties(behaviourDefId, function(err, results) {
    if (err) {
      return cb(err);
    }

    async.series([
      function(mapExistingPropertiesCb) {
        async.each(results, function(result, next) {
          existingPropertyMap[result.s_name] = result.k_behaviour_def_property;
          next();
        }, mapExistingPropertiesCb);
      },
      function(addNewPropertiesCb) {
        async.eachOf(properties, function(propertyTypeValues, propertyType, nextPropertyTypeCb) {
          async.each(propertyTypeValues, function(val, valueCb) {
            if (existingPropertyMap.hasOwnProperty(val)) {
              delete existingPropertyMap[val];
              return valueCb();
            } else {
              db.createBehaviourDefProperty(val, behaviourDefId, self.propertyTypeIdMap[propertyType], valueCb);
            }
          }, nextPropertyTypeCb);
        }, addNewPropertiesCb);
      },
      function(removeOldPropertiesCb) {
        async.each(existingPropertyMap, function(oldPropertyId, next){
          db.deleteBehaviourDefProperty(oldPropertyId, next);
        }, removeOldPropertiesCb);
      }
    ], cb);
  });
}

BehaviourUtility.prototype.updateBehaviourDef = function(behaviourDef, cb) {
  let behaviourDefId = behaviourDef.id;
  let script = behaviourDef.script;
  let name = behaviourDef.name;
  let self = this;
  
  db.updateBehaviourDef(behaviourDefId, script, name, function(err, result) {
    if (err) {
      return cb(err);
    }

    self.updatePropertyDefs(behaviourDefId, script, function(err) {
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