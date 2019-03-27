import { Behaviour } from './behaviour';
import { Property } from './property';
import { Object } from './object';

export class BehaviourSprite implements Behaviour {
  name: string;
  properties: Property[];
  attachedObject: Object;

  constructor(owner: Object) {
    this.name = 'Sprite';
    this.properties = [];
    this.attachedObject = owner;
  }

  update(): void {
    
  }

  draw(): void {
    
  }

  getAttachedObject(): Object {
    return this.attachedObject;
  }
}
