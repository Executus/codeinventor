import { Property } from './property';

export class PropertyString implements Property {
  name: string;
  type: string;
  innerProperties: Property[];
}
