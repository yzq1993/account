import { Component } from '@angular/core';
import { Http } from '@angular/http'; // (1)
import 'rxjs/add/operator/map'; // (2)
import typeList from '../../assets/type.js';
import { datepickerService } from '../../ng-picker';
@Component({
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class IndexComponent {
	now={
		year:null,
		month:null,
	};
	finance={
    income: 0,
    defray: 0,
    budget: 0
  };
  delShow={
    key:null,
    show:null,
    start:null
  };
  list=[];
  budget={
    show:false,
    money:null,
    status:1 //1暂不设置 2已设置
  }
  isLogin:boolean=true
  constructor(
    private http: Http,
    private datepicker: datepickerService
  ){};
  ngOnInit(){
  	this.setDate()
		this.init()
  };
  setDate(){
  	let time=new Date()
		this.now.year=time.getFullYear()
		this.now.month=time.getMonth()+1
  };
  init(){
    this.isLogin=true
  	this.setList()
  	this.initbudget()
  };
  setList(){
  	this.http.get('/account?year='+this.now.year+'&month='+this.now.month).map(res => res.json()).subscribe(res=> {
      if(res.code==203){
        this.isLogin=false
        return false
      }
      
  		let data=res.data,
  		 	filter = data.filter((v, index, arr) => arr.findIndex(m => v.day == m.day) == index).sort((m,n)=>n.day-m.day),
          list = filter.map(v => ({
            date:v.day,
            income:+(data.filter(m=>m.day==v.day&&m.type==2).reduce((m,n)=>m+n.money,0)),
            defray:+(data.filter(m=>m.day==v.day&&m.type==1).reduce((m,n)=>m+n.money,0)),
            children:data.filter(m=>m.day==v.day).map(m=>({
              id:m.id,
              money:m.money,
              name:typeList.find(n=>n.id==m.icon).name,
              icon: typeList.find(n => n.id == m.icon).icon,
              day:m.day,
              type:m.type,
              remark:m.remark
            }))
          }))
      let defray = +(list.reduce((m, n) => m + n.defray, 0))
      this.list=list
      this.finance={
      	income: +(list.reduce((m, n) => m + n.income,0)),
      	defray: defray,
      	budget: this.budget.money - defray
      }
  	})
  };
  changeDate(){
    this.datepicker.show({
      value:[this.now.year,this.now.month],
      type:'yearmonth'
    }).then((value)=>{
      this.now.year=value[0]
      this.now.month=value[1]
      this.setList()
    })
  };
  startMoveItem(key,event){
  	this.delShow={
			key:key,
			start: event.changedTouches[0].clientX,
			show:false
		}
  };
  moveItem(key,event){
  	let move = event.changedTouches[0].clientX;
    if (this.delShow.key == key && this.delShow.start-move>50){
    	this.delShow.show=true
    }
  };
  delItem(index,key){
  	let data
	  	if(key===undefined){
	  		data = { year: this.now.year, month: this.now.month, day:this.list[index].date}
	  	}else{
	  		data = { id: this.list[index].children[key].id}
	  	}
	  	this.http.post('/account/delete',data).map(res => res.json()).subscribe(res=>{
	  		if(key===undefined){
	  			this.list.splice(index,1)
	  		}else{
	  			let obj=this.list[index]
		  		obj.children.splice(key, 1)
		  		this.list.splice(index,1,{
		  			date:obj.date,
		  			children:obj.children,
		  			defray:obj.children.filter(v => v.type == 1).reduce((m,n)=>m+n.money,0),
		  			income:obj.children.filter(v => v.type == 2).reduce((m, n) => m + n.money, 0)
		  		})
	  		}
	  		let defray = this.list.reduce((m, n) => m + n.children.filter(v => v.type == 1).reduce((i, j) => i + j.money, 0), 0)
		  	this.delShow={
		  		key:null,
		      show:null,
		      start:null
		  	}
		  	this.finance={
		  		income: this.list.reduce((m, n) => m + n.children.filter(v=>v.type==2).reduce((i, j) => i + j.money,0),0),
	        defray: defray,
	        budget: this.budget.money - defray
		  	}
	  	})
  };
  initbudget(){
  	this.http.get('/account/budget').map(res => res.json()).subscribe(res=>{
      if(res.code==203){
        this.isLogin=false
        return false
      }
  		let budget = res.data.budget,data
      if (budget===null){
        data={
          show: true,
          money: null,
          status: 1 
        }
      } else if (budget){
        data = {
          show: false,
          money: budget,
          status: 2
        }
      }else{
        data = {
          show: false,
          money: null,
          status: 1
        }
      }
      this.budget=data
      this.finance.budget=data.money - this.finance.defray
    })
  };
  setbudget(){
  	let money = +this.budget.money;
	   //  if (money==0){
	   //  	this.$toast({
				// 	icon:require('@/assets/image/error_icon.png'),
				// 	msg:'请设置预算'
				// }).then(res=>{
				// 	this.budget.money=null
				// })
		    
		  //   return false
	   //  }
    this.http.post('/account/budget',{budget: money}).map(res => res.json()).subscribe(res=>{
    	this.budget.show=false
    	this.budget.status=2
    	this.finance.budget=+(this.budget.money - this.finance.defray).toFixed(2)
    })
  };
  cancelbudget(){
  	this.http.post('/account/budget',{budget: 0}).map(res => res.json()).subscribe(res=>{
			this.budget={
				show:false,
				money:null,
				status:1
			}
		})
  }
}
