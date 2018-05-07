import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state:{
		isLogin:true
	},
	mutations:{
		changelogin(state,data){
			state.isLogin=data
		},
	}
})
export default store