import { Component, OnInit } from '@angular/core';
import { ObjectService, SelectObjectListener, BehavioursChangedListener } from '../../services/object.service';
import { BehaviourService, BehaviourDef } from '../../services/behaviour.service'
import { Object } from '../../classes/object';
import { Behaviour } from '../../classes/behaviour';

@Component({
  selector: 'app-behaviour-view',
  templateUrl: './behaviour-view.component.html',
  styleUrls: ['./behaviour-view.component..scss']
})
export class BehaviourViewComponent implements OnInit, SelectObjectListener, BehavioursChangedListener {

  private behavioursToAdd: BehaviourDef[] = [];
  private showAddBehaviourList: boolean = false;
  private selectedObject: Object = null;

  constructor(private objectService: ObjectService, private behaviourService: BehaviourService) { }

  ngOnInit() {
    this.objectService.registerSelectObjectListener(this);
    this.objectService.registerBehavioursChangedListener(this);
  }

  ngOnDestroy() {
    this.objectService.unregisterSelectObjectListener(this);
    this.objectService.unregisterBehavioursChangedListener(this);
  }

  private onAddBehaviour(): void {
    this.showAddBehaviourList = !this.showAddBehaviourList;
  }

  private onChooseBehaviour(behaviourDef: BehaviourDef): void {
    this.objectService.addObjectBehaviour(behaviourDef);
    this.showAddBehaviourList = false;
  }

  private updateBehavioursBtn(behaviours: Behaviour[]) {
    const objectBehaviours: string[] = behaviours.map(behaviour => {
      return behaviour.name;
    });

    this.behavioursToAdd = this.behaviourService.getBehaviourDefs().filter(behaviourDef => {
      return !objectBehaviours.includes(behaviourDef.name);
    });
  }

  onObjectSelected(object: Object): void {
    this.selectedObject = object;
    if (this.selectedObject) {
      this.updateBehavioursBtn(this.selectedObject.getBehaviours());
    }
  }

  onObjectBehavioursChanged(behaviours: Behaviour[]): void {
    this.updateBehavioursBtn(behaviours);
  }
}
