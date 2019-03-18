import { Property } from './property';

export interface Behaviour {
  name: string;
  properties: Property[];

  update(): void;
  draw(): void;
}
