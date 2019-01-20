import { Component, OnInit } from '@angular/core';
import { Object } from '../classes/object';
import { ObjectService } from '../services/object.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-object-tree',
  templateUrl: './object-tree.component.html',
  styleUrls: ['./object-tree.component..scss']
})
export class ObjectTreeComponent implements OnInit {

  private treeData: Object[] = [];
  private selectedObject: Object = null;

  constructor(private objectService: ObjectService, private httpService: HttpService) {
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
      parent.setExpanded(true);
    }

    var req = {
      Object: obj
    }
    
    this.httpService.Post('/objects', req).subscribe(res => {
      obj = res.Object;
    });
  }

  private onSelectObject(object: Object): void {
    if (this.selectedObject === object) {
      this.selectedObject = null;
    } else {
      this.selectedObject = object;
    }

    this.objectService.setSelectedObject(this.selectedObject);
  }

  private onExpandObject(object: Object, $event): void {
    object.toggleExpanded();
    $event.stopPropagation();
  }

  private removeObject(object: Object, $event): void {
    if (object === this.selectedObject) {
      this.selectedObject = null;
    }

    let parent = object.getParent();
    if (parent === null) {
      let idx = this.treeData.indexOf(object);
      if (idx > -1) {
        this.treeData.splice(idx, 1);
      }
    } else {
      parent.removeChild(object);
    }

    $event.stopPropagation();
  }

  private editName(object: Object, $event): void {
    object.toggleEditing();
    $event.stopPropagation();
  }
}