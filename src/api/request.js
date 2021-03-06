import axios from 'axios/index'
import store from '../store'
import router from '../router'
import func from './func'
import {Message} from 'element-ui'

/**
 * todo：请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param msg
 * @param url
 */
const errorHandle = (status, msg, url) => {
    // 状态码判断
    if (status === 401) {
        store.commit('setToken', '')
        router.push({path: '/login'})
        Message.warning(msg)
    } else if (status === 403) {
        let tabs = store.state.tabs.tabs
        let key = 0
        tabs.map((item, index) => {
            if (item.name === window.location.pathname) {
                key = index
                return tabs.splice(index, 1)
            }
        })
        let nextTab = tabs[key + 1] || tabs[key - 1]
        store.commit('setCurrTabs', nextTab)
        router.push({path: nextTab.name})
        Message.warning(msg)
    } else if (status === 404) {
        router.push({path: '/404'})
        Message.warning(msg)
    } else {
        Message.error('network error, please try again later')
    }
}
const instance = axios.create({ timeout: 0 })
instance.defaults.baseURL = process.env.API_ROOT
// http request 拦截器
instance.interceptors.request.use(config => {
    let token = store.state.login.token ? store.state.login.token : localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `${func.setPassword(func.setRandom(32), func.setRandom(12))}${token}${func.setPassword(func.setRandom(32), func.setRandom(12))}`
    }
    return config
}, error => {
    return Promise.reject(error)
})
// http response 拦截器
instance.interceptors.response.use(response => {
    if (response.data.code !== 200) {
        Message.warning(response.data.msg)
    }
    return response
}, error => {
    console.log(error.response.data)
    errorHandle(error.response.data.code, error.response.data.msg, error.response.data.url)
})
export default instance
