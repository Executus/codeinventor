export class Object {

  private name: string = '';
  private parent: Object = null;
  private children: Object[] = [];
  private nestedLevel: number = 1;
  private expanded: boolean = false;
  private editing: boolean = false;

  constructor() {
    this.name = 'New Object';
  }

  public getName(): string {
    return this.name;
  }

  public addChild(child: Object): void {
    child.parent = this;
    child.nestedLevel = this.nestedLevel + 1;
    this.children.push(child);
  }

  public removeChild(child: Object): void {
    let idx = this.children.indexOf(child);
    if (idx > -1) {
      this.children.splice(idx, 1);
    }
  }

  public toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  public setExpanded(expand: boolean): void {
    this.expanded = expand;
  }

  public getParent(): Object {
    return this.parent;
  }

  public toggleEditing(): void {
    this.editing = !this.editing;
  }
}
