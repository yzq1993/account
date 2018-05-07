<template>
<div class="container">
  <div class="back" @click="$router.back()"><img src="../assets/image/arrow_down.png"></div>
  <div class="typeswitch">
    <div>
      <p :class="type==1?'active':''" @click="changeType(1)">支出</p>
      <p :class="type==2?'active':''" @click="changeType(2)">收入</p>
    </div>
  </div>
  <div class="typelist">
    <div v-for="(item,index) in typeList" :key="index" class="item" :class="index==active?'active':''" @click="changeActive(index)">
      <div class="icon"><img :src="index==active?item.activeIcon:item.icon"></div>
      <p>{{item.name}}</p>
    </div>
  </div>
  <div class="keyboard">
    <div class="head">
      <div class="remark"><span>备注：</span><input v-model="remark" @input=changeRemark></div>
      <div>{{money}}</div>
    </div>
    <div class="box">
      <div class="num">
        <div @click="setMoney('7')">7</div>
        <div @click="setMoney('8')">8</div>
        <div @click="setMoney('9')">9</div>
        <div @click="setMoney('4')">4</div>
        <div @click="setMoney('5')">5</div>
        <div @click="setMoney('6')">6</div>
        <div @click="setMoney('1')">1</div>
        <div @click="setMoney('2')">2</div>
        <div @click="setMoney('3')">3</div>
        <div @click="setMoney('.')">.</div>
        <div @click="setMoney('0')">0</div>
        <div @click="cancelMoney"><img src="../assets/image/cancel_icon.png"></img></div>
      </div>
      <div class="other">
        <div class="picker" @click=changeDate>
          {{date==now?'今天':date}}
        </div>
        <div class="done" @click="done">完 成</div>
      </div>
    </div>
  </div> 
</div>
</template>
<script>
import typeList from '@/assets/type'
import {formatTime} from '@/assets/util'
export default{
	data(){
		return {
			id:null,
	    type:1,//1支出 2收入
	    now: formatTime(new Date()),
	    date: formatTime(new Date()),
	    typeList: [],
	    active:0,
	    money:0,
	    remark:null
		}
	},
	created(){
		this.typeList=typeList.filter(v=>v.type==this.type)
    this.init()
	},
	methods:{
    init(){
      let id=this.$route.query.id
      if(id===undefined){return false}
      this.$ajax({
        method:'get',
        url:'/account',
        params:{id:id}
      }).then(res=>{
        this.id=id
        this.type=res.type
        this.date=res.year+'-'+(res.month<9?'0'+res.month:res.month)+'-'+(res.day<9?'0'+res.day:res.day)
        this.active=typeList.findIndex(v=>v.id==res.icon)
        this.money=res.money
        this.remark=res.remark
      })
    },
		changeType(type){
			this.type=type
			this.active=0
			this.typeList=typeList.filter(v=>v.type==type)
		},
		changeActive(index){
			this.active=index
		},
		changeDate(){
			this.$datepicker({
			  value:this.date.split('-'),
			  type:'date'
			}).then((value)=>{
				this.date=value.join('-')
			})
		},
    changeRemark(){
      if(this.remark.length>8){
        this.$toast({
          icon:require('@/assets/image/error_icon.png'),
          msg:'备注不超过8个字符'
        })
        this.remark = this.remark.slice(0,8)
      }
    },
		setMoney(num){
	    let money = this.money;
	    if (('' + money).indexOf('.') > -1 && (('' + money).split(".")[1].length>1||num == '.')) {
	      return false
	    }
	    if (num == '.'||(num=='0'&&money!=0)||money==='0.'){
	      this.money = money + num
	    }else{
	      this.money = +(money + num)
	    }
	  },
	  cancelMoney(){
	    let str = this.money + ''
	    this.money=str.slice(0, str.length-1)
	  },
		done(){
			let year = this.date.split('-')[0],
	      month = +this.date.split('-')[1],
	      day = +this.date.split('-')[2],
	      money = +this.money;
	    if (money===0){
        this.$toast({
          icon:require('@/assets/image/error_icon.png'),
          msg:'金额不能为0'
        })
	      return false
	    }
	    let icon = typeList.filter(v => v.type == this.type)[this.active].id,
	      data = { year, month,day,money, remark: this.remark, icon, type: this.type }
	    if (this.id===null){
	    	this.$ajax({
	    		method:'post',
	    		url:'/account/add',
	    		data:data
	    	}).then(res=>{
	    		this.$router.back()
	    	})
	    }else{
	    	this.$ajax({
	    		method:'post',
	    		url:'/account/update',
	    		data: {...data,id:this.id},
	    	}).then(res=>{
	    		this.$router.back()
	    	})
	    }
		}
	}
}
</script>
<style scoped>
.back{
  position: fixed;top: 0.293333rem;left: 0.293333rem;
  height: 0.8rem;width: 0.8rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center
}
.back img{
  height: 0.64rem;width: 0.64rem;
  transform: rotate(90deg)
}
.container{
  margin-bottom: 6.0rem
}
.typeswitch{
  height: 1.333333rem;
  display: flex;
  align-items: center;
  justify-content: center
}
.typeswitch div{
  height: 0.8rem;
  width: 4.0rem;
  border:1px solid #03A9F4;
  display: flex;
  align-items: center;
  border-radius: 5px;
}
.typeswitch p{
  flex:1;
  font-size: 16px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center
}
.typeswitch .active{
  background: #03A9F4;
  color:#fff;
}

.typelist{
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.266667rem;
}
.typelist .item{
  width: 2.0rem;
  margin-bottom: 0.266667rem;
}
.typelist .active .icon{
  background: #03A9F4;
}
.typelist .icon{
  height: 1.066667rem;width: 1.066667rem;
  margin:0 auto;
  padding: 0.2rem;
  box-sizing: border-box;
  border:1px solid #666;
  border-radius: 50%
}
.typelist img{
  height: 100%;width:100%;
  display: block
}
.typelist p{
  display: block;
  text-align: center;
  font-size:12px;
  margin-top: 5px;
  color:#333;
}


.keyboard{
  position: fixed;bottom:0;left:0;
  width: 10rem;
  background: #fff;
  z-index: 100
}
.keyboard .head{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.173333rem;
  padding: 0 0.4rem;
  border-top:1px solid #f1f1f1;
  font-size: 14px;
}
.keyboard .remark{
  display: flex;
  align-items: center;
  flex: 1;
}
.keyboard .remark input{
	height: 1rem;
	border: 0;
  outline: none;
  appearance: none;
}
.keyboard .box{
  display: flex;
  font-size: 16px;
}
.keyboard .num{
  width: 7.6rem;
  display: flex;
  flex-wrap: wrap
}
.keyboard .num div{
  width: 2.533333rem;
  height: 1.173333rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left:1px solid #f1f1f1;
  border-top:1px solid #f1f1f1;
  box-sizing: border-box
}
.keyboard .box img{
  width: 1.173333rem;height: 1.173333rem;
}
.keyboard .other{
  flex:1;
  display: flex;
  flex-direction: column;
  border-left:1px solid #f1f1f1;
  border-top:1px solid #f1f1f1;
}
.keyboard .picker{
  height: 1.173333rem;
  font-size:14px;
  display: flex;
  align-items: center;
  justify-content: center
}
.keyboard .done{
  flex:1;
  background: #03A9F4;
  border-top:1px solid #03A9F4;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center
}
</style>