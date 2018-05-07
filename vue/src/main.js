// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/fastclick'
import ajax from '@/assets/ajax'
import {datepicker} from '@/vue-picker'
import store from '@/store'
Vue.config.productionTip = false
document.addEventListener('DOMContentLoaded', function() {  
    FastClick.attach(document.body);
}, false);
/* eslint-disable no-new */

Vue.prototype.$datepicker = datepicker
import toastComponents from '@/components/toast'
Vue.prototype.$toast = (options)=>{
	return new Promise((resolve, reject)=>{
		let toast = Vue.extend(toastComponents);
		if(typeof options =='string'){
			options={msg:options}
		}
		options.callback=resolve
		let instance=new toast({
		    data: options
		});
		instance.$mount();
		document.body.appendChild(instance.$el);
	})
};
Vue.use(ajax)
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
