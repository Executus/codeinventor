import { Component, OnInit } from '@angular/core';
import { Object } from '../classes/object';
import { ObjectService } from '../services/object.service';

@Component({
  selector: 'app-object-tree',
  templateUrl: './object-tree.component.html',
  styleUrls: ['./object-tree.component..scss']
})
export class ObjectTreeComponent implements OnInit {

  private treeData: Object[] = [];

  constructor(private objectService: ObjectService) {
    this.objectService.registerObjectTree(this);
  }

  ngOnInit() {
  }

  public createNewEmptyObject(): void {
    let obj: Object = new Object();
    this.treeData.push(obj);
  }
}
