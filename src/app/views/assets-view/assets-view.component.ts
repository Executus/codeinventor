import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviourEditorComponent } from '../../modals/behaviour-editor/behaviour-editor.component';

@Component({
  selector: 'app-assets-view',
  templateUrl: './assets-view.component.html',
  styleUrls: ['./assets-view.component..scss']
})
export class AssetsViewComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  onNewBehaviour(): void {
    let modal: NgbModalRef = this.modalService.open(BehaviourEditorComponent, { windowClass: 'behav-editor-modal' });
    let modalComponent: BehaviourEditorComponent = modal.componentInstance as BehaviourEditorComponent;
    
    modal.result.then(result => {
      
    }, () => {});
  }

}
