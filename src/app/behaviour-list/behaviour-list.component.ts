import { Component, OnInit, OnDestroy } from '@angular/core';
import { Behaviour }  from '../classes/behaviour';
import { FILETYPE } from '../classes/file';
import { Object } from '../classes/object';
import { SelectObjectListener, ObjectService }  from '../services/object.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileSelectModalComponent } from '../modals/file-select-modal/file-select-modal.component';
import { PropertyFile } from '../classes/property-file';
import { File } from '../classes/file';
import { HttpService } from '../services/http.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-behaviour-list',
  templateUrl: './behaviour-list.component.html',
  styleUrls: ['./behaviour-list.component..scss']
})
export class BehaviourListComponent implements OnInit, OnDestroy, SelectObjectListener {

  private selectedObject: Object = null;
  private api: string = environment.api;

  constructor(private objectService: ObjectService, private modalService: NgbModal, private httpService: HttpService) {
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

  onRemoveBehaviour(index: number, behaviour: Behaviour): void {
    this.objectService.removeObjectBehaviour(index, behaviour);
  }

  onChooseFile(property: PropertyFile): void {
    let modal: NgbModalRef = this.modalService.open(FileSelectModalComponent);
    let modalComponent: FileSelectModalComponent = modal.componentInstance as FileSelectModalComponent;
    if (modalComponent) {
      modalComponent.setFileType(property.FileType);
    }
    modal.result.then((result: File) => {
      if (result) {
        property.Value = result.id;
        property.filename = result.filename;

        let req = {
          PropertyInstance: {
            propertyInstanceId: property.instanceId,
            propertyType: property.type,
            propertyValue: property.Value
          }
        }
    
        this.httpService.Put('/behaviours/instance', req).subscribe(res => {
    
        });
      }
    }, () => {});
  }

  onPropertyBlur(behaviour, property): void {
    let req = {
      PropertyInstance: {
        propertyInstanceId: property.instanceId,
        propertyType: property.type,
        propertyValue: property.Value
      }
    }

    this.httpService.Put('/behaviours/instance', req).subscribe(res => {

    });
  }
}
