import { DialogProjectComponent } from './home/component/dialog/dialog-project/dialog-project.component';
import { DialogConfirmComponent } from './home/component/dialog/dialog-confirm/dialog-confirm.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module'
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DialogGamaFileComponent } from './home/component/dialog/dialog-gama-file/dialog-gama-file.component';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [
    AppComponent,
    DialogConfirmComponent,
    DialogProjectComponent,
    DialogGamaFileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    ToastrModule.forRoot({
      timeOut: 800,
      positionClass: 'toast-bottom-right',
    })
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
