import { Property } from './property';

export class PropertyFloat implements Property {
  name: string;
  type: string;

  private value: number;

  constructor() {
    this.type = 'float';
  }

  public setValue(newValue: number) {
    this.value = newValue;
  }
}
