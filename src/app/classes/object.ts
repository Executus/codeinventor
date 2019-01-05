export class Object {

  private name: string = '';
  private parent: Object = null;
  private children: Object[] = [];

  constructor() {
    this.name = 'New Object';
  }

  public getName(): string {
    return this.name;
  }

}
