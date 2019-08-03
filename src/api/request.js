import axios from 'axios/index'
import store from '../store'
import router from '../router'
import func from './func'
import {Message} from "element-ui";

/**
 * todo：请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param msg
 */
const errorHandle = (status,msg) => {
    // 状态码判断
    switch (status) {
        // 401: 未登录状态，跳转登录页
        case 401:
            store.commit('setToken','');
            router.push({path:'/login'});
            Message.warning(msg);
            break;
            // 清除token并跳转登录页
        case 403:
            store.commit('setToken','');
            router.push({path:'/login'});
            Message.warning(msg);
            break;
            // 404请求不存在
        case 404:
            Message.warning(msg);
            break;
            //网络错误
        case 504:
            Message.warning(msg);
            break;
        default:
            router.push({path:'/login'});
            console.log(msg);
            break;
    }
};
const instance = axios.create({ timeout:5000 });
instance.defaults.baseURL = process.env.API_ROOT;
// http request 拦截器
instance.interceptors.request.use(config=>{
    if (store.state.login.token){
        config.headers.Authorization = `${func.set_password(func.set_random(32),func.set_random(12))}-${store.state.login.token}-${func.set_password(func.set_random(32),func.set_random(12))}`
    }
    return config
},error=>{
    return Promise.reject(error);
});
// http response 拦截器
instance.interceptors.response.use(response=>{
    if (response.data.code!==200){
        Message.warning(response.data.msg);
    }
    return response
},error=>{
    console.log(error.response);
    errorHandle(error.response.data.code,error.response.data.msg);
});
export default instance;
