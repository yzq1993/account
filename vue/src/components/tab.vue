<template>
  <div class="tab">
    <div class="box">
      <router-link v-if="$route.path!='/'" to="/">
        <img src="../assets/image/list_icon.png">
        <p>明细</p>
      </router-link>
      <div v-else>
        <img src="../assets/image/list_icon.png">
        <p>明细</p>
      </div>
      <router-link v-if="$route.path=='/'" to="/count">
        <img src="../assets/image/count_icon.png">
        <p>统计</p>
      </router-link>
      <div v-else>
        <img src="../assets/image/count_icon.png">
        <p>统计</p>
      </div>
    </div>
    <router-link to="/add" class="add">
      <img src="../assets/image/add_icon.png">
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active:null,
    }
  },
  created(){
    
  }
}
</script>
<style scoped>
.tab{
  position: fixed;bottom:0;left: 0;
  z-index: 10;
  width: 10.0rem;
  height: 1.173333rem;
  background: #f7f7fa;
}
.tab .box{
  display: flex;
  border-top:1px solid #ceced1;
  align-items: center
}
.tab .box a,.tab .box div{
  flex:1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-decoration: none
}
.tab .box img{
  margin-top: 0.066667rem;
  width:0.533333rem;height: 0.533333rem;
}
.tab .box p{
  font-size:14px;
  margin: 0;
  color: #333;
  
}
.tab .add{
  position: fixed;bottom:0;left:50%;
  z-index: 10;
  transform: translateX(-50%);
  width: 1.333333rem;
  height: 1.333333rem;
  border-radius: 50%;
  border-top:1px solid #ccc;
  background: #f7f7fa;
  padding: 0.133333rem;
}
.tab .add img{
  width: 100%;height: 100%
}
</style>
