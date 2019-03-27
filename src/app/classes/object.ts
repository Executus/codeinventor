import { Behaviour } from './behaviour';
import { BehaviourTransform } from './behaviour-transform';

export class Object {

  private id: number = -1;
  private name: string = '';
  private parent: Object = null;
  private children: Object[] = [];
  private nestedLevel: number = 1;
  private expanded: boolean = false;
  private editing: boolean = false;
  private behaviours: Behaviour[] = [];

  constructor() {
    this.name = 'New Object';
    this.behaviours.push(new BehaviourTransform(this));
  }

  public update(): void {
    for (let i = 0; i < this.behaviours.length; i++) {
      this.behaviours[i].update();
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].update();
    }
  }

  public draw(): void {
    for (let i = 0; i < this.behaviours.length; i++) {
      this.behaviours[i].draw();
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].draw();
    }
  }

  public getId(): number {
    return this.id;
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

  public getBehaviours(): Behaviour[] {
    return this.behaviours;
  }

  public getBehaviour<T extends Behaviour>(typename: string): T {
    for (let i = 0; i < this.behaviours.length; i++) {
      if (this.behaviours[i].constructor['name'] === typename) {
        return <T>this.behaviours[i];
      }
    }
    return null;
  }
}
