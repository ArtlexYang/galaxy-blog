/**
* 1.该文件是用于创建一个为Login组件服务的reducer，reducer的本质就是一个函数
* 2.reducer函数会接到两个参数，分别为：之前的状态(preState)，动作对象(action)
*/
import { ADDUSERTOKEN, ADDUSERINFO, DELUSER } from '../constant'

// 初始化状态
const initState = {
  "userToken":
    sessionStorage.getItem('userToken')!==null
    ? sessionStorage.getItem('userToken')
    : null,
  "userInfo":
    sessionStorage.getItem('userInfo')!==null
    ? JSON.parse(sessionStorage.getItem('userInfo'))
    : null,
}

// 空信息
const cleanState = {
  "userToken": null,
  "userInfo": null,
}

export default function countReducer(preState=initState, action){
  // 根据type决定如何加工数据
  // ！！！多用户下注意xss攻击！！！
  switch (action.type) {
    case ADDUSERTOKEN:  // 添加用户Token
      sessionStorage.setItem('userToken', action.data);
      return {...preState, ...{userToken: action.data}}
    case ADDUSERINFO:  // 添加用户信息
      sessionStorage.setItem('userInfo', JSON.stringify(action.data));
      return {...preState, ...{userInfo: action.data}}
    case DELUSER:  // 清空用户所有信息
      sessionStorage.removeItem('userToken');
      sessionStorage.removeItem('userInfo');
      return cleanState
    default:  // 初始化的时候调用此兜底
      return preState
 }
}
