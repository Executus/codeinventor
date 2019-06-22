import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviourEditorComponent } from '../../modals/behaviour-editor/behaviour-editor.component';
import { NewBehaviourNameModalComponent } from '../../modals/new-behaviour-name-modal/new-behaviour-name-modal.component';

import * as ts from 'typescript';

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
    let modal: NgbModalRef = this.modalService.open(NewBehaviourNameModalComponent, {});
    let modalComponent: NewBehaviourNameModalComponent = modal.componentInstance as NewBehaviourNameModalComponent;
    
    modal.result.then(behaviourName => {
      let modal: NgbModalRef = this.modalService.open(BehaviourEditorComponent, { windowClass: 'behav-editor-modal' });
      let modalComponent: BehaviourEditorComponent = modal.componentInstance as BehaviourEditorComponent;
      modalComponent.init(behaviourName);
      
      modal.result.then(result => {
        console.log(result.data);
        let compilerOptions = { module: ts.ModuleKind.System };
        let js = ts.transpileModule(result.data, {
          compilerOptions: compilerOptions,
          moduleName: 'myJavascriptModule'
        });
        console.log(js.outputText);
      }, () => {});
    }, () => {});
  }

}
