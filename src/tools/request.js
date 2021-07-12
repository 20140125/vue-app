import axios from 'axios/index'
import { ElMessage } from 'element-plus';
import store from '@/store'

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
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    }
})
instance.defaults.baseURL = process.env.NODE_ENV !== 'production' ? 'http://www.laravel.com/api' : 'https://www.fanglonger.com/api'
// http request 拦截器
instance.interceptors.request.use(config => {
    config.headers.Authorization = store.state.token || ''
    return config
}, error => {
    return Promise.reject(error)
})
// http response 拦截器
instance.interceptors.response.use(response => {
    if (response.data.item.code !== 20000) {
        ElMessage.warning(response.data.item.message)
        return Promise.reject(response)
    }
    try {
        response.data.item.message !== 'successfully' ? ElMessage.success(response.data.item.message) : ''
        return Promise.resolve(response)
    } catch (error) {
        return Promise.reject(error)
    }
}, error => {
    ElMessage.success('network error, please try again later')
    return Promise.reject({ code: error.response.data.code, message: 'network error, please try again later', item: error })
})
export default instance
