<template>
	<div class="main">
		<div class="container">
		  <div class="head">
	      <div class="picker box" @click=changeDate>
	        <div class="label">{{now.year}}年</div>
	        <div>{{now.month}}月<img src="../assets/image/arrow_down.png"></div>
	      </div>
		    <div class="box">
		      <div class="label">收入</div>
		      <div>{{finance.income}}</div>
		    </div>
		    <div class="box">
		      <div class="label">支出</div>
		      <div>{{finance.defray}}</div>
		    </div>
		    <div class="box" @click="budget.show=true">
		      <div class="label">剩余预算</div>
		      <div v-if="budget.status==2">{{finance.budget}}</div>
		      <div v-else>未设置</div>
		    </div>
		  </div>
		  <div class="list" v-if="list.length">
		    <div v-for="(item,index) in list" v-if=item.children.length>
		      <div class="item_head">
		        <div class="info" :class="{del:delShow.key==index&&delShow.show}" @touchstart="startMoveItem(index,$event)" @touchend="moveItem(index,$event)">
		          <div>{{item.date}}日</div>
		          <div><p v-if="item.income">收入：{{item.income}}</p><p v-if="item.defray">支出：{{item.defray}}</p></div>
		        </div>
		        <div class="btn" @click="delItem(index)">删除</div>
		      </div>
		      <div class="item" v-for="(child,key) in item.children">
		        <div class="info" :class="{del:delShow.key==(index+'-'+key)&&delShow.show}" @touchstart="startMoveItem(index+'-'+key,$event)" @touchend="moveItem(index+'-'+key,$event)">
		          <div><img :src=child.icon><p class="label">{{child.name}}<span v-if="child.remark">（{{child.remark}}）</span></p></div>
		          <div :class="child.type==2?'add':''">{{child.type==2?'+':''}}{{child.money}}</div>
		        </div>
		        <div class="btn">
		          <router-link :to="'add?id='+child.id">
		            <img src="../assets/image/edit_icon.png">
		          </router-link>
		          <div @click="delItem(index,key)"><img src="../assets/image/del_icon.png"></div>
		        </div>
		      </div>
		    </div>
		  </div>
		</div>
		<div class="setBudget" v-if="budget.show">
		  <div class="setBudgetBox">
		    <div class="title">设置每月预算</div>
		    <input focus type="number" v-model=budget.money></input>
		    <div class="btns">
		      <button type="primary" @click="setbudget">确 定</button>
		      <button @click="cancelbudget">暂不设置</button>
		    </div>
		  </div>
		</div>
		<i-tab></i-tab>
		<i-login @login=init></i-login>
	</div>
