import React from 'react';
import ReactDOM from 'react-dom';
import pickerComponent from './index.jsx'
export default function picker(options={}) {
	return new Promise((resolve,reject)=>{
		const div = document.createElement('div');
	  document.body.appendChild(div);
	  options.title=options.title||'请选择'
	  options.callback=(status,value)=>{
			if(status){
				resolve(value)
			}else{
				reject(value)
			}
			ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
		}
		if(options.option[0].constructor!==Array){
			let m=options.option
			options.option=[]
			options.option[0]=m
		}
		if(typeof options.value!=='undefined'&&options.value.constructor!==Array){
			options.value=[options.value]
		}else if(typeof options.value==='undefined'||options.value.length===0){
			options.value=[]
			options.option.forEach(function(value, index) {
				options.value[index]=value[0]
			});
		}
		const component = React.createElement(pickerComponent,options);
	  ReactDOM.render(component, div);
	})
}