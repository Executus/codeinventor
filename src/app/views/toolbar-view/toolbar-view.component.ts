import { Component, OnInit } from '@angular/core';
import { RuntimeService } from '../../runtime/runtime.service';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-toolbar-view',
  templateUrl: './toolbar-view.component.html',
  styleUrls: ['./toolbar-view.component..scss']
})
export class ToolbarViewComponent implements OnInit {

  constructor(private runtime: RuntimeService, private httpService: HttpService) { }

  ngOnInit() {
  }

  private onRunClicked(): void {
    this.runtime.startRuntime();
  }

  private onStopClicked(): void {
    this.runtime.stopRuntime();
  }

  getQuestionHoverText(): string {
    let text = "To return to this project go to (write down this URL):\n\n";
    text += environment.hostname + "/" + this.httpService.getAppId() + "\n\n";
    text += "To start a new project go to:\n\n";
    text += environment.hostname + "/";
    return text;
  }
}
