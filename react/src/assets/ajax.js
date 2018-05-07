import axios from 'axios'
import toast from '../component/toast'
export default (options)=>{
	return new Promise((resolve, reject)=>{
		axios(options).then((e)=>{
			if(e.status>400||e.data.code>400){
				return false
			}
			if(e.data.code===400){
				toast({
          icon:require('./image/error_icon.png'),
          msg:e.data.error
        })
				return false
			}
			resolve(e.data)
		})
	})
}