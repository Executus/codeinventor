export class Object {

  private id: number = -1;
  private name: string = '';
  private parent: Object = null;
  private children: Object[] = [];
  private nestedLevel: number = 1;
  private expanded: boolean = false;
  private editing: boolean = false;

  constructor() {
    this.name = 'New Object';
  }

  public setData(id, name, nestedLevel): void {
    this.id = id;
    this.name = name;
    this.nestedLevel = nestedLevel;
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

  public setEditing(editing): void {
    this.editing = editing;
  }

  public jsonSerialise(): any {
    let json: any = {
      id: this.id,
      name: this.name,
      nestedLevel: this.nestedLevel,
      parent: (this.parent) ? this.parent.id : null,
      children:[]
    };

    for (let i = 0; i < this.children.length; i++) {
      json.children.push(this.children[i].id);
    }

    return json;
  }
}
