import { Injectable } from '@angular/core';
import { ObjectTreeComponent }  from '../object-tree/object-tree.component';
import { Object }  from '../classes/object';
import { Behaviour } from '../classes/behaviour';
import { BehaviourDef } from '../services/behaviour.service';
import { HttpService } from './http.service';

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

  constructor(private httpService: HttpService) { }

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

    if (object && object.upToDate === false) {
      this.httpService.Get('/behaviours/instance/' + object.getId()).subscribe(res => {
        res.BehaviourInstances.forEach(behaviourInstance => {
          let behaviour: Behaviour = object.addBehaviour(behaviourInstance.name);
          behaviour.instanceId = behaviourInstance.instanceId;
          behaviourInstance.propertyInstances.forEach(propertyInstance => {
            behaviour.properties.forEach(property => {
              if (property.name === propertyInstance.propertyName) {
                property.instanceId = propertyInstance.propertyInstanceId;
                switch (propertyInstance.propertyType) {
                  case 'PropertyFloat':
                  property.Value = propertyInstance.propertyValue;
                  break;
                }
              }
            });
          });
        });

        object.upToDate = true;
        
        this.selectObjectListeners.forEach(listener => {
          listener.onObjectSelected(this.selectedObject);
        });
      });
    } else {
      this.selectObjectListeners.forEach(listener => {
        listener.onObjectSelected(this.selectedObject);
      });
    }
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

  public removeObjectBehaviour(index: number, behaviour: Behaviour): void {
    if (this.selectedObject) {
      let behaviourInstanceId = behaviour.instanceId;
      this.selectedObject.removeBehaviour(index);
      this.httpService.Delete('/behaviours/instance/' + behaviourInstanceId).subscribe(res => {
        this.behavioursChangedListeners.forEach(listener => {
          listener.onObjectBehavioursChanged(this.selectedObject.getBehaviours());
        });
      });
    }
  }

  public addObjectBehaviour(behaviourDef: BehaviourDef): void {
    if (this.selectedObject) {
      let newBehaviour: Behaviour = this.selectedObject.addBehaviour(behaviourDef.name);
      if (newBehaviour) {
        let propertyInstances = {};
        newBehaviour.properties.forEach(prop => {
          propertyInstances[prop.name] = prop;
          behaviourDef.properties.forEach(propDef => {
            if (propDef.propertyName === prop.name) {
              propertyInstances[prop.name].propertyDefId = propDef.propertyDefId;
            }
          });
        });

        let req = {
          BehaviourInstance: {
            objectId: this.selectedObject.getId(),
            behaviourDefId: behaviourDef.id,
            properties: propertyInstances
          }
        }

        this.httpService.Post('/behaviours/instance', req).subscribe(res => {
          newBehaviour.instanceId = res.BehaviourInstance.instanceId;
          res.BehaviourInstance.propertyInstances.forEach(propInstance => {
            newBehaviour.properties.forEach(prop => {
              if (propInstance.propertyDefinitionId === prop.propertyDefId) {
                prop.instanceId = propInstance.propertyInstanceId;
              }
            });
          });
        });
      }
      this.behavioursChangedListeners.forEach(listener => {
        listener.onObjectBehavioursChanged(this.selectedObject.getBehaviours());
      });
    }
  }
}
