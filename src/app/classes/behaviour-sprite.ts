import { Behaviour } from './behaviour';
import { Property } from './property';
import { Object } from './object';
import { PropertyVector2d } from './property-vector2d';

export class BehaviourSprite implements Behaviour {
  name: string;
  properties: Property[];
  attachedObject: Object;

  constructor(owner: Object) {
    this.name = 'Sprite';
    this.properties = [];
    this.attachedObject = owner;

    let size = new PropertyVector2d();
    size.name = 'Size';
    size.setXValue(300);
    size.setYValue(300);
    this.properties.push(size);
  }

  update(): void {
    
  }

  draw(): void {
    
  }

  getAttachedObject(): Object {
    return this.attachedObject;
  }
}
