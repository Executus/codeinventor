import { Component } from '@angular/core';
import { RuntimeService } from './runtime/runtime.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component..scss']
})
export class AppComponent {
  title = 'app';

  constructor(private runtime: RuntimeService) {}
}
