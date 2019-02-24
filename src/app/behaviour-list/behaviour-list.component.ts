import { Component, OnInit } from '@angular/core';
import { Behaviour }  from '../classes/behaviour';
import { Object } from '../classes/object';
import { SelectObjectListener, ObjectService }  from '../services/object.service';

@Component({
  selector: 'app-behaviour-list',
  templateUrl: './behaviour-list.component.html',
  styleUrls: ['./behaviour-list.component..scss']
})
export class BehaviourListComponent implements OnInit, SelectObjectListener {

  private behaviours: Behaviour[];

  constructor(private objectService: ObjectService) {
    this.objectService.registerSelectObjectListener(this);
  }

  ngOnInit() {
  }

  onObjectSelected(object: Object): void {
    if (object) {
      this.behaviours = object.getBehaviours();
    }
  }

}
