<template>
  <div class="toast">
    <div class="toast-box" :class=activeClass>
      <img v-if=icon :src=icon>
      <p v-html="msg"></p>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      icon:null,
      msg:null,
      time:2000,
      activeClass:null
    }
  },
  created(){
    if(this.time){
      setTimeout(()=>{
        this.close()
      },this.time)
    }
  },
  mounted(){
    this.activeClass='active'
  },
  methods:{
    close(){
      if(typeof this.callback == 'function'){
        this.callback()
      }
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    }
  }
}
</script>
<style scoped>
.toast{
  position: fixed;top:0;left:0;
  height: 100%;width:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000
}
.toast-box{
  background: rgba(0,0,0,0.65);
  border-radius: 3px;
  padding:10px;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: scale(0,0);
  transition: transform 0.1s;
}
.toast-box.active{
  transform: scale(1,1);
}
.toast-box p{
  margin:0;padding:0;
  color:#fff;
  font-size: 14px
}
.toast-box img{
  height: 50px;width:50px;
  display: block;
}
</style>
