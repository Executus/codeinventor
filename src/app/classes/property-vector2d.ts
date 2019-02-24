import { Property } from './property';
import { PropertyFloat } from './property-float';

export class PropertyVector2d implements Property {
  name: string;
  type: string;
  innerProperties: Property[];

  public x: PropertyFloat;
  public y: PropertyFloat;

  constructor() {
    this.type = 'vector2d';
    this.innerProperties = [];
    
    let x = new PropertyFloat();
    x.name = 'X';
    this.innerProperties.push(x);

    let y = new PropertyFloat();
    y.name = 'Y';
    this.innerProperties.push(y);
  }
}
