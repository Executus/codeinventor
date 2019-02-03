'use strict';

function ObjectItem(id, parent, name, nestedLevel) {
  this.id = id;
  this.parent = parent;
  this.name = name;
  this.nestedLevel = nestedLevel;
  this.children = [];
}

ObjectItem.prototype.addChild = function(child) {
  child.parent = this;
  this.children.push(child);
};

ObjectItem.prototype.jsonSerialise = function() {
  let json = {
    id: this.id,
    parent: (this.parent) ? this.parent.id : null,
    name: this.name,
    nestedLevel: this.nestedLevel,
    children: []
  };

  for (let i = 0; i < this.children.length; i++) {
    json.children.push(this.children[i].jsonSerialise());
  }

  return json;
}

module.exports = ObjectItem;