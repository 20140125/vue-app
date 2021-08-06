import axios from 'axios/index'
import { ElMessage } from 'element-plus'
import store from '@/store'
import router from '@/route/index.js'
import URLS from '@/api/urls'

const TIMEOUT = 0
const instance = axios.create({
    timeout: TIMEOUT,
    headers: {
        common: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    }
})
instance.defaults.baseURL = URLS.baseURL
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
    if(!store.state.token && [401, 500].indexOf(error.response.status) > -1) {
        router.push({path: '/login'}).then(() => { console.log(error) })
    } else {
        ElMessage.error(error.response.status === 403 ? 'Permission denied login system' : 'network error, please try again later')
        return Promise.reject({
            code: error.response.status,
            message: error.response.status === 403 ? 'Permission denied login system' : 'Network error, Please try again later',
            item: error
        })
    }
})
export default instance
