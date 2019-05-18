import { Component, OnInit, OnDestroy } from '@angular/core';
import { Behaviour }  from '../classes/behaviour';
import { FILETYPE } from '../classes/property-file';
import { Object } from '../classes/object';
import { SelectObjectListener, ObjectService }  from '../services/object.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileSelectModalComponent } from '../modals/file-select-modal/file-select-modal.component';

@Component({
  selector: 'app-behaviour-list',
  templateUrl: './behaviour-list.component.html',
  styleUrls: ['./behaviour-list.component..scss']
})
export class BehaviourListComponent implements OnInit, OnDestroy, SelectObjectListener {

  private selectedObject: Object = null;

  constructor(private objectService: ObjectService, private modalService: NgbModal) {
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

  onChooseFile(filetype: FILETYPE): void {
    let modal: NgbModalRef = this.modalService.open(FileSelectModalComponent);
    let modalComponent: FileSelectModalComponent = modal.componentInstance as FileSelectModalComponent;
    if (modalComponent) {
      modalComponent.setFileType(filetype);
    }
    modal.result.then(result => {
      
    });
  }
}
