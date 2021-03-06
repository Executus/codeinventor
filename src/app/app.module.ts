import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { ClickOutsideModule } from 'ng-click-outside';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ToolbarViewComponent } from './views/toolbar-view/toolbar-view.component';
import { SceneViewComponent } from './views/scene-view/scene-view.component';
import { ObjectViewComponent } from './views/object-view/object-view.component';
import { BehaviourViewComponent } from './views/behaviour-view/behaviour-view.component';
import { AssetsViewComponent } from './views/assets-view/assets-view.component';
import { ObjectTreeComponent } from './object-tree/object-tree.component';

import { ObjectService } from './services/object.service';
import { HttpService } from './services/http.service';
import { RuntimeService } from './runtime/runtime.service';
import { BehaviourService } from './services/behaviour.service';

import { FocusOnShowDirective } from './directives/focus-on-show.directive';
import { DeleteObjectModalComponent } from './modals/delete-object-modal/delete-object-modal.component';
import { BehaviourListComponent } from './behaviour-list/behaviour-list.component';
import { RuntimeComponent } from './runtime/runtime.component';
import { FileSelectModalComponent } from './modals/file-select-modal/file-select-modal.component';
import { BehaviourEditorComponent } from './modals/behaviour-editor/behaviour-editor.component';
import { NewBehaviourNameModalComponent } from './modals/new-behaviour-name-modal/new-behaviour-name-modal.component';
import { DeleteBehaviourModalComponent } from './modals/delete-behaviour-modal/delete-behaviour-modal.component';
import { AppBootstrapComponent } from './app-bootstrap.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarViewComponent,
    SceneViewComponent,
    ObjectViewComponent,
    BehaviourViewComponent,
    AssetsViewComponent,
    ObjectTreeComponent,
    FocusOnShowDirective,
    DeleteObjectModalComponent,
    BehaviourListComponent,
    RuntimeComponent,
    FileSelectModalComponent,
    BehaviourEditorComponent,
    NewBehaviourNameModalComponent,
    DeleteBehaviourModalComponent,
    AppBootstrapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    AngularFileUploaderModule,
    ClickOutsideModule
  ],
  providers: [
    ObjectService,
    HttpService,
    RuntimeService,
    BehaviourService
  ],
  bootstrap: [AppBootstrapComponent],
  entryComponents: [
    DeleteObjectModalComponent,
    FileSelectModalComponent,
    BehaviourEditorComponent,
    NewBehaviourNameModalComponent,
    DeleteBehaviourModalComponent
  ]
})
export class AppModule { }
