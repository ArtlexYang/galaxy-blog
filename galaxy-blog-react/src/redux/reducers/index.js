/**
* 该文件用于汇总所有的reducer为一个总的reducer
*/
// 引入combineReducers，用于汇总多个reducer
import {combineReducers} from 'redux'
// 引入为Login组件服务的reducer
import login from './login'

// 汇总所有的reducer变为一个总的reducer（这里规定了store中的key）
export default combineReducers({
	login
})