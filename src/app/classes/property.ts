export interface Property {
  name: string;
  type: string;
  innerProperties: Property[];
}
