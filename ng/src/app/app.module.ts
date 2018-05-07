import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/app.component';
import { AddComponent } from './add/app.component';
import { CountComponent } from './count/app.component';
import { TabComponent } from '../component/tab/app.component';
import { LoginComponent } from '../component/login/app.component';
import { datepickerModule} from '../ng-picker';
import { toastModule} from '../component/toast/app.module';
import { AppRoutingModule } from './app-routing.module';
@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    AddComponent,
    CountComponent,
    TabComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    datepickerModule.forRoot(),
    toastModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
