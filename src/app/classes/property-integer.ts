import { Property } from './property';

export class PropertyInteger implements Property {
  name: string;
  type: string;

  private value: number;

  constructor() {
    this.type = 'integer';
  }

  public setValue(newValue: number) {
    this.value = Math.floor(newValue);
  }
}
