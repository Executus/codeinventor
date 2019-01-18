import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ToolbarViewComponent } from './views/toolbar-view/toolbar-view.component';
import { SceneViewComponent } from './views/scene-view/scene-view.component';
import { ObjectViewComponent } from './views/object-view/object-view.component';
import { BehaviourViewComponent } from './views/behaviour-view/behaviour-view.component';
import { AssetsViewComponent } from './views/assets-view/assets-view.component';
import { ObjectTreeComponent } from './object-tree/object-tree.component';

import { ObjectService } from './services/object.service';
import { FocusOnShowDirective } from './directives/focus-on-show.directive';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarViewComponent,
    SceneViewComponent,
    ObjectViewComponent,
    BehaviourViewComponent,
    AssetsViewComponent,
    ObjectTreeComponent,
    FocusOnShowDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule
  ],
  providers: [
    ObjectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
