import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-behaviour-name-modal',
  templateUrl: './new-behaviour-name-modal.component.html',
  styleUrls: ['./new-behaviour-name-modal.component..scss']
})
export class NewBehaviourNameModalComponent implements OnInit {

  behaviourName: string;

  constructor(public modal: NgbActiveModal) {
    this.behaviourName = '';
  }

  ngOnInit() {
  }

}
