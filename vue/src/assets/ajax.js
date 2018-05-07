import axios from 'axios'
export default (Vue,options)=>{
	Vue.prototype.$ajax =function(options){
		return new Promise((resolve, reject)=>{
			axios(options).then((e)=>{
				if(e.status>400||e.data.code>400){
					this.$toast({
	          icon:require('@/assets/image/error_icon.png'),
	          msg:'程序出错'
	        })
					return false
				}
				if(e.data.code==203){
					this.$store.commit('changelogin', false)
					return false
				}
				if(e.data.code==400){
					this.$toast({
	          icon:require('@/assets/image/error_icon.png'),
	          msg:e.data.error
	        })
					return false
				}
				resolve(e.data.data||e.data)
			})
		})
	}
}