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
    this.properties.push(position);

    let scale = new PropertyVector2d();
    scale.name = 'Scale';
    this.properties.push(scale);

    let rot = new PropertyFloat();
    rot.name = 'Rotation';
    this.properties.push(rot);
  }

}
