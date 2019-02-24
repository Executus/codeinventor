import { Property } from './property';

export class PropertyFloat implements Property {
  name: string;
  type: string;
  innerProperties: Property[];

  constructor() {
    this.type = 'float';
  }
}
