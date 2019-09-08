import { Component, OnInit } from '@angular/core';
import { RuntimeService } from '../../runtime/runtime.service';
import { HttpService } from '../../services/http.service';

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
}
