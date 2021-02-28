import {axios} from 'axios'

/**
 * axios配置文件
 */

// 设置后端端口
axios.defaults.baseURL = "http://localhost:8081"
// 保存后端传来的cookie
axios.defaults.withCredentials = true
// 默认超时时间1s
axios.defaults.timeout = 1000
// 错误码定义
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

// axios.defaults.headers.common['Authorization'] = res.headers.authorization;

// request拦截器（前置拦截）
axios.interceptors.request.use(
  config => {
    if (axios.defaults.headers.common['Authorization']!=null) {  // 如果Authorization请求头存在，就加入request请求中
      config.headers.Authorization = axios.defaults.headers.common['Authorization'];
    } else if (sessionStorage.getItem('userToken')!==null) {  // 看sessionStorage中有没有已经存储的请求头
      axios.defaults.headers.Authorization = sessionStorage.getItem('userToken');
    } 
    return config;
  },
  error => {
    return Promise.reject(error);
  }
)

// 后置拦截
axios.interceptors.response.use(
  response => {
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
      // store.commit("REMOVE_INFO")
      // router.push("/login")
      error.message = '请重新登录';
    } else if (error.response.status === 403) {
      error.message = '权限不足，无法访问';
    }
    Element.Message.error(error.message, {duration: 3 * 1000})

    return Promise.reject(error);
  }
)