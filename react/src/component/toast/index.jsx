import React, { Component } from 'react';
import styles from './index.css'
class toast extends Component {
	constructor() {
    super();
    this.state={
      activeClass:null
    }
  };
  componentDidMount(){
  	this.setState({
  		activeClass:'active'
  	})
  };
  close(){

  };
  render() {
    return (
    	<div className={styles.toast}>
		    <div className={styles['toast-box']+' '+(this.state.activeClass&&styles[this.state.activeClass])}>
		    	{
		    		this.props.icon&&
		    		<img src={this.props.icon} alt={this.props.msg} />
		    	}
		      <p>{this.props.msg}</p>
		    </div>
		  </div>
    )
  }
}

export default toast