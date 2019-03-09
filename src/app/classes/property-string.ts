import { Property } from './property';

export class PropertyString implements Property {
  name: string;
  type: string;

  private value: string;

  constructor() {
    this.type = 'string';
  }

  public setValue(newValue: string) {
    this.value = newValue;
  }
}
