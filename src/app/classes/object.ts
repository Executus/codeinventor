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

  public addChild(child: Object) {
    child.parent = this;
    this.children.push(child);
  }
}
