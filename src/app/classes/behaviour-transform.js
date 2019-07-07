'use strict';

const PropertyVector2d = require('./property-vector2d');
const PropertyFloat = require('./property-float');

class BehaviourTransform {
  constructor(owner) {
    this.name = 'Transform';
    this.properties = [];
    this.attachedObject = owner;

    // Declare properties here.
    this.WorldPosition = new PropertyVector2d();
    this.LocalPosition = new PropertyVector2d('Position', 0.0, 0.0);
    let scale = new PropertyVector2d('Scale', 1.0, 1.0);
    this.Rotation = new PropertyFloat('Rotation', 0.0);

    // Properties added to 'this.properties' will show up in the Editor.
    this.properties.push(this.LocalPosition);
    this.properties.push(scale);
    this.properties.push(this.Rotation);
  }

  init(runtimeService) {
    // Code here will run once when the object is created.

  }

  update(runtimeService) {
    // Code here will run every frame (about 60 times every second).
    this.WorldPosition.X = this.LocalPosition.X;
    this.WorldPosition.Y = this.LocalPosition.Y;
    
    let parentObject = this.attachedObject.getParent();
    if (parentObject) {
      let parentTransform = parentObject.getBehaviour('BehaviourTransform');
      if (parentTransform) {
        this.WorldPosition.X = parentTransform.WorldPosition.X + this.LocalPosition.X;
        this.WorldPosition.Y = parentTransform.WorldPosition.Y + this.LocalPosition.Y;
      }
    }
  }

  draw(runtimeService) {
    // Advanced use - rendering specific code. Runs every frame after update.
    // Most people will not need to write any code here.
    
  }

  getAttachedObject() {
    return this.attachedObject;
  }

}

module.exports = BehaviourTransform;