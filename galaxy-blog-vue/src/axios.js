import axios from 'axios'
import Element from 'element-ui'
import router from './router'
import store from './store'


// 设置后端端口
axios.defaults.baseURL = "http://localhost:8081"

// 前置拦截
axios.interceptors.request.use(config => {
  return config
})

// 后置拦截
axios.interceptors.response.use(response => {
    let res = response.data;

    console.log("=================")
    console.log(res)
    console.log("=================")

    // 根据状态码决定结果
    if (res.statusCode === 200) {
      return response
    } else {
      // 弹窗异常信息
      Element.Message.error(res.massage, {duration: 3 * 1000})
      // 直接拒绝往下面返回结果信息
      return Promise.reject(response.data.msg)
    }
  },
  error => {
    console.log(error)
    if (error.response.data) {
      error.message = error.response.data.msg
    }
    // 根据请求状态觉得是否登录或者提示其他
    if (error.response.status === 401) {
      // 错误移出登录状态
      store.commit("REMOVE_INFO")
      router.push("/login")
      error.message = '请重新登录';
    } else if (error.response.status === 403) {
      error.message = '权限不足，无法访问';
    }
    Element.Message.error(error.message, {duration: 3 * 1000})
    return Promise.reject(error)
  }
)