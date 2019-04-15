import { Injectable } from '@angular/core';
import { Behaviour } from '../classes/behaviour';

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
}
