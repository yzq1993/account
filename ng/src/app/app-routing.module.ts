import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { IndexComponent } from './index/app.component';
import { AddComponent } from './add/app.component';
import { CountComponent } from './count/app.component';
const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'add', component: AddComponent },
  { path: 'add/:id', component: AddComponent },
  { path: 'count', component: CountComponent }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}