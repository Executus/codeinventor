import { Property } from './property';

export class PropertyFloat implements Property {
  name: string;
  type: string;

  public Value: number;

  constructor(name?: string, value?: number) {
    this.type = 'float';

    this.name = name || '';
    this.Value = value || 0.0;
  }
}
