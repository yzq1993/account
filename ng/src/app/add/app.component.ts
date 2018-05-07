import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http'; // (1)
import 'rxjs/add/operator/map'; // (2)
import { Location } from '@angular/common';
import {formatTime} from '../../assets/util.js';
import typeList from '../../assets/type.js';
import { datepickerService } from '../../ng-picker';
import { toastService } from '../../component/toast/app.service';
@Component({
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AddComponent {
  id=null;
  type=1;//1支出 2收入
  now=formatTime(new Date());
  date=formatTime(new Date());
  typeList=[];
  active=0;
  money:any='0';
  remark:any=null;
  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private location: Location,
    private datepicker: datepickerService,
    private toast: toastService
  ){};
  ngOnInit(){
  	this.typeList=typeList.filter(v=>v.type==this.type)
    this.init()
  };
  init(){
    let id=this.route.snapshot.params.id
    if(id===undefined){return false}
    this.http.get('/account?id='+id).map(res => res.json()).subscribe(data=> {
      let res=data.data
      this.id=id
      this.type=res.type
      this.date=res.year+'-'+(res.month<9?'0'+res.month:res.month)+'-'+(res.day<9?'0'+res.day:res.day)
      this.active=typeList.findIndex(v=>v.id==res.icon)
      this.money=res.money
      this.remark=res.remark
    })
  };
  changeType(type){
		this.type=type
		this.active=0
		this.typeList=typeList.filter(v=>v.type==type)
	};
	changeActive(index){
		this.active=index
	};
	changeDate(){
		this.datepicker.show({
		  value:this.date.split('-'),
		  type:'date'
		}).then((value:any)=>{
      this.date=value.join('-')
		})
	};
  changeRemark(){
    if(this.remark.length>8){
      this.toast.show({
        icon:'../../assets/image/error_icon.png',
        msg:'备注不超过8个字符'
      })
      this.remark = this.remark.slice(0,8)
    }
  };
	setMoney(num){
    let money = this.money;
    if (('' + money).indexOf('.') > -1 && (('' + money).split(".")[1].length>1||num == '.')) {
      return false
    }
    if (num == '.'||(num=='0'&&money!='0')||money==='0.'){
      this.money = money + num
    }else{
      this.money = +(money + num)+''
    }
  };
  cancelMoney(){
    let str = this.money + ''
    this.money=str.slice(0, str.length-1)
  };
  back(){
    this.location.back();
  };
	done(){
		let year = this.date.split('-')[0],
      month = +this.date.split('-')[1],
      day = +this.date.split('-')[2],
      money = +this.money;
    if (money===0){
      this.toast.show({
        icon:'../../assets/image/error_icon.png',
        msg:'金额不能为0'
      })
      return false
    }
    let icon = typeList.filter(v => v.type == this.type)[this.active].id,
      data = { year, month,day,money, remark: this.remark, icon, type: this.type }
    console.log(this.id)
    if (this.id===null){
    	this.http.post('/account/add',data).map(res => res.json()).subscribe(res=> {
        this.back()
    	})
    }else{
    	this.http.post('/account/update',{...data,id:this.id}).map(res => res.json()).subscribe(res=> {
        this.back()
    	})
    }
	}
}