</template>
<script>
import tab from '@/components/tab.vue'
import login from '@/components/login.vue'
import typeList from '@/assets/type.js'
export default{
	data(){
		return {
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
	      show:null,
	      start:null
	    },
	    list:[],
	    budget:{
	      show:false,
	      money:null,
	      status:1 //1暂不设置 2已设置
	    }
		}
	},
	components:{'i-tab':tab,'i-login':login},
	created(){
		this.setDate()
		this.init()
		
	},
	methods:{
		init(){
			this.setList()
			this.initbudget()
		},
		setList(){
			this.$ajax({
	      method: 'get',
	      url: '/account',
	      params:{year:this.now.year,month:this.now.month}
	    }).then(res=>{
	    	let filter = res.filter((v, index, arr) => arr.findIndex(m => v.day == m.day) == index).sort((m,n)=>n.day-m.day),
          list = filter.map(v => ({
            date:v.day,
            income:+(res.filter(m=>m.day==v.day&&m.type==2).reduce((m,n)=>m+n.money,0)).toFixed(2),
            defray:+(res.filter(m=>m.day==v.day&&m.type==1).reduce((m,n)=>m+n.money,0)).toFixed(2),
            children:res.filter(m=>m.day==v.day).map(m=>({
              id:m.id,
              money:m.money,
              name:typeList.find(n=>n.id==m.icon).name,
              icon: typeList.find(n => n.id == m.icon).icon,
              day:m.day,
              type:m.type,
              remark:m.remark
            }))
          }))
        let defray = +(list.reduce((m, n) => m + n.defray, 0)).toFixed(2)
        this.list=list
        this.finance={
        	income: +(list.reduce((m, n) => m + n.income,0)).toFixed(2),
        	defray: defray,
        	budget: this.budget.money - defray
	      }
	    })
		},
		setDate(){
			let time=new Date()
			this.now.year=time.getFullYear()
			this.now.month=time.getMonth()+1
		},
		changeDate(){
			this.$datepicker({
			  value:[this.now.year,this.now.month],
			  type:'yearmonth'
			}).then((value)=>{
				this.now.year=value[0]
				this.now.month=value[1]
				this.setList()
			})
		},
		startMoveItem(key,event){
			this.delShow={
				key:key,
				start: event.changedTouches[0].clientX,
				show:false
			}
	  },
	  moveItem(key,event){
	    let move = event.changedTouches[0].clientX;
	    if (this.delShow.key == key && this.delShow.start-move>50){
	    	this.delShow.show=true
	    }
	  },
	  delItem(index,key){
	  	let data
	  	if(key===undefined){
	  		data = { year: this.now.year, month: this.now.month, day:this.list[index].date}
	  	}else{
	  		data = { id: this.list[index].children[key].id}
	  	}
	  	this.$ajax({
	  		method:'post',
	  		url:'/account/delete',
	  		data:data
	  	}).then(res=>{
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
	  },
		initbudget(){
	    this.$ajax({
	      method: 'get',
	      url: '/account/budget',
	    }).then(res=>{
	    	let budget = res.budget,data
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
	  },
		setbudget(){
			let money = +this.budget.money;
	    if (money==0){
	    	this.$toast({
					icon:require('@/assets/image/error_icon.png'),
					msg:'请设置预算'
				}).then(res=>{
					this.budget.money=null
				})
		    
		    return false
	    }
	    this.$ajax({
	      method: 'post',
	      url: '/account/budget',
	      data: { budget:money},
	    }).then(res=>{
	    	this.budget.show=false
      	this.budget.status=2
      	this.finance.budget=+(this.budget.money - this.finance.defray).toFixed(2)
	    })
		},
		cancelbudget(){
			this.$ajax({
				method:'post',
				url:'/account/budget',
				data: { budget: 0 }
			}).then(_=>{
				this.budget={
					show:false,
					money:null,
					status:1
				}
			})
		}
	}
}
</script>
<style scoped>
.head{
  position: fixed;top:0;left:0;
  z-index: 100;
  width: 10rem;
  display: flex;
  text-align: center;
  align-items: center;
  border-bottom: 1px solid #f1f1f1;
  background: #03A9F4; 
  color:#fff;
  height: 1.333333rem;
}
.head .picker{
  width: 2rem;
  flex:0 0 auto;
  position: relative;
  border-right:1px solid #eee
}
.head .picker img{
  height: 0.4rem;width:0.4rem;
  vertical-align: middle
}
.head .box{
  flex:1;
  
  font-size: 16px
}
.head .label{
  font-size: 12px;
  color:#eee;
}
.list{
  margin-top: 1.333333rem;
  margin-bottom: 1.173333rem;
}
.list .item{
  width: 10rem;
  box-sizing: border-box;
  height: 1.173333rem;
  border-bottom:1px solid #f1f1f1;
  font-size: 16px;
  position: relative
}
.list .btn{
  position: absolute;top:0;right:0;
  width: 2.666667rem;height: 100%;
  font-size: 16px;
}
.list .item .btn{
  display: flex
}
.list .btn div,.list .btn a{
  flex:1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff2d55;
}
.list .btn img{
  margin:0 !important
}
.list .btn a{
  background: #03A9F4; 
}
.list .info{
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.4rem;
  background: #fff;
  position: relative;z-index: 10;
  transition: transform 0.4s
}
.list .info.del{
  transform: translateX(-2.666667rem)
}
.list .info div{
	display: flex
}
.list .item img{
  height: 0.533333rem;width: 0.533333rem;
  vertical-align: middle;
  margin-right: 0.2rem
}
.list .item .label span{
  color:#b2b2b2;
  font-size: 13px
}
.list .item .add{
  color:#27C24C;
}
.list .item_head{
  border-bottom:1px solid #f1f1f1;
  height: 0.96rem;
  line-height: 0.96rem;
  font-size: 14px;
  color:#888;
  position: relative
}
.list .item_head .btn{
  text-align: center;
  background: #ff2d55;
  color:#fff;
}
.list .item_head p{
  margin-left: 0.4rem;
}

.setBudget{
  position:fixed;top:0;left:0;
  z-index: 10000;
  height: 100%;width:100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  
}
.setBudgetBox{
  margin-top: -2.666667rem;
  width: 6.4rem;
  background: #fff;
  border-radius: 0.133333rem;
  padding: 0.533333rem;
  box-sizing: content-box;
}
.setBudgetBox .title{
  font-size: 16px;
  text-align: center;
}
.setBudgetBox input{
  margin: 0.266667rem 0 0.533333rem;
  height: 0.8rem;
  padding: 0 0.266667rem;
  border:1px solid #ccc;
  border-radius: 0.106667rem;
  font-size: 16px;
  width: 100%;
  outline: none;
  appearance: none;
}
.setBudgetBox .btns{
  display: flex;
  justify-content: space-between
}
.setBudgetBox button{
  margin:0;
  width: 2.933333rem;
  height: 0.8rem;
  appearance: none;
  border: none;
  background: none;
  font-size: 13px;
  color: #000000;
	background: #F8F8F8;
	border: 1px solid rgba(0, 0, 0, 0.2);
	border-radius: 5px;
}
.setBudgetBox button[type="primary"]{
	color: #fff;
	background: #1AAD19;
	border: none;
}
</style>