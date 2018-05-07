import React, { Component } from 'react';
import ajax from '../../assets/ajax'
import typeList from '../../assets/type.js'
import styles from './index.css'
import {formatTime} from '../../assets/util'
import {datepicker} from '../../react-picker'
import toast from '../../component/toast'
class add extends Component {
  constructor() {
    super();
    this.state = {
      id:null,
      type:1,//1支出 2收入
      now: formatTime(new Date()),
      date: formatTime(new Date()),
      typeList: [],
      active:0,
      money:0,
      remark:''
    }
    this.init = this.init.bind(this);
    this.back = this.back.bind(this);
    this.changeRemark = this.changeRemark.bind(this);
    this.cancelMoney = this.cancelMoney.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.done = this.done.bind(this);
  };
  componentDidMount(){
    this.setState({
      typeList:typeList.filter(v=>v.type===this.state.type)
    })
    this.init()
  };
  init(){
    let id=this.props.match.params.id
    if(id===undefined){return false}
    ajax({
      method:'get',
      url:'/account',
      params:{id:id}
    }).then(row=>{
      if(row.code===203){
        this.props.history.push('/')
        return false
      }
      let res=row.data
      this.setState({
        id:id,
        type:res.type,
        date:res.year+'-'+(res.month<9?'0'+res.month:res.month)+'-'+(res.day<9?'0'+res.day:res.day),
        active:typeList.findIndex(v=>v.id===res.icon),
        money:res.money,
        remark:res.remark||''
      })
    })
  };
  back(){
    this.props.history.go(-1)
  };
  changeType(type){
    this.setState({
      type:type,
      active:0,
      typeList:typeList.filter(v=>v.type===type)
    })
  };
  changeActive(index){
    this.setState({
      active:index
    })
  };
  changeRemark(event){
    let remark=event.target.value
    if(remark.length>8){
      toast({
        icon:require('../../assets/image/error_icon.png'),
        msg:'备注不超过8个字符',
        time:1000
      })
      remark = remark.slice(0,8)
    }
    this.setState({
      remark:remark
    })
  };
  setMoney(num){
    let money = this.state.money;
    if (('' + money).indexOf('.') > -1 && (('' + money).split(".")[1].length>1||num === '.')) {
      return false
    }
    if (num === '.'||(num==='0'&&money!==0)||money==='0.'){
      money = money + num
    }else{
      money = +(money + num)
    }
    this.setState({
      money:money
    })
  };
  cancelMoney(){
    let str = this.state.money + ''
    this.setState({
      money:str.slice(0, str.length-1)
    })
  };
  changeDate(){
    datepicker({
      value:this.state.date.split('-'),
      type:'date'
    }).then(res=>{
      this.setState({
        date:res.join('-')
      })
    })
  };
  done(){
    let year = this.state.date.split('-')[0],
      month = +this.state.date.split('-')[1],
      day = +this.state.date.split('-')[2],
      money = +this.state.money;
    if (money===0){
      toast({
        icon:require('../../assets/image/error_icon.png'),
        msg:'金额不能为0'
      })
      return false
    }
    let icon = typeList.filter(v => v.type === this.state.type)[this.state.active].id,
      data = { year, month,day,money, remark: this.state.remark, icon, type: this.state.type }
    if (this.state.id===null){
      ajax({
        method:'post',
        url:'/account/add',
        data:data
      }).then(res=>{
        this.back()
      })
    }else{
      ajax({
        method:'post',
        url:'/account/update',
        data: {...data,id:this.state.id},
      }).then(res=>{
        this.back()
      })
    }
  };
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.back} onClick={this.back}><img src={require("../../assets/image/arrow_down.png")} alt=""/></div>
        <div className={styles.typeswitch}>
          <div>
            <p className={this.state.type===1?styles.active:''} onClick={e=>this.changeType(1)}>支出</p>
            <p className={this.state.type===2?styles.active:''} onClick={e=>this.changeType(2)}>收入</p>
          </div>
        </div>
        <div className={styles.typelist}>
          {
            this.state.typeList.map((item,index)=>
              (
                <div key={index} className={styles.item+' '+ (index===this.state.active?styles.active:'')} onClick={e=>this.changeActive(index)}>
                  <div className={styles.icon}><img src={index===this.state.active?item.activeIcon:item.icon} alt=""/></div>
                  <p>{item.name}</p>
                </div>
              )
            )
          }
        </div>
        <div className={styles.keyboard}>
          <div className={styles.head}>
            <div className={styles.remark}><span>备注：</span><input value={this.state.remark} onInput={this.changeRemark}/></div>
            <div>{this.state.money}</div>
          </div>
          <div className={styles.box}>
            <div className={styles.num}>
              <div onClick={e=>this.setMoney('7')}>7</div>
              <div onClick={e=>this.setMoney('8')}>8</div>
              <div onClick={e=>this.setMoney('9')}>9</div>
              <div onClick={e=>this.setMoney('4')}>4</div>
              <div onClick={e=>this.setMoney('5')}>5</div>
              <div onClick={e=>this.setMoney('6')}>6</div>
              <div onClick={e=>this.setMoney('1')}>1</div>
              <div onClick={e=>this.setMoney('2')}>2</div>
              <div onClick={e=>this.setMoney('3')}>3</div>
              <div onClick={e=>this.setMoney('.')}>.</div>
              <div onClick={e=>this.setMoney('0')}>0</div>
              <div onClick={this.cancelMoney}><img src={require("../../assets/image/cancel_icon.png")} alt=""></img></div>
            </div>
            <div className={styles.other}>
              <div className={styles.picker} onClick={this.changeDate}>
                {this.state.date===this.state.now?'今天':this.state.date}
              </div>
              <div className={styles.done}  onClick={this.done}>完 成</div>
            </div>
          </div>
        </div> 
      </div>
    );
  }
}

export default add;

