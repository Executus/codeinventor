import { Behaviour } from './behaviour';
import { BehaviourService } from '../services/behaviour.service';
import { RuntimeService } from '../runtime/runtime.service';
import { ObjectService } from '../services/object.service';

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

  public init(runtimeService: RuntimeService, objectService: ObjectService): void {
    for (let i = 0; i < this.behaviours.length; i++) {
      this.behaviours[i].init(runtimeService);
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].init(runtimeService, objectService);
    }
  }

  public update(deltaTime, runtimeService: RuntimeService): void {
    for (let i = 0; i < this.behaviours.length; i++) {
      this.behaviours[i].update(deltaTime, runtimeService);
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].update(deltaTime, runtimeService);
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

  public onKeyDown(key) {
    for (let i = 0; i < this.behaviours.length; i++) {
      this.behaviours[i].onKeyDown(key);
    }
  }

  public onKeyUp(key) {
    for (let i = 0; i < this.behaviours.length; i++) {
      this.behaviours[i].onKeyUp(key);
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
    return this.behaviours.sort((a: Behaviour, b: Behaviour) => {
      if (a.instanceId < b.instanceId) {
        return -1;
      } else if (a.instanceId > b.instanceId) {
        return 1;
      }
      return 0;
    });
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

  public getEditing(): boolean {
    return this.editing;
  }

  public getChildren(): Object[] {
    return this.children;
  }

  public getExpanded(): boolean {
    return this.expanded;
  }

  public clearBehaviours(): void {
    this.behaviours = [];
  }
}
