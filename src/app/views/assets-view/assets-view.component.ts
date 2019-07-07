import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviourEditorComponent } from '../../modals/behaviour-editor/behaviour-editor.component';
import { NewBehaviourNameModalComponent } from '../../modals/new-behaviour-name-modal/new-behaviour-name-modal.component';
import { BehaviourService, BehaviourDef } from '../../services/behaviour.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-assets-view',
  templateUrl: './assets-view.component.html',
  styleUrls: ['./assets-view.component..scss']
})
export class AssetsViewComponent implements OnInit {

  constructor(private modalService: NgbModal, private behaviourService: BehaviourService, private httpService: HttpService) { }

  ngOnInit() {
  }

  onNewBehaviour(): void {
    let modal: NgbModalRef = this.modalService.open(NewBehaviourNameModalComponent, {});
    let modalComponent: NewBehaviourNameModalComponent = modal.componentInstance as NewBehaviourNameModalComponent;
    
    modal.result.then(name => {
      let behaviourName = name;
      let modal: NgbModalRef = this.modalService.open(BehaviourEditorComponent, { windowClass: 'behav-editor-modal' });
      let modalComponent: BehaviourEditorComponent = modal.componentInstance as BehaviourEditorComponent;
      modalComponent.init(behaviourName);
      
      modal.result.then(result => {
        let behaviour: BehaviourDef = {
          id: -1,
          script: result.data,
          name: behaviourName,
          isSystemBehaviour: false
        };

        this.httpService.Post('/behaviours', { BehaviourDef: behaviour }).subscribe(res => {
          if (res.BehaviourDefId > -1) {
            this.behaviourService.registerBehaviourDef(res.BehaviourDefId, behaviour.script, behaviour.name, behaviour.isSystemBehaviour);
          }
        });
      }, () => {});
    }, () => {});
  }

  onViewBehaviour(behaviour): void {

  }

}
