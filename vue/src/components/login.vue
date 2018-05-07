<template>
  <div class="login" v-if="!$store.state.isLogin">
    <div class="loginBox" v-if="isLogin==1">
      <input focus v-model=form.email placeholder="请输入邮箱"></input>
      <input type="password" v-model=form.password placeholder="请输入密码"></input>
      <button @click="login">登 录</button>
      <div class="note">
        <span @click=changeTab(3)>忘记密码</span>
        <span @click=changeTab(2)>注册账号</span>
      </div>
    </div>
    <div class="loginBox" v-else>
      <h2>{{isLogin==2?'注 册':'重置密码'}}</h2>
      <input focus v-model=form.email placeholder="请输入邮箱"></input>
      <div class="two">
        <div><input v-model=form.code type="number" placeholder="请输入验证码"></input></div>
        <div><button @click="sendCode" :class="{lock:!!codeTime}">{{codeTime?codeTime+'s':'发送验证码'}}</button></div>
      </div>
      <input type="password" v-model=form.password placeholder="请输入密码"></input>
      <button @click="register" v-if="isLogin==2">注 册</button>
      <button @click="changepwd" v-if="isLogin==3">确 定</button>
      <div class="note"><span></span><span @click=changeTab(1)>去登录</span></div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form:{
        email:null,
        password:null,
        code:null
      },
      isLogin:1, //1 登录 2注册 3找回密码，
      codeTime:0,
      setInterval:null,
    }
  },
  props:{
    value:{
      type:Boolean,
      default:false
    }
  },
  created(){
    
  },
  methods:{
    changeTab(e){
      this.isLogin=e
      this.form={
        email:null,
        password:null,
        code:null
      }
      clearInterval(this.setInterval)
      this.codeTime=0
    },
    sendCode(){
      if(this.isLogin==1){return false}
      if(this.codeTime){return false}
      if(!this.form.email){
        this.$toast({
          icon:require('@/assets/image/error_icon.png'),
          msg:'请输入邮箱'
        })
        return false
      }
      let type=this.isLogin==2?'reg':'pwd'
      this.$ajax({
        method:'post',
        url:'/account/sendCode',
        data:{email:this.form.email,type:type}
      }).then(res=>{
        this.codeTime=59
        this.setInterval=setInterval(()=>{
          if(this.codeTime){
            this.codeTime--
          }else{
            clearInterval(this.setInterval)
          }
        },1000)
      })
    },
    register(){
      if(this.isLogin!=2){return false}
      if(!this.form.email){
        this.$toast({
          icon:require('@/assets/image/error_icon.png'),
          msg:'请输入邮箱'
        })
        return false
      }
      if(!this.form.code){
        this.$toast({
          icon:require('@/assets/image/error_icon.png'),
          msg:'请输入验证码'
        })
        return false
      }
      if(!this.form.password){
        this.$toast({
          icon:require('@/assets/image/error_icon.png'),
          msg:'请输入密码'
        })
        return false
      }
      this.$ajax({
        method:'post',
        url:'/account/register',
        data:this.form
      }).then(res=>{
        this.$store.commit('changelogin',true)
        this.$emit('login')
      })
    },
    changepwd(){
      if(this.isLogin!=3){return false}
      if(!this.form.email){
        this.$toast({
          icon:require('@/assets/image/error_icon.png'),
          msg:'请输入邮箱'
        })
        return false
      }
      if(!this.form.code){
        this.$toast({
          icon:require('@/assets/image/error_icon.png'),
          msg:'请输入验证码'
        })
        return false
      }
      if(!this.form.password){
        this.$toast({
          icon:require('@/assets/image/error_icon.png'),
          msg:'请输入密码'
        })
        return false
      }
      this.$ajax({
        method:'post',
        url:'/account/changepwd',
        data:this.form
      }).then(res=>{
        this.changeTab(1)
      })
    },
    login(){
      if(!this.form.email){
        this.$toast({
          icon:require('@/assets/image/error_icon.png'),
          msg:'请输入邮箱'
        })
        return false
      }
      if(!this.form.password){
        this.$toast({
          icon:require('@/assets/image/error_icon.png'),
          msg:'请输入密码'
        })
        return false
      }
      this.$ajax({
        method:'post',
        url:'/account/login',
        data:{email:this.form.email,password:this.form.password}
      }).then(res=>{
        this.$store.commit('changelogin',true)
        this.$emit('login')
      })
    }
  }
}
</script>
<style scoped>
.login{
  position:fixed;top:0;left:0;
  z-index: 10000;
  height: 100%;width:100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.loginBox{
  margin-top: -2.666667rem;
  width: 6.4rem;
  background: #fff;
  border-radius: 0.133333rem;
  padding: 0.533333rem;
  box-sizing: content-box;
}
.loginBox h2{
  text-align: center;
  font-size: 16px
}
.login input{
  margin-top: 0.266667rem;
  height: 1.173333rem;
  padding: 0 0.266667rem;
  border:1px solid #ccc;
  border-radius: 0.106667rem;
  font-size: 14px;
  width: 100%;
  outline: none;
  display: block;
  appearance: none;
  box-sizing: border-box;
}
.login button{
  width: 100%;
  margin-top: 0.533333rem;
  height: 1.173333rem;
  appearance: none;
  font-size: 16px;
  color: #fff;
  background: #1AAD19;
  border: none;
  outline: none;
  border-radius: 5px;
  display: block
}
.loginBox .two{
  display: flex;
  justify-content: space-between;
}
.loginBox .two div{
  width: 47.5%
}
.loginBox .two button{
  margin-top: 0.266667rem;
  font-size: 14px
}
.loginBox .two button.lock{
  background: #ccc
}
.login .note{
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  color: #03A9F4;
  margin-top: 0.266667rem;
}
</style>
