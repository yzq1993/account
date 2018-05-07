import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ToastComponent } from './app.component'
import { toastService } from './app.service'

@NgModule({
  declarations: [ToastComponent],
  exports: [ToastComponent],
  imports: [CommonModule],
  entryComponents: [ToastComponent],
})
export class toastModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: toastModule, providers: [
      toastService,
    ]}
  }
}