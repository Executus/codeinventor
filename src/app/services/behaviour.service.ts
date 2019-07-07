import { Injectable } from '@angular/core';
import { Behaviour } from '../classes/behaviour';
import { Object } from '../classes/object';
import { RuntimeService } from '../runtime/runtime.service';
import { HttpService } from './http.service';

import * as BehaviourTransform from '../classes/behaviour-transform';
import * as BehaviourSprite from '../classes/behaviour-sprite';

export interface BehaviourDef {
  id: number;
  script: string;
  name: string;
  isSystemBehaviour: boolean
}

@Injectable({
  providedIn: 'root'
})
export class BehaviourService {

  private behaviourDefinitions: BehaviourDef[] = [];

  constructor(private runtimeService: RuntimeService, private httpService: HttpService) {
    this.httpService.Get('/behaviours').subscribe(res => {
      if (res.BehaviourDefs) {
        for (let i = 0; i < res.BehaviourDefs.length; i++) {
          let id = res.BehaviourDefs[i].id;
          let script = res.BehaviourDefs[i].script;
          let name = res.BehaviourDefs[i].name;
          let isSystem = res.BehaviourDefs[i].isSystemBehaviour;
          this.registerBehaviourDef(id, script, name, isSystem);
        }
      }
    });
  }

  public registerBehaviourDef(behaviourDefId: number, script: string, name: string, isSystemBehaviour: boolean) {
    if (!this.behaviourDefinitions.map(function(def: BehaviourDef) {
      return def.id;
    }).includes(behaviourDefId)) {
      this.behaviourDefinitions.push({
        id: behaviourDefId,
        script: script,
        name: name,
        isSystemBehaviour: isSystemBehaviour
      });
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

    switch (behaviourDef) {
      case 'Transform':
        return new BehaviourTransform(object);
      break;
      case 'Sprite':
        return new BehaviourSprite(object, this.runtimeService);
      break;
    }

    return null;
  }
}
