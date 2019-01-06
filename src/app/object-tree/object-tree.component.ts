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
  private selectedObject: Object = null;

  constructor(private objectService: ObjectService) {
    this.objectService.registerObjectTree(this);
  }

  ngOnInit() {
  }

  public createNewEmptyObject(parent: Object): void {
    let obj: Object = new Object();

    if (parent === null) {
      this.treeData.push(obj);
    } else {
      parent.addChild(obj);
    }
  }

  private onSelectObject(object: Object): void {
    if (this.selectedObject === object) {
      this.selectedObject = null;
    } else {
      this.selectedObject = object;
    }

    this.objectService.setSelectedObject(this.selectedObject);
  }
}
