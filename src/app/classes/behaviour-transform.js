'use strict';
//import { Behaviour } from './behaviour';
//import { Property } from './property';
//import { PropertyVector2d } from './property-vector2d';
//import { PropertyFloat } from './property-float';
//import { Object } from './object';

const PropertyVector2d = require('./property-vector2d');
const PropertyFloat = require('./property-float');

class BehaviourTransform {
  constructor(owner) {
    this.name = 'Transform';
    this.properties = [];
    this.attachedObject = owner;

    this.WorldPosition = new PropertyVector2d();

    this.LocalPosition = new PropertyVector2d('Position', 0.0, 0.0);
    this.properties.push(this.LocalPosition);

    let scale = new PropertyVector2d('Scale', 1.0, 1.0);
    this.properties.push(scale);

    this.Rotation = new PropertyFloat('Rotation', 0.0);
    this.properties.push(this.Rotation);
  }

  init(runtimeService) {

  }

  update(runtimeService) {
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
    
  }

  getAttachedObject() {
    return this.attachedObject;
  }

}

module.exports = BehaviourTransform;