import { Behaviour } from './behaviour';
import { BehaviourService } from '../services/behaviour.service';
import { RuntimeService } from '../runtime/runtime.service';

export class Object {

  private id: number = -1;
  private name: string = '';
  private parent: Object = null;
  private children: Object[] = [];
  private nestedLevel: number = 1;
  private expanded: boolean = false;
  private editing: boolean = false;
  private behaviours: Behaviour[] = [];

  public upToDate: boolean = false;

  constructor(private behaviourService: BehaviourService) {
    this.name = 'New Object';
    //this.behaviours.push(new BehaviourTransform(this));
  }

  public init(runtimeService: RuntimeService): void {
    for (let i = 0; i < this.behaviours.length; i++) {
      this.behaviours[i].init(runtimeService);
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].init(runtimeService);
    }
  }

  public update(runtimeService: RuntimeService): void {
    for (let i = 0; i < this.behaviours.length; i++) {
      this.behaviours[i].update(runtimeService);
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].update(runtimeService);
    }
  }

  public draw(runtimeService: RuntimeService): void {
    for (let i = 0; i < this.behaviours.length; i++) {
      this.behaviours[i].draw(runtimeService);
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].draw(runtimeService);
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

  public getBehaviour(typename: string) {
    for (let i = 0; i < this.behaviours.length; i++) {
      if (this.behaviours[i].constructor['name'] === typename) {
        return this.behaviours[i];
      }
    }
    return null;
  }

  public removeBehaviour(index: number): void {
    if (index >= 0 && index < this.behaviours.length) {
      this.behaviours.splice(index, 1);
    }
  }

  public addBehaviour(behaviourDef: string): Behaviour {
    for (let i = 0; i < this.behaviours.length; i++) {
      if (this.behaviours[i].constructor['name'] === behaviourDef) {
        return;
      }
    }

    let newBehaviour = this.behaviourService.createBehaviour(behaviourDef, this);
    if (newBehaviour) {
      this.behaviours.push(newBehaviour);
      return newBehaviour;
    }
    return null;
  }
}
