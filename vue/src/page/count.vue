<template>
	<div class="main">
		<div class="select">
      <div class="picker" @click=changeDate>
        {{now.year}}年{{now.month}}月<img src="../assets/image/arrow_down.png"></img>
      </div>
	    <div class="switch">
	      <div>
	        <p :class="type==1?'active':''" @click="changeType(1)">支出</p>
	        <p :class="type==2?'active':''" @click="changeType(2)">收入</p>
	      </div>
	    </div>
	  </div>
	  <div class="table_head" v-if="type==1">
	    <div>总支出：{{defray|toFixed(2)}} 元</div>
	    <div>每日平均：{{defray/30|toFixed(2)}} 元</div>
	  </div>
	  <div class="table_head" v-if="type==2">
	    <div>总收入：{{income|toFixed(2)}} 元</div>
	    <div>每日平均：{{income/30|toFixed(2)}} 元</div>
	  </div>
	  <div class="list">
	    <div class="title">排行榜</div>
	    <div class="item" v-for="item in list">
	      <div class="icon">
	        <img :src="item.icon"></img>
	        <span>{{item.name}}</span>
	      </div>
	      <p>{{item.money|toFixed(2)}}</p>
	    </div>
	  </div>
		<i-tab></i-tab>
	</div>
</template>
<script>
import tab from '@/components/tab.vue'
import typeList from '@/assets/type'
export default{
	data(){
		return {
			type:1,//1支出 2收入
	    now: {
	      year: null,
	      month: null,
	    },
	    income:0,
	    defray:0,
	    list:[]
		}
	},
	created(){
		this.setDate()
    this.setList()
	},
	components:{'i-tab':tab},
	filters:{
		toFixed(val,num){
			return (+val).toFixed(2)
		}
	},
	methods:{
		setList(){
	    this.$ajax({
	      method: 'get',
	      url: '/account',
	      params: { year: this.now.year, month: this.now.month,type:this.type}
	    }).then(row=>{
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
	  changeType(type) {
	  	this.type=type
	    this.setList()
	  },
	  setDate(){
	    let now = new Date()
	    this.now={
	    	year: now.getFullYear(),
	      month: now.getMonth() + 1,
	    }
	  }
	}
	
}
</script>
<style scoped>
.select{
  position: fixed;top:0;left:0;
  width:10rem;
}
.select .picker{
  background: #03A9F4;
  color:#fff;
  height: 1.173333rem;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center
}
.select .picker img{
  height: 0.4rem;width:0.4rem;
  margin-left: 5px;
}
.select .switch{
  height: 1.173333rem;
  display: flex;
  background: #fff;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f1f1f1;
}
.select .switch div{
  font-size: 16px;
  height: 0.666667rem;
  width: 3.2rem;
  border:1px solid #03A9F4;
  display: flex;
  align-items: center;
  border-radius: 5px;
}
.select .switch p{
  flex:1;
  font-size: 16px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center
}
.select .switch .active{
  background: #03A9F4;
  color:#fff;
}
.table_head{
  margin-top:2.346667rem;
  border-bottom: 1px solid #f1f1f1;
  padding: 0.133333rem 0.4rem;
  line-height: 0.533333rem;
  font-size: 14px;
}
.list .title{
  display: flex;
  align-items: center;
  padding: 0 0.4rem;
  height: 1.173333rem;
  border-bottom:1px solid #f1f1f1;
  font-size: 16px;
}
.list .item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.4rem;
  height: 1.173333rem;
  border-bottom:1px solid #f1f1f1;
  font-size: 16px;
}
.list .item.del{
  transform: translateX(-2.0rem)
}
.list .item img{
  height: 0.533333rem;width: 0.533333rem;
  vertical-align: middle;
  margin-right: 0.2rem
}
</style>