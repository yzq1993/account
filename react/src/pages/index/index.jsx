import React, { Component } from 'react';
import {Link } from 'react-router-dom'
import ajax from '../../assets/ajax'
import typeList from '../../assets/type.js'
import styles from './index.css'
import Tab from '../../component/tab/index.jsx'
import Login from '../../component/login/index.jsx'
import {datepicker} from '../../react-picker'
import toast from '../../component/toast'
class index extends Component {
  constructor() {
    super();
    this.state = {
      isLogin:true,
      now:{
        year:null,
        month:null,
      },
      finance:{
        income: 0,
        defray: 0,
        budget: 0
      },
      delShow:{
        key:null,
        show:false,
        start:null
      },
      list:[],
      budget:{
        show:false,
        money:null,
        status:1 //1暂不设置 2已设置
      }
    };
    this.init = this.init.bind(this);
    this.setList = this.setList.bind(this);
    this.setDate = this.setDate.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.initbudget = this.initbudget.bind(this);
    this.showBudget = this.showBudget.bind(this);
    this.inputBudget = this.inputBudget.bind(this);
    this.setbudget = this.setbudget.bind(this);
    this.cancelbudget = this.cancelbudget.bind(this);

    this.login = this.login.bind(this);
  };
  componentDidMount(){
    this.setDate(()=>{
      this.init()
    })
  };
  init(){
    this.setList()
    this.initbudget()
  };
  setList(){
    ajax({
      method: 'get',
      url: '/account',
      params:{year:this.state.now.year,month:this.state.now.month}
    }).then(row=>{
      if(row.code===203){
        this.setState({
          isLogin:false
        })
        return false
      }
      let res=row.data
      let filter = res.filter((v, index, arr) => arr.findIndex(m => v.day === m.day) === index).sort((m,n)=>n.day-m.day),
        list = filter.map(v => ({
          date:v.day,
          income:+(res.filter(m=>m.day===v.day&&m.type===2).reduce((m,n)=>m+n.money,0)).toFixed(2),
          defray:+(res.filter(m=>m.day===v.day&&m.type===1).reduce((m,n)=>m+n.money,0)).toFixed(2),
          children:res.filter(m=>m.day===v.day).map(m=>({
            id:m.id,
            money:m.money,
            name:typeList.find(n=>n.id===m.icon).name,
            icon: typeList.find(n => n.id === m.icon).icon,
            day:m.day,
            type:m.type,
            remark:m.remark
          }))
        }))
      let defray = +(list.reduce((m, n) => m + n.defray, 0)).toFixed(2)
      this.setState({
        list:list,
        finance:{
          income: +(list.reduce((m, n) => m + n.income,0)).toFixed(2),
          defray: defray,
          budget: this.state.budget.money - defray
        }
      })
    })
  };
  setDate(cb){
    let time=new Date()
    this.setState({
      now:{
        year:time.getFullYear(),
        month:time.getMonth()+1
      }
    },()=>{
      cb()
    })
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
  startMoveItem(key,event){
    this.setState({
      delShow:{
        key:key,
        start: event.changedTouches[0].clientX,
        show:false
      }
    })
  };
  moveItem(key,event){
    let move = event.changedTouches[0].clientX;
    if (this.state.delShow.key === key && this.state.delShow.start-move>50){
      this.setState({
        delShow:Object.assign(this.state.delShow,{show:true})
      })
    }
  };
  delItem(index,key){
    let data,list=this.state.list
    if(key===undefined){
      data = { year: this.state.now.year, month: this.state.now.month, day:this.state.list[index].date}
    }else{
      data = { id: list[index].children[key].id}
    }
    ajax({
      method:'post',
      url:'/account/delete',
      data:data
    }).then(res=>{
      if(key===undefined){
        list.splice(index,1);
      }else{
        list[index].children.splice(key, 1);
        list[index].defray = list[index].children.filter(v => v.type === 1).reduce((m,n)=>m+n.money,0)
        list[index].income = list[index].children.filter(v => v.type === 2).reduce((m, n) => m + n.money, 0)
      }
      let defray = list.reduce((m, n) => m + n.children.filter(v => v.type === 1).reduce((i, j) => i + j.money, 0), 0)
      this.setState({
        list: list,
        delShow:{
          key:null,
          show:null,
          start:null
        },
        finance:{
          income: list.reduce((m, n) => m + n.children.filter(v=>v.type===2).reduce((i, j) => i + j.money,0),0),
          defray: defray,
          budget: this.state.budget.money - defray
        }
      })
    })
  };
  initbudget(){
    ajax({
      method: 'get',
      url: '/account/budget',
    }).then(res=>{
      if(res.code===203){
        this.setState({
          isLogin:false
        })
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
      this.setState({
        budget:data,
        finance:Object.assign(this.state.finance,{budget:data.money - this.state.finance.defray})
      })

    })
  };
  showBudget(){
    this.setState({
      budget:Object.assign(this.state.budget,{show:true})
    })
  };
  inputBudget(event){
    this.setState({
      budget:Object.assign(this.state.budget,{money:event.target.value})
    })
  };
  setbudget(){
    let money = +this.state.budget.money;
    if (money===0){
      toast({
        icon:require('../../assets/image/error_icon.png'),
        msg:'请设置预算'
      }).then(res=>{
        this.setState({
          budget:Object.assign(this.state.budget,{money:''})
        })
      })
      return false
    }
    ajax({
      method: 'post',
      url: '/account/budget',
      data: {budget:money},
    }).then(res=>{
      this.setState({
        budget:Object.assign(this.state.budget,{show:false,status:2}),
        finance:Object.assign(this.state.finance,{budget:+(this.state.budget.money - this.state.finance.defray).toFixed(2)})
      })
    })
  };
  cancelbudget(){
    ajax({
      method:'post',
      url:'/account/budget',
      data: { budget: 0 }
    }).then(_=>{
      this.setState({
        budget:{
          show:false,
          money:null,
          status:1
        }
      })
    })
  };
  login(e){
    this.setState({
      isLogin:e
    },()=>{
      this.init()
    })
  };
  render() {
    return (
      <div className={styles.App}>
        <Tab path="/"></Tab>
        <Login value={!this.state.isLogin} login={this.login}></Login>
        <div className={styles.container}>
          <div className={styles.head}>
            <div className={styles.picker+' '+styles.box} onClick={this.changeDate}>
              <div className={styles.label}>{this.state.now.year}年</div>
              <div>{this.state.now.month}月<img src={require("../../assets/image/arrow_down.png")} alt=""/></div>
            </div>
            <div className={styles.box}>
              <div className={styles.label}>收入</div>
              <div>{this.state.finance.income}</div>
            </div>
            <div className={styles.box}>
              <div className={styles.label}>支出</div>
              <div>{this.state.finance.defray}</div>
            </div>
            <div className={styles.box} onClick={this.showBudget}>
              <div className={styles.label}>剩余预算</div>
              <div>{this.state.budget.status===2?this.state.finance.budget:'未设置'}</div>
            </div>
          </div>
          {
            this.state.list.length>0&&
            <div className={styles.list}>
              {this.state.list.map((item,index)=>
                <div key={index}>
                {
                  item.children.length>0&&
                  <div>
                    <div className={styles.item_head}>
                      <div className={styles.info+' '+(this.state.delShow.key===index&&this.state.delShow.show?styles.del:'')} show={this.state.delShow.show?1:0} index={this.state.delShow.key} onTouchStart={(e)=>this.startMoveItem(index,e)} onTouchEnd={(e)=>this.moveItem(index,e)}>
                        <div>{item.date}日</div>
                        <div>
                          {
                            item.income>0&&
                            <p>收入：{item.income}</p>
                          }
                          {
                            item.defray>0&&
                            <p>支出：{item.defray}</p>
                          }
                        </div>
                      </div>
                      <div className={styles.btn} onClick={e=>this.delItem(index)}>删除</div>
                    </div>
                    {
                      item.children.map((child,key)=>
                        <div className={styles.item} key={key}>
                          <div className={styles.info+' '+(this.state.delShow.key===(index+'-'+key)&&this.state.delShow.show?styles.del:'')} onTouchStart={e=>this.startMoveItem(index+'-'+key,e)}  onTouchEnd={e=>this.moveItem(index+'-'+key,e)}>
                            <div><img src={child.icon} alt=""/>
                              <p className={styles.label}>
                                {child.name}
                                {
                                  child.remark&&
                                  <span>（{child.remark}）</span>
                                }
                              </p>
                            </div>
                            <div className={child.type===2?styles.add:''}>{child.type===2?'+':''}{child.money}</div>
                          </div>
                          <div className={styles.btn}>
                            <Link to={"/edit/"+child.id}><img src={require("../../assets/image/edit_icon.png")} alt=""/></Link>
                            <div onClick={e=>this.delItem(index,key)}><img src={require("../../assets/image/del_icon.png")} alt=""/></div>
                          </div>
                        </div>
                      )
                    }
                  </div>
                }
                </div>
              )}
            </div>
          }
        </div>
        {
          this.state.budget.show&&
          <div className={styles.setBudget}>
            <div className={styles.setBudgetBox}>
              <div className={styles.title}>设置每月预算</div>
              <input focus="true" type="number" value={this.state.budget.money} onChange={this.inputBudget}></input>
              <div className={styles.btns}>
                <button type="primary" onClick={this.setbudget}>确 定</button>
                <button onClick={this.cancelbudget}>暂不设置</button>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default index;

