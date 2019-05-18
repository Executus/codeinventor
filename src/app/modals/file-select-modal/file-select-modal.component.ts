import { Component, OnInit } from '@angular/core';
import { FILETYPE } from '../../classes/property-file';
import { HttpService } from '../../services/http.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-file-select-modal',
  templateUrl: './file-select-modal.component.html',
  styleUrls: ['./file-select-modal.component..scss']
})
export class FileSelectModalComponent implements OnInit {

  private fileType: FILETYPE;
  private files = [];

  private fileUploaderConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png",
    uploadAPI: {
      url: "/file-upload"
    }
  }

  constructor(private httpService: HttpService, public modal: NgbActiveModal) { }

  ngOnInit() {
  }

  public setFileType(fileType: FILETYPE): void {
    this.fileType = fileType;
    this.httpService.Post('/files', { FileType: FILETYPE.Image }).subscribe(res => {

      for (let i = 0; i < res.Files.length; i++) {
        if (i % 4 === 0) {
          this.files.push({
            files: []
          })
        }

        this.files[this.files.length - 1].files.push(res.Files[i]);
      }
    });
  }

  private onFileUploaded(event) {

  }
}