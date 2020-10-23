import axios from 'axios/index'
import store from '../store'
import router from '../router'
import func from './func'
import {Message} from "element-ui";
import it from "element-ui/src/locale/lang/it";

/**
 * todo：请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param msg
 * @param url
 */
const errorHandle = (status,msg,url) => {
    // 状态码判断
    switch (status) {
             // 401: 未登录状态，跳转登录页
        case 401:
            store.commit('setToken','');
            router.push({path:'/login'});
            Message.warning(msg);
            break;
            // 没有权限访问
        case 403:
            let tabs = store.state.tabs.tabs,key = 0;
            tabs.map((item,index)=>{
               if (item.name === window.location.pathname) {
                   key = index
                   return tabs.splice(index,1)
               }
            });
            let nextTab = tabs[key + 1] || tabs[key - 1];
            store.commit('setCurrTabs',nextTab)
            router.push({path:nextTab.name});
            Message.warning(msg);
            break;
            // 404请求不存在
        case 404:
            router.push({path:'/404'});
            Message.warning(msg);
            break;
        default:
            Message.error('network error, please try again later');
            break;
    }
};
const instance = axios.create({ timeout:0 });
instance.defaults.baseURL = process.env.API_ROOT;
// http request 拦截器
instance.interceptors.request.use(config=>{
    let token = store.state.login.token ? store.state.login.token : localStorage.getItem('token');
    if (token){
        config.headers.Authorization = `${func.set_password(func.set_random(32),func.set_random(12))}${token}${func.set_password(func.set_random(32),func.set_random(12))}`
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
    console.log(error.response.data);
    errorHandle(error.response.data.code,error.response.data.msg,error.response.data.url);
});
export default instance;
