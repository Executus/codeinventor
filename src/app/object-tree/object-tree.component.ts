import { Component, OnInit, OnDestroy } from '@angular/core';
import { Object } from '../classes/object';
import { ObjectService } from '../services/object.service';
import { HttpService } from '../services/http.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteObjectModalComponent } from '../modals/delete-object-modal/delete-object-modal.component';
import { BehaviourService } from '../services/behaviour.service';

@Component({
  selector: 'app-object-tree',
  templateUrl: './object-tree.component.html',
  styleUrls: ['./object-tree.component..scss']
})
export class ObjectTreeComponent implements OnInit, OnDestroy {

  private treeData: Object[] = [];
  private selectedObject: Object = null;

  constructor(private objectService: ObjectService, private httpService: HttpService, private modalService: NgbModal,
              private behaviourService: BehaviourService) {
    this.objectService.registerObjectTree(this);
  }

  ngOnInit() {
    this.httpService.Get('/objects').subscribe(res => {
      this.treeData = this.buildObjects(res.Objects);
    });
  }

  ngOnDestroy() {
    this.objectService.unregisterObjectTree(this);
  }

  public createNewEmptyObject(parent: Object): void {
    let obj: Object = new Object(this.behaviourService);

    if (parent === null) {
      this.treeData.push(obj);
    } else {
      parent.addChild(obj);
      parent.setExpanded(true);
    }

    this.selectedObject = obj;
    this.objectService.setSelectedObject(this.selectedObject);

    var req = {
      Object: obj.jsonSerialise()
    }

    this.httpService.Post('/objects', req).subscribe(res => {
      obj.setData(res.Object.id, res.Object.name, res.Object.nestedLevel);
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
    $event.stopPropagation();

    // Display modal to warn user of recursive delete
    let modal: NgbModalRef = this.modalService.open(DeleteObjectModalComponent);
    let modalComponent: DeleteObjectModalComponent = modal.componentInstance as DeleteObjectModalComponent;
    if (modalComponent) {
      modalComponent.setObjectName(object.getName());
    }
    modal.result.then(result => {
      if (result === 'delete') {
        // Perform the delete
        this.httpService.Delete('/objects/' + object.getId()).subscribe(res => {
          this.selectedObject = null;
          this.objectService.setSelectedObject(this.selectedObject);
          // Get Objects to get the correct state of the tree
          this.httpService.Get('/objects').subscribe(res => {
            this.treeData = this.buildObjects(res.Objects);
          });
        });
      }
    });
  }

  private editName(object: Object, $event): void {
    object.setEditing(true);
    $event.stopPropagation();
  }

  private onEditNameBlur(object: Object): void {
    object.setEditing(false);

    let req = {
      Object: object.jsonSerialise()
    };

    this.httpService.Put('/objects', req).subscribe(result => {});
  }

  private buildObjects(objects: any[]): Object[] {
    let ret = [];

    for (let i = 0; i < objects.length; i++) {
      let obj = new Object(this.behaviourService);
      obj.setData(objects[i].id, objects[i].name, objects[i].nestedLevel);

      let children: Object[] = this.buildObjects(objects[i].children);
      for (let j = 0; j < children.length; j++) {
        obj.addChild(children[j]);
      }

      ret.push(obj);
    }

    return ret;
  }

  public getObjectTreeData(): Object[] {
    return this.treeData;
  }
}
