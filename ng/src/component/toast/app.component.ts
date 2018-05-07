import { Component } from '@angular/core';

@Component({
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class ToastComponent {
  icon=null;
  msg=null;
  time=2000;
  activeClass=null
  callback=null
  ngOnInit(){
  	this.activeClass='active'
  	if(this.time){
      setTimeout(()=>{
        this.close()
      },this.time)
    }
  }
  close(){
    if(typeof this.callback == 'function'){
      this.callback()
    }
  }
}
