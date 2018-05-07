import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { HashRouter , Route  } from 'react-router-dom'

import index from './pages/index/index.jsx';
import add from './pages/add/index.jsx';
import count from './pages/count/index.jsx';
import FastClick from './assets/fastclick'

document.addEventListener('DOMContentLoaded', function() {  
    FastClick.attach(document.body);
}, false);

ReactDOM.render((
	<HashRouter>
		<div>
			<Route path="/" exact component={index}/>
			<Route path="/add" component={add} />
			<Route path="/edit/:id" component={add} />
			<Route path="/count" component={count} />
		</div>
  </HashRouter>
), document.getElementById('root'));

