import { Property } from './property';
import { PropertyFloat } from './property-float';

export class PropertyVector2d implements Property {
  name: string;
  type: string;

  private xValue: number;
  private yValue: number;

  constructor() {
    this.type = 'vector2d';
  }

  public setXValue(newX: number) {
    this.xValue = newX;
  };

  public setYValue(newY: number) {
    this.yValue = newY;
  };
}
