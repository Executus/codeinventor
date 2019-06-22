'use strict';
//import { Property } from './property';
//import { PropertyFloat } from './property-float';

class PropertyVector2d {
  constructor(name, x, y) {
    this.type = 'vector2d';

    this.name = name || '';
    this.X = x || 0.0;
    this.Y = y || 0.0;
  }
}

module.exports = PropertyVector2d;