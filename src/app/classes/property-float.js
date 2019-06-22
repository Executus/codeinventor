'use strict';
//import { Property } from './property';

class PropertyFloat {
  constructor(name, value) {
    this.type = 'float';

    this.name = name || '';
    this.Value = value || 0.0;
  }
}

module.exports = PropertyFloat;