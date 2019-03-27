import { Injectable } from '@angular/core';
import { ObjectTreeComponent }  from '../object-tree/object-tree.component';
import { Object }  from '../classes/object';

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
}
