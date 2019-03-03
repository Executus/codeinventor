import { Component, OnInit } from '@angular/core';
import { RuntimeService } from '../../runtime/runtime.service';

@Component({
  selector: 'app-toolbar-view',
  templateUrl: './toolbar-view.component.html',
  styleUrls: ['./toolbar-view.component..scss']
})
export class ToolbarViewComponent implements OnInit {

  constructor(private runtime: RuntimeService) { }

  ngOnInit() {
  }

  private onRunClicked(): void {
    this.runtime.startRuntime();
  }

  private onStopClicked(): void {
    this.runtime.stopRuntime();
  }
}
