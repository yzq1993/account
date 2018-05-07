import { Component ,Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
	selector:'i-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.css']
})
export class pickerComponent{
 	callback: Function;
	change: Function;
  show=true;
	title='请选择';
	value=[];
	option=[];
	activeClass=null;
	closetext='关 闭';
	oktext='确 定';
	topStyle=[];
	transform=[];
	start={
		top:null,
		style:null,
		move:null,
		value:null
	};
	flag=true;
	endClass=[];
	height=35;
	constructor(private sanitizer: DomSanitizer){};
	ngOnInit(){
		document.body.style.overflowY = 'hidden'
		this.initTop()
  	setTimeout(()=>{
			this.activeClass='active'
		},0)
  };
  initTop(){
		let m;
		this.value.forEach( (value, index) =>{
			if(!this.option[index]){return false}
			m=this.option[index].findIndex(v=>v==value)
			if(m==-1){console.log('默认值设置错误');return false}
			this.topStyle[index]=-m*this.height
			this.transform[index]=this.sanitizer.bypassSecurityTrustStyle('transform: translate3d(0px, '+(-m*this.height)+'px, 0px)')
		});
	};
	success(){
		this.end(true)
	};
	close(){
		this.end(false)
	};
	end(status){
		document.body.style.overflowY = 'auto'
		this.show=false;
		if(this.value.length==1){
			this.callback(status,this.value[0])
		}else{
			this.callback(status,this.value)
		}
	};
	touchstart(event,index){
		this.endClass[index]=''
		this.start.top=event.targetTouches[0].pageY
		this.start.style=-this.topStyle[index]
		this.start.value=this.value[index]
	};
	touchmove(event,index){
		if(!this.flag){return false}
		this.flag=false;
		setTimeout(()=>{
			this.start.move=event.targetTouches[0].pageY
			this.topStyle.splice(index, 1, -(this.start.style+this.start.top-this.start.move))
			this.transform[index]=this.sanitizer.bypassSecurityTrustStyle('transform: translate3d(0px, '+(-this.start.style-this.start.top+this.start.move)+'px, 0px)')
			this.flag=true
		},15)
	};
	touchend(event,index){
			this.endClass[index]='end'
			setTimeout(()=>{
				let h=-this.topStyle[index],len=this.option[index].length-1
				if(h<=0){
					this.transform[index]=this.sanitizer.bypassSecurityTrustStyle('transform: translate3d(0px, 0px, 0px)')
					this.topStyle.splice(index, 1, 0)
					this.value.splice(index,1,this.option[index][0])
				}else if(h>this.height*len){
					this.transform[index]=this.sanitizer.bypassSecurityTrustStyle('transform: translate3d(0px, '+(-len*this.height)+'px, 0px)')
					this.topStyle.splice(index, 1, -this.height*len)
					this.value.splice(index,1,this.option[index][len])
				}else{
					let m;
					if(h%this.height>=this.height/2){
						m=Math.ceil(h/this.height)
					}else{
						m=Math.floor(h/this.height)
					}
					this.topStyle.splice(index, 1, -this.height*m)
					this.transform[index]=this.sanitizer.bypassSecurityTrustStyle('transform: translate3d(0px, '+(-m*this.height)+'px, 0px)')
					this.value.splice(index,1,this.option[index][m])
				}
				if(this.start.value!=this.value[index]&&typeof this.change =='function'){
					if(this.value.length==1){
						this.change(this.value[0],Number(index),this)
					}else{
						this.change(this.value,Number(index),this)
					}
				}
			},20)
	};
	scrollTop(index,value){
		let m=this.option[index].indexOf(value)
		this.topStyle.splice(index, 1, -this.height*m)
		this.transform[index]=this.sanitizer.bypassSecurityTrustStyle('transform: translate3d(0px, '+(-m*this.height)+'px, 0px)')
		this.value.splice(index,1,value)
	}
}
