import { Component } from '@angular/core';
import { Http } from '@angular/http'; // (1)
import 'rxjs/add/operator/map'; // (2)
import {formatTime} from '../../assets/util.js';
import typeList from '../../assets/type.js';
import { datepickerService } from '../../ng-picker';
@Component({
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class CountComponent {
  type=1;//1支出 2收入
  now= {
    year: null,
    month: null,
  };
  income=0;
  defray=0;
  list=[]
  constructor(
    private http: Http,
    private datepicker: datepickerService
  ){};
  ngOnInit(){
  	this.setDate()
    this.setList()
  };
  setList(){
  	this.http.get('/account?year='+this.now.year+'&month='+this.now.month+'&type='+this.type).map(res => res.json()).subscribe(res=> {
  		let row=res.data
  		let filter = row.filter((v, index, arr) => arr.findIndex(m => v.icon == m.icon) == index),
        list=filter.map(v=>({
          icon: typeList.find(m => m.id == v.icon).icon,
          name: typeList.find(m => m.id == v.icon).name,
          money: row.filter(m => m.icon == v.icon).reduce((i, j) => i + j.money, 0)
        }))
      this.list=list.sort((m, n) => n.money - m.money)
      if (this.type == 1) {
        let defray = list.reduce((m, n) => m + (+n.money), 0)
        this.defray=defray
      }else{
        let income = list.reduce((m, n) => m + (+n.money), 0)
        this.income=income
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
  changeType(type) {
  	this.type=type
    this.setList()
  };
  setDate(){
    let now = new Date()
    this.now={
    	year: now.getFullYear(),
      month: now.getMonth() + 1,
    }
  }
}
