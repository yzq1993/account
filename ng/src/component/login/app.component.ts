import { Component,Input,Output, EventEmitter} from '@angular/core';
import { Http } from '@angular/http'; // (1)
import 'rxjs/add/operator/map'; // (2)
import { toastService } from '../toast/app.service';
@Component({
	selector: 'i-login',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class LoginComponent {
	@Input() value:boolean= false;
	@Output() login= new EventEmitter<number>();
  form={
    email:null,
    password:null,
    code:null
  };
  isLogin=1; //1 登录 2注册 3找回密码，
  codeTime=0;
  setInterval=null;
  constructor(
    private http: Http,
    private toast: toastService,
  ){};
  changeTab(e){
    this.isLogin=e
    this.form={
      email:null,
      password:null,
      code:null
    }
    clearInterval(this.setInterval)
    this.codeTime=0
  };
  sendCode(){
    if(this.isLogin==1){return false}
    if(this.codeTime){return false}
    if(!this.form.email){
      this.toast.show({
        icon:'../../assets/image/error_icon.png',
        msg:'请输入邮箱'
      })
      return false
    }
    let type=this.isLogin==2?'reg':'pwd'
    this.http.post('/account/sendCode',{email:this.form.email,type:type}).map(res => res.json()).subscribe(res=> {
      this.codeTime=59
      this.setInterval=setInterval(()=>{
        if(this.codeTime){
          this.codeTime--
        }else{
          clearInterval(this.setInterval)
        }
      },1000)
    })
  };
  register(){
    if(this.isLogin!=2){return false}
    if(!this.form.email){
      this.toast.show({
        icon:'../../assets/image/error_icon.png',
        msg:'请输入邮箱'
      })
      return false
    }
    if(!this.form.code){
      this.toast.show({
        icon:'../../assets/image/error_icon.png',
        msg:'请输入验证码'
      })
      return false
    }
    if(!this.form.password){
      this.toast.show({
        icon:'../../assets/image/error_icon.png',
        msg:'请输入密码'
      })
      return false
    }
    this.http.post('/account/register',this.form).map(res => res.json()).subscribe(res=> {
      this.login.emit();
    })
  };
  changepwd(){
    if(this.isLogin!=3){return false}
    if(!this.form.email){
      this.toast.show({
        icon:'../../assets/image/error_icon.png',
        msg:'请输入邮箱'
      })
      return false
    }
    if(!this.form.code){
      this.toast.show({
        icon:'../../assets/image/error_icon.png',
        msg:'请输入验证码'
      })
      return false
    }
    if(!this.form.password){
      this.toast.show({
        icon:'../../assets/image/error_icon.png',
        msg:'请输入密码'
      })
      return false
    }
    this.http.post('/account/changepwd',this.form).map(res => res.json()).subscribe(res=> {
      this.changeTab(1)
    })
  };
  gologin(){
    if(!this.form.email){
      this.toast.show({
        icon:'../../assets/image/error_icon.png',
        msg:'请输入邮箱'
      })
      return false
    }
    if(!this.form.password){
      this.toast.show({
        icon:'../../assets/image/error_icon.png',
        msg:'请输入密码'
      })
      return false
    }
    this.http.post('/account/login',{email:this.form.email,password:this.form.password}).map(res => res.json()).subscribe(res=> {
    	this.login.emit();
    })
  }
}

