'use strict';

const db = require('../db');
const ObjectItem = require('../data_objects/object_item');
const ObjectTree = require('../data_objects/object_tree');

function ObjectUtility() {

}

ObjectUtility.prototype.getObjects = function(cb) {
  db.getObjects(function (err, recordSet) {
    if (err) {
      return cb(err);
    }

    let objTree = new ObjectTree();
    objTree.buildTree(recordSet.rows, function (err, objects) {
      if (err) {
        return cb(err);
      }

      let objTreeJson = objTree.jsonSerialise();

      return cb(null, objTreeJson);
    });
  });
}

ObjectUtility.prototype.getObject = function(objId, cb) {

}

ObjectUtility.prototype.createObject = function(obj, cb) {
  let parent = obj.parent;
  let name = obj.name;
  let nestedLevel = obj.nestedLevel;

  db.insertObject(parent, name, nestedLevel, function (err, objId) {
    if (err) {
      return cb(err);
    }

    let newObject = new ObjectItem(objId, parent, name, nestedLevel);
    return cb(null, newObject);
  });
}

ObjectUtility.prototype.updateObject = function(obj, cb) {
  db.updateObject(obj.id, obj.name, function (err) {
    if (err) {
      return cb(err);
    }
    return cb(null);
  });
}

ObjectUtility.prototype.deleteObject = function(obj, cb) {
  let objectsToDelete = [];
  objectsToDelete.push(obj.id);

  let deleteFunc = function(objects) {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].children && objects[i].children.length > 0) {
        deleteFunc(objects[i].children);
      }
      objectsToDelete.push(objects[i].id);
    }
  }

  if (obj.children && obj.children.length > 0) {
    deleteFunc(obj.children);
  }

  db.deleteObjects(objectsToDelete, function (err) {
    if (err) {
      return cb(err);
    }

    return cb(null);
  });
}

module.exports = new ObjectUtility();