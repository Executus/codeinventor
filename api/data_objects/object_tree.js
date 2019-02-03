'use strict';

const ObjectItem = require('../data_objects/object_item');

function ObjectTree() {
  this.treeData = [];
}

ObjectTree.prototype.buildTree = function (data, cb) {
  this.treeData = [];
  let tempMap = {};
  let deepestLevel = 1;

  if (data.length > 0) {
    // Populate tempMap with the database records as follows:
    // tempMap = {
    //   nestedLevel: {
    //     objectId: Object
    //   }
    // }
    for (let i = 0; i < data.length; i++) {
      let obj = data[i];
      let nestLvl = obj.n_nested_level;
      let id = obj.k_object;
      if (tempMap.hasOwnProperty(nestLvl) === false) {
        tempMap[nestLvl] = {};
      }

      let newObj = new ObjectItem(id, obj.k_parent, obj.s_name, nestLvl)
      tempMap[nestLvl][id] = newObj;

      if (nestLvl > deepestLevel) {
        deepestLevel = nestLvl;
      }
    }

    // Starting from the bottom of the tempMap tree, add children to their parents
    for (let i = deepestLevel; i > 0; i--) {
      if (i === 1) {
        // Finally, add the top level objects to treeData
        for (const [key, value] of Object.entries(tempMap[i])) {
          this.treeData.push(value);
        }
      } else {
        let parentLevel = i - 1;
        for (const [key, value] of Object.entries(tempMap[i])) {
          let parentId = value.parent;
          tempMap[parentLevel][parentId].addChild(value);
        }
      }
    }
  }
  
  cb(null, this.treeData);
};

ObjectTree.prototype.jsonSerialise = function () {
  let json = [];
  for (let i = 0; i < this.treeData.length; i++) {
    json.push(this.treeData[i].jsonSerialise());
  }

  return json;
};

module.exports = ObjectTree;