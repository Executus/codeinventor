import { Component, OnInit, OnDestroy } from '@angular/core';
import { Behaviour }  from '../classes/behaviour';
import { Object } from '../classes/object';
import { SelectObjectListener, ObjectService }  from '../services/object.service';

@Component({
  selector: 'app-behaviour-list',
  templateUrl: './behaviour-list.component.html',
  styleUrls: ['./behaviour-list.component..scss']
})
export class BehaviourListComponent implements OnInit, OnDestroy, SelectObjectListener {

  private selectedObject: Object = null;

  constructor(private objectService: ObjectService) {
    this.objectService.registerSelectObjectListener(this);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.objectService.unregisterSelectObjectListener(this);
  }

  onObjectSelected(object: Object): void {
    this.selectedObject = object;
  }

  onRemoveBehaviour(index: number): void {
    this.objectService.removeObjectBehaviour(index);
  }
}
