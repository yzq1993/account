import React, { Component } from 'react';
import ajax from '../../assets/ajax'
import typeList from '../../assets/type.js'
import styles from './index.css'
import Tab from '../../component/tab'
import {datepicker} from '../../react-picker'
class count extends Component {
  constructor() {
    super();
    this.state = {
      type:1,//1支出 2收入
      now: {
        year: null,
        month: null,
      },
      income:0,
      defray:0,
      list:[],
      isLogin:true
    };
    this.setList = this.setList.bind(this);
    this.setDate = this.setDate.bind(this);
    this.changeDate = this.changeDate.bind(this);
  };
  componentDidMount(){
    this.setDate(()=>{
      this.setList()
    })
  };
  setList(){
    ajax({
      method: 'get',
      url: '/account',
      params: { year: this.state.now.year, month: this.state.now.month,type:this.state.type}
    }).then(res=>{
      if(res.code===203){
        this.setState({
          isLogin:false
        })
        return false
      }
      let row=res.data
      let filter = row.filter((v, index, arr) => arr.findIndex(m => v.icon === m.icon) === index),
        list=filter.map(v=>({
          icon: typeList.find(m => m.id === v.icon).icon,
          name: typeList.find(m => m.id === v.icon).name,
          money: row.filter(m => m.icon === v.icon).reduce((i, j) => i + j.money, 0)
        }))
      this.setState({
        list:list.sort((m, n) => n.money - m.money)
      })
      if(this.state.type===1){
        let defray = list.reduce((m, n) => m + (+n.money), 0)
        this.setState({
          defray:defray
        })
      }else{
        let income = list.reduce((m, n) => m + (+n.money), 0)
        this.setState({
          income:income
        })
      }
    })
  };
  setDate(cb){
    let time=new Date()
    this.setState({
      now:{
        year:time.getFullYear(),
        month:time.getMonth()+1
      }
    },cb)
  };
  changeDate(){
    datepicker({
      value:[this.state.now.year,this.state.now.month],
      type:'yearmonth'
    }).then(res=>{
      this.setState({
        now:{
          year:res[0],
          month:res[1]
        }
      },()=>{
        this.setList()
      })
    })
  };
  changeType(type) {
    this.setState({
      type:type
    },this.setList)
  };
  render() {
    return (
      <div className={styles.main}>
        <Tab path="/count"></Tab>
        <div className={styles.select}>
          <div className={styles.picker} onClick={this.changeDate}>
            {this.state.now.year}年{this.state.now.month}月<img src={require("../../assets/image/arrow_down.png")} alt=""/>
          </div>
          <div className={styles.switch}>
            <div>
              <p className={this.state.type===1?styles.active:''} onClick={e=>this.changeType(1)}>支出</p>
              <p className={this.state.type===2?styles.active:''} onClick={e=>this.changeType(2)}>收入</p>
            </div>
          </div>
        </div>
        {
          this.state.type===1?(
            <div className={styles.table_head}>
              <div>总支出：{this.state.defray.toFixed(2)} 元</div>
              <div>每日平均：{(this.state.defray/30).toFixed(2)} 元</div>
            </div>
          ):(
            <div className={styles.table_head}>
              <div>总收入：{this.state.income.toFixed(2)} 元</div>
              <div>每日平均：{(this.state.income/30).toFixed(2)} 元</div>
            </div>
          )
        }
        <div className={styles.list}>
          <div className={styles.title}>排行榜</div>
          {
            this.state.list.map((item,index)=>
              <div className={styles.item} key={index}>
                <div className={styles.icon}>
                  <img src={item.icon} alt=""></img>
                  <span>{item.name}</span>
                </div>
                <p>{item.money.toFixed(2)}</p>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default count;

