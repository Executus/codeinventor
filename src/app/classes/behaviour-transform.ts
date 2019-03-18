import { Behaviour } from './behaviour';
import { Property } from './property';
import { PropertyVector2d } from './property-vector2d';
import { PropertyFloat } from './property-float';

export class BehaviourTransform implements Behaviour {
  name: string;
  properties: Property[];

  constructor() {
    this.name = 'Transform';
    this.properties = [];

    let position = new PropertyVector2d();
    position.name = 'Position';
    position.setXValue(0.0);
    position.setYValue(0.0);
    this.properties.push(position);

    let scale = new PropertyVector2d();
    scale.name = 'Scale';
    scale.setXValue(1.0);
    scale.setYValue(1.0);
    this.properties.push(scale);

    let rot = new PropertyFloat();
    rot.name = 'Rotation';
    rot.setValue(0.0);
    this.properties.push(rot);
  }

  update(): void {

  }

  draw(): void {
    
  }

}
