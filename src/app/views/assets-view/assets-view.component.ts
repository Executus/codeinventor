import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviourEditorComponent } from '../../modals/behaviour-editor/behaviour-editor.component';
import { NewBehaviourNameModalComponent } from '../../modals/new-behaviour-name-modal/new-behaviour-name-modal.component';
import { BehaviourService, BehaviourDef } from '../../services/behaviour.service';
import { HttpService } from '../../services/http.service';
import { DeleteBehaviourModalComponent } from '../../modals/delete-behaviour-modal/delete-behaviour-modal.component';
import { FILETYPE } from '../../classes/file';

@Component({
  selector: 'app-assets-view',
  templateUrl: './assets-view.component.html',
  styleUrls: ['./assets-view.component..scss']
})
export class AssetsViewComponent implements OnInit {

  private files = [];
  private file = null;

  constructor(private modalService: NgbModal, private behaviourService: BehaviourService, private httpService: HttpService) {}

  ngOnInit() {
    this.getFiles();
  }

  getFiles() {
    this.httpService.Post('/files', { FileType: FILETYPE.Image }).subscribe(res => {
      this.files = [];

      for (let i = 0; i < res.Files.length; i++) {
        if (i % 4 === 0) {
          this.files.push({
            files: []
          })
        }

        this.files[this.files.length - 1].files.push({
          id: res.Files[i].id,
          filename: res.Files[i].name
        });
      }
    });
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }

  onSubmitFile() {
    const formData: FormData = new FormData();
    formData.append('file', this.file, this.file.name);
    this.httpService.Post('/file-upload', formData).subscribe(res => {
      this.file = null;
      this.getFiles();
    });
  }

  private openBehaviourEditor(name: string, behaviourDef?: BehaviourDef): Promise<any> {
    let modal: NgbModalRef = this.modalService.open(BehaviourEditorComponent, { windowClass: 'behav-editor-modal' });
    let modalComponent: BehaviourEditorComponent = modal.componentInstance as BehaviourEditorComponent;
    modalComponent.init(name, behaviourDef);
    return modal.result;
  }

  onNewBehaviour(): void {
    let modal: NgbModalRef = this.modalService.open(NewBehaviourNameModalComponent, {});
    let modalComponent: NewBehaviourNameModalComponent = modal.componentInstance as NewBehaviourNameModalComponent;
    
    modal.result.then(name => {
      let behaviourName = name;
      this.openBehaviourEditor(name).then(() => {}, () => {});
    }, () => {});
  }

  onViewBehaviour(behaviour: BehaviourDef): void {
    this.openBehaviourEditor(behaviour.name, behaviour);
  }

  onEditBehaviour(behaviour: BehaviourDef): void {
    this.openBehaviourEditor(behaviour.name, behaviour).then(() => {}, () => {});
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
