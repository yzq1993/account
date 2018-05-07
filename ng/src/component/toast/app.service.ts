import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastComponent } from './app.component'
import {enableProdMode} from '@angular/core';
enableProdMode();
@Injectable()
export class toastService{
	constructor(
    private factory: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ){

  }
	show(options={}){
    let that=this
    return new Promise((resolve, reject)=>{
      let component = that.factory.resolveComponentFactory(ToastComponent).create(this.injector)
      if(typeof options =='string'){
        component.instance.msg=options
      }else{
        for(let item in options){
          component.instance[item]=options[item]
        }
      }
      let el=(<any>component.hostView).rootNodes[0]
      component.instance.callback=()=>{
        el.parentNode.removeChild(el);
        component.destroy()
        resolve()
      }
      that.appRef.attachView(component.hostView)
      document.body.appendChild(el)
    })
  }
}
