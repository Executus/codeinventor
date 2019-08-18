import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviourEditorComponent } from '../../modals/behaviour-editor/behaviour-editor.component';
import { NewBehaviourNameModalComponent } from '../../modals/new-behaviour-name-modal/new-behaviour-name-modal.component';
import { BehaviourService, BehaviourDef } from '../../services/behaviour.service';
import { HttpService } from '../../services/http.service';
import { DeleteBehaviourModalComponent } from '../../modals/delete-behaviour-modal/delete-behaviour-modal.component';

@Component({
  selector: 'app-assets-view',
  templateUrl: './assets-view.component.html',
  styleUrls: ['./assets-view.component..scss']
})
export class AssetsViewComponent implements OnInit {

  constructor(private modalService: NgbModal, private behaviourService: BehaviourService, private httpService: HttpService) { }

  ngOnInit() {
  }

  private openBehaviourEditor(name: string, existingCode?: string): Promise<any> {
    let modal: NgbModalRef = this.modalService.open(BehaviourEditorComponent, { windowClass: 'behav-editor-modal' });
    let modalComponent: BehaviourEditorComponent = modal.componentInstance as BehaviourEditorComponent;
    modalComponent.init(name, existingCode);
    return modal.result;
  }

  onNewBehaviour(): void {
    let modal: NgbModalRef = this.modalService.open(NewBehaviourNameModalComponent, {});
    let modalComponent: NewBehaviourNameModalComponent = modal.componentInstance as NewBehaviourNameModalComponent;
    
    modal.result.then(name => {
      let behaviourName = name;
      this.openBehaviourEditor(name).then(result => {
        let behaviour: BehaviourDef = {
          id: -1,
          script: result.data,
          name: behaviourName,
          isSystemBehaviour: false,
          filename: '',
          properties: []
        };
  
        this.httpService.Post('/behaviours', { BehaviourDef: behaviour }).subscribe(res => {
          if (res.BehaviourDef.id > -1) {
            this.behaviourService.registerBehaviourDef(res.BehaviourDef);
          }
        });
      }, () => {});
    }, () => {});
  }

  onViewBehaviour(behaviour: BehaviourDef): void {
    this.openBehaviourEditor(behaviour.name, behaviour.script);
  }

  onEditBehaviour(behaviour: BehaviourDef): void {
    this.openBehaviourEditor(behaviour.name, behaviour.script).then(result => {
      behaviour.script = result.data;
      this.httpService.Put('/behaviours', { BehaviourDef: behaviour }).subscribe(res => {
        
      });
    }, () => {});
  }

  onDeleteBehaviour(behaviour: BehaviourDef): void {
    // Display modal to warn user of delete
    let modal: NgbModalRef = this.modalService.open(DeleteBehaviourModalComponent);
    let modalComponent: DeleteBehaviourModalComponent = modal.componentInstance as DeleteBehaviourModalComponent;
    if (modalComponent) {
      modalComponent.setBehaviourName(behaviour.name);
    }
    modal.result.then(result => {
      if (result === 'delete') {
        // Perform the delete
        this.httpService.Delete('/behaviours/' + behaviour.id).subscribe(res => {
          if (res.result === 'success') {
            this.behaviourService.unregisterBehaviourDef(behaviour);
          }
        });
      }
    });
  }

}
