import { Property } from './property';
import { Object } from './object';

export interface Behaviour {
  name: string;
  properties: Property[];
  attachedObject: Object;

  update(): void;
  draw(): void;
  getAttachedObject(): Object;
}
