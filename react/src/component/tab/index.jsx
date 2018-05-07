import React, { Component } from 'react';
import {Link } from 'react-router-dom'
import styles from './index.css'
class Tab extends Component {
	constructor() {
    super();
    this.state={
    	path:'/'
    }
  };
  componentDidMount(){
  	this.setState({
  		path:this.props.path
  	})
  };
  render() {
    return (
    	<div className={styles.tab}>
		    	{
		    		this.state.path==='/'?
		    		(
		    			<div className={styles.box}>
		    				<div>
					        <img src={require("../../assets/image/list_icon.png")} alt=""/>
					        <p>明细</p>
					      </div>
					      <Link to="/count">
					        <img src={require("../../assets/image/count_icon.png")} alt=""/>
					        <p>统计</p>
					      </Link>
		    			</div>
		    		):(
		    			<div className={styles.box}>
			    			<Link to="/">
					        <img src={require("../../assets/image/list_icon.png")} alt=""/>
					        <p>明细</p>
					      </Link>
					      <div>
					        <img src={require("../../assets/image/count_icon.png")} alt=""/>
					        <p>统计</p>
					      </div>
				      </div>
		    		)
		    }
		    <Link to="/add" className={styles.add}>
		      <img src={require("../../assets/image/add_icon.png")} alt=""/>
		    </Link>
		  </div>
    )
  }
}

export default Tab