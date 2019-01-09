export class Object {

  private name: string = '';
  private parent: Object = null;
  private children: Object[] = [];
  private nestedLevel: number = 1;

  constructor() {
    this.name = 'New Object';
  }

  public getName(): string {
    return this.name;
  }

  public addChild(child: Object) {
    child.parent = this;
    child.nestedLevel = this.nestedLevel + 1;
    this.children.push(child);
  }
}
