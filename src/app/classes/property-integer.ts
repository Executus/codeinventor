import { Property } from './property';

export class PropertyInteger implements Property {
  name: string;
  type: string;
  innerProperties: Property[];
}
