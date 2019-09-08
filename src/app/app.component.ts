import { Component, OnInit } from '@angular/core';
import { RuntimeService } from './runtime/runtime.service';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from './services/http.service';
import { BehaviourService } from './services/behaviour.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component..scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private runtime: RuntimeService, private route: ActivatedRoute, private httpService: HttpService,
              private behaviourService: BehaviourService) {}

  ngOnInit() {
    let appId = this.route.snapshot.paramMap.get('appid');
    if (!appId) {
      appId = (Math.random() + 1).toString(36).substring(7);
    }
    this.httpService.setAppId(appId);
    this.behaviourService.init();
  }
}
