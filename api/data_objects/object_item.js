'use strict';

function ObjectItem(id, parent, name, nestedLevel) {
  this.id = id;
  this.parent = parent;
  this.name = name;
  this.nestedLevel = nestedLevel;
  this.parent = null;
  this.children = [];
}

ObjectItem.prototype.addChild = function(child) {
  child.parent = this;
  this.children.push(child);
}

module.exports = ObjectItem;