import { Injectable } from '@angular/core';
import { Behaviour } from '../classes/behaviour';
import { Object } from '../classes/object';
import { RuntimeService } from '../runtime/runtime.service';
import { HttpService } from './http.service';
import { ScriptService } from './script.service';
import { environment } from '../../environments/environment';

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

  public registerBehaviourDef(behaviourDef: BehaviourDef, reloadScript?: boolean) {
    if (!this.behaviourDefinitions.map(function(def: BehaviourDef) {
      return def.name;
    }).includes(behaviourDef.name)) {
      this.behaviourDefinitions.push(behaviourDef);

      this.scriptService.loadScript(behaviourDef.name, environment.api + '/files/' + behaviourDef.filename + '.js', false).then((result) => {
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
    return this.behaviourDefinitions.sort((a, b): number => {
      if (a.id < b.id) {
        return -1;
      } else if (a.id > b.id) {
        return 1;
      }
      return 0;
    });
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
