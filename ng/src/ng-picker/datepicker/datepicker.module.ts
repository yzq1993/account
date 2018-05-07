import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { pickerComponent } from '../picker/picker.component'
import { pickerService } from '../picker/picker.service'
import { datepickerService } from './datepicker.service'

@NgModule({
  declarations: [pickerComponent],
  exports: [pickerComponent],
  imports: [CommonModule],
  entryComponents: [pickerComponent],
})
export class datepickerModule {
  static forRoot(): ModuleWithProviders {
    return { 
      ngModule: datepickerModule, 
      providers: [
        datepickerService,
        pickerService
      ]
    }
  }
}