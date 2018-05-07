import React from 'react';
import ReactDOM from 'react-dom';
import toastComponent from './index.jsx'
export default function toast(options={}) {
	return new Promise((resolve,reject)=>{
		const div = document.createElement('div');
	  document.body.appendChild(div);
	  options=Object.assign({
	  	icon:null,
	  	msg:null,
	  	time:1500
	  },options)
	  if(options.time){
	  	setTimeout(()=>{
	  		ReactDOM.unmountComponentAtNode(div);
      	document.body.removeChild(div);
      	resolve()
	  	},options.time)
	  }
		const component = React.createElement(toastComponent,options);
	  ReactDOM.render(component, div);
	})
}