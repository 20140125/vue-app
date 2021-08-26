import axios from 'axios/index';
import {ElMessage} from 'element-plus';
import store from '@/store';
import router from '@/route/index.js';
import URLS from '@/api/urls';

/**
 * todo:错误跳转
 * @param status
 * @param error
 * @return {Promise<never>}
 * @constructor
 */
const ErrorHandler = (status, error) => {
    if (!store.state.token) {
        switch (status) {
            case 401:
                router.push({path: '/login'}).then(() => {
                    ElMessage.error('Unauthenticated login system');
                });
                break;
            case 403:
            case 500:
                router.push({path: '/login'}).then(() => {
                    console.log(error);
                });
                break;
        }
    } else {
        ElMessage.error(status === 403 ? 'Permission denied login system' : 'Network error, please try again later');
        return Promise.reject({
            code: status,
            message: status === 403 ? 'Permission denied login system' : 'Network error, Please try again later',
            item: error
        });
    }
};

const TIMEOUT = 0;
const instance = axios.create({
    timeout: TIMEOUT,
    headers: {
        common: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    }
});
instance.defaults.baseURL = URLS.baseURL;
// http request 拦截器
instance.interceptors.request.use(config => {
    config.headers.Authorization = store.state.token || '';
    config.data.token = store.state.token || '';
    return config;
}, error => {
    return Promise.reject(error);
});
// http response 拦截器
instance.interceptors.response.use(response => {
    if (response.data.item.code !== 20000) {
        ElMessage.warning(response.data.item.message);
        return Promise.reject(response);
    }
    try {
        response.data.item.message !== 'successfully' ? ElMessage.success(response.data.item.message) : '';
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    }
}, error => {
    ErrorHandler(error.response.status, error).then(() => console.log(error));
});
export default instance;
