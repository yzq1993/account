import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { pickerComponent } from '../picker/picker.component'
import { pickerService } from '../picker/picker.service'
import { citypickerService } from './citypicker.service'

@NgModule({
  declarations: [pickerComponent],
  exports: [pickerComponent],
  imports: [CommonModule],
  entryComponents: [pickerComponent],
})
export class citypickerModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: citypickerModule, providers: [
      citypickerService,
      pickerService
    ]}
  }
}