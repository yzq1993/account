import React, { Component } from 'react';
import styles from './index.css'
import ajax from '../../assets/ajax'
import toast from '../toast'
class Login extends Component {
	constructor() {
    super();
    this.state={
    	form:{
        email:'',
        password:'',
        code:''
      },
      isLogin:1, //1 登录 2注册 3找回密码，
      codeTime:0,
      setInterval:null,
    }
    this.changeTab = this.changeTab.bind(this);
    this.sendCode = this.sendCode.bind(this);
    this.register = this.register.bind(this);
    this.changepwd = this.changepwd.bind(this);
    this.login = this.login.bind(this);
    this.inputChange = this.inputChange.bind(this);
  };
  changeTab(e){
    clearInterval(this.state.setInterval)
    this.setState({
      isLogin:e,
      form:{
        email:'',
        password:'',
        code:''
      },
      codeTime:0
    })
  };
  sendCode(){
    if(this.state.isLogin===1){return false}
    if(this.state.codeTime){return false}
    if(!this.state.form.email){
      toast({
        icon:require('../../assets/image/error_icon.png'),
        msg:'请输入邮箱'
      })
      return false
    }
    let type=this.state.isLogin===2?'reg':'pwd'
    ajax({
      method:'post',
      url:'/account/sendCode',
      data:{email:this.state.form.email,type:type}
    }).then(res=>{
      let t=setInterval(()=>{
        if(this.state.codeTime){
          this.setState((prevState)=>({
            codeTime:prevState.codeTime-1
          }))
        }else{
          clearInterval(this.state.setInterval)
        }
      },1000)
      this.setState({
        codeTime:59,
        setInterval:t
      })
    })
  };
  register(){
    if(this.state.isLogin!==2){return false}
    if(!this.state.form.email){
      toast({
        icon:require('../../assets/image/error_icon.png'),
        msg:'请输入邮箱'
      })
      return false
    }
    if(!this.state.form.code){
      toast({
        icon:require('../../assets/image/error_icon.png'),
        msg:'请输入验证码'
      })
      return false
    }
    if(!this.state.form.password){
      toast({
        icon:require('../../assets/image/error_icon.png'),
        msg:'请输入密码'
      })
      return false
    }
    ajax({
      method:'post',
      url:'/account/register',
      data:this.state.form
    }).then(res=>{
      this.props.login(true)
    })
  };
  changepwd(){
    if(this.state.isLogin!==3){return false}
    if(!this.state.form.email){
      toast({
        icon:require('../../assets/image/error_icon.png'),
        msg:'请输入邮箱'
      })
      return false
    }
    if(!this.state.form.code){
      toast({
        icon:require('../../assets/image/error_icon.png'),
        msg:'请输入验证码'
      })
      return false
    }
    if(!this.state.form.password){
      toast({
        icon:require('../../assets/image/error_icon.png'),
        msg:'请输入密码'
      })
      return false
    }
    ajax({
      method:'post',
      url:'/account/changepwd',
      data:this.state.form
    }).then(res=>{
      this.changeTab(1)
    })
  };
  login(){
  	if(!this.state.form.email){
      toast({
        icon:require('../../assets/image/error_icon.png'),
        msg:'请输入邮箱'
      })
      return false
    }
    if(!this.state.form.password){
      toast({
        icon:require('../../assets/image/error_icon.png'),
        msg:'请输入密码'
      })
      return false
    }
    ajax({
      method:'post',
      url:'/account/login',
      data:{email:this.state.form.email,password:this.state.form.password}
    }).then(res=>{
    	this.props.login(true)
    })
  };
  inputChange(event){
  	let name=event.target.name,
  		value=event.target.value;
  	this.setState({
      form:Object.assign(this.state.form,{[name]: value})
    });
  };
  render() {
    return (
  		this.props.value&&
  		<div className={styles.login}>
        { 
          this.state.isLogin===1?
  		    (
            <div className={styles.loginBox}>
    		      <input value={this.state.form.email} placeholder="请输入邮箱" onInput={this.inputChange} name="email"></input>
    		      <input type="password" value={this.state.form.password} placeholder="请输入密码" onInput={this.inputChange} name="password"></input>
    		      <button onClick={this.login}>登 录</button>
              <div className={styles.note}>
                <span onClick={_=>this.changeTab(3)}>忘记密码</span>
                <span onClick={_=>this.changeTab(2)}>注册账号</span>
              </div>
    		    </div>
          ):(
            <div className={styles.loginBox}>
              <h2>{this.state.isLogin===2?'注 册':'重置密码'}</h2>
              <input value={this.state.form.email} placeholder="请输入邮箱" onInput={this.inputChange} name="email"></input>
              <div className={styles.two}>
                <div><input type="number" value={this.state.form.code} placeholder="请输入验证码" onInput={this.inputChange} name="code"></input></div>
                <div><button onClick={this.sendCode} className={!!this.state.codeTime?styles.lock:''}>{this.state.codeTime?this.state.codeTime+'s':'发送验证码'}</button></div>
              </div>
              <input type="password" value={this.state.form.password} placeholder="请输入密码" onInput={this.inputChange} name="password"></input>
              {
                this.state.isLogin===2?(
                  <button onClick={this.register}>注 册</button>
                ):(
                  <button onClick={this.changepwd}>确 定</button>
                )
              }
              <div className={styles.note}><span></span><span onClick={_=>this.changeTab(1)}>去登录</span></div>
            </div>
          )
        }
		  </div>
    )
  }
}

export default Login