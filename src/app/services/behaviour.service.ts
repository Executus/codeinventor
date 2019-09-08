import { Injectable } from '@angular/core';
import { Behaviour } from '../classes/behaviour';
import { Object } from '../classes/object';
import { RuntimeService } from '../runtime/runtime.service';
import { HttpService } from './http.service';
import { ScriptService } from './script.service';

export interface PropertyDef {
  propertyDefId: number,
  propertyName: string,
  propertyType: number
}

export interface BehaviourDef {
  id: number;
  script: string;
  name: string;
  isSystemBehaviour: boolean,
  filename: string,
  properties: PropertyDef[]
}

@Injectable({
  providedIn: 'root'
})
export class BehaviourService {

  private behaviourDefinitions: BehaviourDef[] = [];
  private behaviourFactory = {};

  constructor(private runtimeService: RuntimeService, private httpService: HttpService, private scriptService: ScriptService) {}

  public init(): void {
    this.httpService.Get('/behaviours').subscribe(res => {
      if (res.BehaviourDefs) {
        for (let i = 0; i < res.BehaviourDefs.length; i++) {
          this.registerBehaviourDef(res.BehaviourDefs[i]);
        }
      }
    });
  }

  public registerBehaviourDef(behaviourDef: BehaviourDef) {
    if (!this.behaviourDefinitions.map(function(def: BehaviourDef) {
      return def.name;
    }).includes(behaviourDef.name)) {
      this.behaviourDefinitions.push(behaviourDef);

      this.scriptService.loadScript(behaviourDef.name, 'http://localhost:3000/files/' + behaviourDef.filename + '.js').then((result) => {
        this.behaviourFactory[behaviourDef.name] = result;
      }, (reason) => {
        console.log('Failed to load script: ' + reason);
      });
    }
  }

  public unregisterBehaviourDef(behaviourDef: BehaviourDef) {
    for (let i = 0; i < this.behaviourDefinitions.length; i++) {
      if (behaviourDef.id === this.behaviourDefinitions[i].id) {
        this.behaviourDefinitions.splice(i, 1);
        break;
      }
    }
  }

  public getBehaviourDefs(): BehaviourDef[] {
    return this.behaviourDefinitions;
  }

  public createBehaviour(behaviourDef: string, object: Object): Behaviour {
    if (!this.behaviourDefinitions.map(function(def: BehaviourDef) {
      return def.name;
    }).includes(behaviourDef)) {
      return null;
    }

    try {
      return eval('new Behaviour' + behaviourDef + '(object)');
    } catch(e) {
      console.log(e);
    }

    return null;
  }
}
