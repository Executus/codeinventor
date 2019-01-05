import { Component, OnInit } from '@angular/core';
import { ObjectService } from '../../services/object.service';

@Component({
  selector: 'app-object-view',
  templateUrl: './object-view.component.html',
  styleUrls: ['./object-view.component..scss']
})
export class ObjectViewComponent implements OnInit {

  constructor(private objectService: ObjectService) { }

  ngOnInit() {
  }

  onNewEmptyObject(): void {
    this.objectService.createNewEmptyObject();
  }

  onNewObjectFromClass(): void {
    
  }
}
