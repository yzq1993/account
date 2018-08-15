import React, { Component } from 'react';
import styles from './index.css'
class picker extends Component {
	constructor() {
    super();
    this.state = {
    	show:true,
			title:'请选择',
			value:[],
			option:[],
			activeClass:null,
			closetext:'关 闭',
			oktext:'确 定',
			topStyle:[],
			start:{
				top:'',
				style:'',
				move:'',
				value:''
			},
			endClass:[],
			height:35
    }
    this.initTop=this.initTop.bind(this)
    this.success=this.success.bind(this)
    this.close=this.close.bind(this)
    this.end=this.end.bind(this)
    this.scrollTop=this.scrollTop.bind(this)
  };
  componentDidMount(){
  	document.body.style.overflowY = 'hidden'
		this.initTop()
		setTimeout(()=>{
			this.setState({
				activeClass:'active'
			})
		},0)
		this.setState({
			option:this.props.option,
			value:this.props.value
		})
  };
  initTop(){
		let m,arr;
		this.props.value.forEach( (value, index) =>{
			if(!this.props.option[index]){return false}
			m=this.props.option[index].findIndex(v=>v==value)
			if(m===-1){console.log('默认值设置错误');return false}
			arr=this.state.topStyle
			arr[index]=-m*this.state.height
			this.setState({
				topStyle:arr
			})
		});
	};
	success(event){
		this.end(true)
		event.preventDefault()
	};
	close(event){
		this.end(false)
		event.preventDefault()
	};
	end(status){
		document.body.style.overflowY = 'auto'
		this.setState({
			show:false
		})
		if(this.props.value.length===1){
			this.props.callback(status,this.props.value[0])
		}else{
			this.props.callback(status,this.props.value)
		}
	};
	touchstart(event,index){
		let arr=this.state.endClass
		arr[index]=''
		this.setState({
			endClass:arr,
			start:{
				top:event.targetTouches[0].pageY,
				style:-this.state.topStyle[index],
				value:this.state.value[index]
			}
		})
		event.preventDefault()
	};
	touchmove(event,index){
		let arr=this.state.topStyle,
			move=event.targetTouches[0].pageY
		arr[index]=-(this.state.start.style+this.state.start.top-move)
		this.setState({
			start:Object.assign(this.state.start,{move:move}),
			topStyle:arr
		})
		event.preventDefault()
	};
	touchend(event,index){
		let h=-this.state.topStyle[index],len=this.state.option[index].length-1
		let endClass=this.state.endClass,
			topStyle=this.state.topStyle,
			value=this.state.value;
		endClass[index]=styles.end
		if(h<=0){
			topStyle[index]=0
			value[index]=this.state.option[index][0]
		}else if(h>this.state.height*len){
			topStyle[index]=-this.state.height*len
			value[index]=this.state.option[index][len]
		}else{
			let m;
			if(h%this.state.height>=this.state.height/2){
				m=Math.ceil(h/this.state.height)
			}else{
				m=Math.floor(h/this.state.height)
			}
			topStyle[index]=-this.state.height*m
			value[index]=this.state.option[index][m]
		}
		this.setState({
			endClass:endClass,
			topStyle:topStyle,
			value:value
		})
		if(this.state.start.value!==this.state.value[index]&&typeof this.props.change ==='function'){
			if(this.state.value.length===1){
				this.props.change(this.state.value[0],Number(index),this)
			}else{
				this.props.change(this.state.value,Number(index),this)
			}
		}
		event.preventDefault()
	};
	scrollTop(index,value){
		let m=this.state.option[index].indexOf(value)
		let topStyle=this.state.topStyle,
			valueItem=this.state.value;
		topStyle[index]=-this.state.height*m
		valueItem[index]=value
		this.setState({
			topStyle:topStyle,
			value:valueItem
		})
	};
  render() {
    return (
    	<div>
    	{
    		this.state.show&&
	    	<div className={styles['am-picker']}>
			  	<div className={styles['am-shade']} onClick={this.close}></div>
			  	<div className={styles['am-box']+' '+styles[this.state.activeClass]}>
			  		<div className={styles['am-head']}>
			  			<input type="button" value={this.state.closetext} onClick={this.close}/>
			  			<h2>{this.props.title}</h2>
			  			<input type="button" value={this.state.oktext} onClick={this.success}/>
			  		</div>
			  		<div className={styles['am-ul']}>
			  			{
			  				this.state.option.map((item,m)=>
			  					<div className={styles['am-item']} onTouchMove={e=>this.touchmove(e,m)} onTouchStart={e=>this.touchstart(e,m)} onTouchEnd={e=>this.touchend(e,m)} key={m}>
			  						<ul style={{transform: 'translate3d(0px, '+this.state.topStyle[m]+'px, 0px)'}} className={this.state.endClass[m]}>
			  							{
			  								item.map((val,n)=>
			  									<li className={val===this.state.value[m]?styles.active:''} key={n}>{val}</li>
			  								)
			  							}
			  						</ul>
			  					</div>
			  				)
			  			}
							<div className={styles['am-high']}></div>
						</div>
			  	</div>
			  </div>
			}
			</div>
    )
  }
}
export default picker;
