import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-object-modal',
  templateUrl: './delete-object-modal.component.html',
  styleUrls: ['./delete-object-modal.component..scss']
})
export class DeleteObjectModalComponent implements OnInit {

  private objectName: string;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit() {
  }

  public setObjectName(name: string): void {
    this.objectName = name;
  }

}
