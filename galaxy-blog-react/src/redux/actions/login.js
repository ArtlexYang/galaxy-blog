import { ADDUSERTOKEN, ADDUSERINFO, DELUSER } from '../constant'

// 同步action，就是指action的值为Object类型的一般对象
export const addUserToken = data => ({type:ADDUSERTOKEN,data})
export const addUserInfo = data => ({type:ADDUSERINFO,data})
export const delUser = data => ({type:DELUSER,data})