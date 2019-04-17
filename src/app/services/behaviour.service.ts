import { Injectable } from '@angular/core';
import { Behaviour } from '../classes/behaviour';
import { BehaviourTransform } from '../classes/behaviour-transform';
import { BehaviourSprite } from '../classes/behaviour-sprite';
import { Object } from '../classes/object';

@Injectable({
  providedIn: 'root'
})
export class BehaviourService {

  private behaviourDefinitions: string[] = [];

  constructor() {
    // Built in behaviours defined here
    this.behaviourDefinitions.push('Transform');
    this.behaviourDefinitions.push('Sprite');
  }

  public registerBehaviourDef(behaviourDef: string) {
    if (!this.behaviourDefinitions.includes(behaviourDef)) {
      this.behaviourDefinitions.push(behaviourDef);
    }
  }

  public getBehaviourDefs(): string[] {
    return this.behaviourDefinitions;
  }

  public createBehaviour(behaviourDef: string, object: Object): Behaviour {
    if (!this.behaviourDefinitions.includes(behaviourDef)) {
      return null;
    }

    switch (behaviourDef) {
      case 'Transform':
        return new BehaviourTransform(object);
      break;
      case 'Sprite':
        return new BehaviourSprite(object);
      break;
    }

    return null;
  }
}
