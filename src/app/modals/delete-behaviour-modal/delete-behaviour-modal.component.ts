import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-behaviour-modal',
  templateUrl: './delete-behaviour-modal.component.html',
  styleUrls: ['./delete-behaviour-modal.component..scss']
})
export class DeleteBehaviourModalComponent implements OnInit {

  private behaviourName: string;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit() {
  }

  public setBehaviourName(name: string): void {
    this.behaviourName = name;
  }

}
