import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ToolbarViewComponent } from './views/toolbar-view/toolbar-view.component';
import { SceneViewComponent } from './views/scene-view/scene-view.component';
import { ObjectViewComponent } from './views/object-view/object-view.component';
import { BehaviourViewComponent } from './views/behaviour-view/behaviour-view.component';
import { AssetsViewComponent } from './views/assets-view/assets-view.component';


@NgModule({
  declarations: [
    AppComponent,
    ToolbarViewComponent,
    SceneViewComponent,
    ObjectViewComponent,
    BehaviourViewComponent,
    AssetsViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
