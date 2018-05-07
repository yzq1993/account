import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { pickerComponent } from './picker.component'
import { pickerService } from './picker.service'

@NgModule({
  declarations: [pickerComponent],
  exports: [pickerComponent],
  imports: [CommonModule],
  entryComponents: [pickerComponent],
})
export class pickerModule {
  static forRoot(): ModuleWithProviders {
    return { 
    	ngModule: pickerModule, 
    	providers: [
	      pickerService,
	    ]
	  }
  }
}