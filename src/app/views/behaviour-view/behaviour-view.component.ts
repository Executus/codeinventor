import { Component, OnInit } from '@angular/core';
import { ObjectService } from '../../services/object.service';

@Component({
  selector: 'app-behaviour-view',
  templateUrl: './behaviour-view.component.html',
  styleUrls: ['./behaviour-view.component..scss']
})
export class BehaviourViewComponent implements OnInit {

  behaviours = ['Sprite', 'Transform'];
  private showAddBehaviourList: boolean = false;

  constructor(private objectService: ObjectService) { }

  ngOnInit() {
  }

  private onAddBehaviour(): void {
    this.showAddBehaviourList = !this.showAddBehaviourList;
  }
}
