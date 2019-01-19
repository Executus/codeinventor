'use strict';

const db = require('../db');
const Object = require('../data_objects/object');

function ObjectUtility() {

}

ObjectUtility.prototype.getObjects = function(cb) {

}

ObjectUtility.prototype.getObject = function(objId, cb) {

}

ObjectUtility.prototype.createObject = function(obj, cb) {
  let parent = obj.parent;
  let name = obj.name;
  db.insertObject(parent, name, function (err, objId) {
    if (err) {
      return cb(err);
    }

    let newObject = new Object(objId, parent, name);
    return cb(null, newObject);
  });
}

ObjectUtility.prototype.updateObject = function(obj, cb) {

}

ObjectUtility.prototype.deleteObject = function(obj, cb) {

}

module.exports = new ObjectUtility();