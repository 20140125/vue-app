import axios from 'axios/index'
import { ElMessage } from 'element-plus';
import store from '../store'

/**
 * todo：请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param msg
 * @param url
 */
// const errorHandle = (status, msg, url) => {
//     // 状态码判断
//     switch (status) {
//
//     }
//     if (status === 401) {
//         // store.commit('setToken', '')
//         // router.push({ path: '/login' })
//         ElMessage.warning(msg)
//     } else if (status === 403) {
//         // let tabs = store.state.tabs.tabs
//         // let key = 0
//         // tabs.map((item, index) => {
//         //     if (item.name === window.location.pathname) {
//         //         key = index
//         //         return tabs.splice(index, 1)
//         //     }
//         // })
//         // let nextTab = tabs[key + 1] || tabs[key - 1]
//         // store.commit('setCurrTabs', nextTab)
//         // router.push({path: nextTab.name})
//         ElMessage.warning(msg)
//     } else if (status === 404) {
//         // router.push({path: '/404'})
//         ElMessage.warning(msg)
//     } else {
//         ElMessage.error('network error, please try again later')
//     }
// }
const TIMEOUT = 10000

const instance = axios.create({
    timeout: TIMEOUT,
    headers: {
        common: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    }
})
instance.defaults.baseURL = process.env.NODE_ENV !== 'production' ? 'http://www.laravel.com/api' : 'https://www.fanglonger.com/api'
// http request 拦截器
instance.interceptors.request.use(config => {
    let token = store.state.login.token ? store.state.login.token : localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = token
    }
    return config
}, error => {
    return Promise.reject(error)
})
// http response 拦截器
instance.interceptors.response.use(response => {
    response.data.item.code !== 20000 ? ElMessage.warning(response.data.item.message) : (response.data.item.message !== 'successfully' ? ElMessage.success(response.data.item.message) : '')
    return response
}, error => {
    console.log(error.response.data)
   // errorHandle(error.response.data.code, error.response.data.msg, error.response.data.url)
})
export default instance
