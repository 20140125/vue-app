import axios from 'axios';
import { ElMessage } from 'element-plus';
import store from '@/store';
import router from '@/route';
import URLS from '@/api/urls';

/* h5固有地址 */
const webURL = [URLS.image.list, URLS.image.config];
/**
 * todo:错误跳转
 * @param response
 */
const ErrorHandler = (response) => {
  if (!store.state.baseLayout.token) {
    return router.push({ path: webURL.includes(response.config.url) ? '/' : '/admin/home/login' }).then(() => {
      ElMessage.error(response.data.item.message);
      window.localStorage.removeItem('token')
      store.commit('UPDATE_MUTATIONS', { errorInfo: response.data.item }, { root: true });
      return Promise.resolve({ errorInfo: response.data.item });
    });
  }
  router.push({ path: webURL.includes(response.config.url) ? '/' : '/admin/result/index' }).then(() => {
    store.commit('UPDATE_MUTATIONS', { errorInfo: response.data.item }, { root: true });
    return Promise.resolve({ errorInfo: response.data.item });
  });
};

const TIMEOUT = 0;
const instance = axios.create({
  baseURL: URLS.baseURL,
  timeout: TIMEOUT,
  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  }
});
// http request 拦截器
instance.interceptors.request.use((config) => {
  const authorizationURL = store.state.baseLayout.token ? [URLS.login.loginSystem, URLS.login.reportCode, URLS.login.sendMail] : [URLS.login.loginSystem, URLS.login.reportCode, URLS.login.oauthConfig, URLS.login.sendMail];
  if (authorizationURL.indexOf(config.url) === -1) {
    config.headers.Authorization = store.state.baseLayout.token || window.localStorage.getItem('token');
    config.data.token = store.state.baseLayout.token || window.localStorage.getItem('token');
  }
  return config;
}, error => {
  return Promise.reject(error);
});
// http response 拦截器
instance.interceptors.response.use( (response) => {
  try {
    if (parseInt(response.data.item.code, 10) !== 20000) {
      return ErrorHandler(response);
    }
    if (response.data.item.message !== 'successfully') {
      ElMessage.success(response.data.item.message);
    }
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}, error => {
  return Promise.reject(error);
});
export default instance;
