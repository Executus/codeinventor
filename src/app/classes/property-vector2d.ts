import { Property } from './property';
import { PropertyFloat } from './property-float';

export class PropertyVector2d implements Property {
  name: string;
  type: string;

  public X: number;
  public Y: number;

  constructor(name?: string, x?: number, y?: number) {
    this.type = 'vector2d';

    this.name = name || '';
    this.X = x || 0.0;
    this.Y = y || 0.0;
  }
}
