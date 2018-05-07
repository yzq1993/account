import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { pickerComponent } from './picker.component'
import {enableProdMode} from '@angular/core';
enableProdMode();
@Injectable()
export class pickerService{
	constructor(
    private factory: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ){}
	show(options={}){
    let that=this
    return new Promise((resolve, reject)=>{
      let component = that.factory.resolveComponentFactory(pickerComponent).create(this.injector)
      for(let item in options){
        component.instance[item]=options[item]
      }

      if(component.instance.option[0].constructor!=Array){
        let m=component.instance.option
        component.instance.option=[m]
      }
      if(!component.instance.value||component.instance.value.constructor!=Array){
        component.instance.value=[]
        component.instance.option.forEach(function(value, index) {
          component.instance.value[index]=value[0]
        });
      }
      let el=(<any>component.hostView).rootNodes[0]
      component.instance.callback=(status,value)=>{
        if(status){
          resolve(value)
        }else{
          reject(value)
        }
        el.parentNode.removeChild(el);
        component.destroy()
      }
      that.appRef.attachView(component.hostView)
      document.body.appendChild(el)
    })
  }
}
