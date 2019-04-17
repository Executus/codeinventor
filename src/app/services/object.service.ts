import { Injectable } from '@angular/core';
import { ObjectTreeComponent }  from '../object-tree/object-tree.component';
import { Object }  from '../classes/object';
import { Behaviour } from '../classes/behaviour';

export interface BehavioursChangedListener {
  onObjectBehavioursChanged(behaviours: Behaviour[]): void;
}

export interface SelectObjectListener {
  onObjectSelected(object: Object): void;
}

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  private objectTree: ObjectTreeComponent = null;
  private selectedObject: Object = null;
  private selectObjectListeners: SelectObjectListener[] = [];
  private behavioursChangedListeners: BehavioursChangedListener[] = [];

  constructor() { }

  public registerObjectTree(tree: ObjectTreeComponent): void {
    if (this.objectTree === null) {
      this.objectTree = tree;
    } else {
      console.error('Only one ObjectTreeComponent allowed!');
    }
  }

  public unregisterObjectTree(tree: ObjectTreeComponent): void {
    if (this.objectTree === tree) {
      this.objectTree = null;
    }
  }

  public createNewEmptyObject(): void {
    if (this.objectTree !== null) {
      this.objectTree.createNewEmptyObject(this.selectedObject);
    }
  }

  public setSelectedObject(object: Object): void {
    this.selectedObject = object;
    this.selectObjectListeners.forEach(listener => {
      listener.onObjectSelected(this.selectedObject);
    })
  }

  public getSelectedObject(): Object {
    return this.selectedObject;
  }

  public registerSelectObjectListener(listener: SelectObjectListener) {
    if (this.selectObjectListeners.includes(listener) === false) {
      this.selectObjectListeners.push(listener);
    }
  }

  public unregisterSelectObjectListener(listener: SelectObjectListener) {
    let idx = this.selectObjectListeners.indexOf(listener); 
    if (idx > -1) {
      this.selectObjectListeners.splice(idx, 1);
    }
  }

  public getObjectTreeData(): Object[] {
    if (this.objectTree) {
      return this.objectTree.getObjectTreeData();
    }
    return null;
  }

  public registerBehavioursChangedListener(listener: BehavioursChangedListener) {
    if (this.behavioursChangedListeners.includes(listener) === false) {
      this.behavioursChangedListeners.push(listener);
    }
  }

  public unregisterBehavioursChangedListener(listener: BehavioursChangedListener) {
    let idx = this.behavioursChangedListeners.indexOf(listener); 
    if (idx > -1) {
      this.behavioursChangedListeners.splice(idx, 1);
    }
  }

  public removeObjectBehaviour(index: number): void {
    if (this.selectedObject) {
      this.selectedObject.removeBehaviour(index);
      this.behavioursChangedListeners.forEach(listener => {
        listener.onObjectBehavioursChanged(this.selectedObject.getBehaviours());
      });
    }
  }

  public addObjectBehaviour(behaviourDef: string): void {
    if (this.selectedObject) {
      this.selectedObject.addBehaviour(behaviourDef);
      this.behavioursChangedListeners.forEach(listener => {
        listener.onObjectBehavioursChanged(this.selectedObject.getBehaviours());
      });
    }
  }
}
