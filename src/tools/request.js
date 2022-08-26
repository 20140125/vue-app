import axios from 'axios';
import store from '@/store';
import router from '@/route';
import URLS from '@/api/urls';

/* h5固有地址 */
const homeURL = [URLS.image.list, URLS.image.config, URLS.image.hot];
const jumpHome = [URLS.image.list, URLS.image.config];
const notJump = [URLS.image.hot];
/**
 * todo:错误跳转
 * @param response
 */
const ErrorHandler = (response) => {
  if (!store.state.baseLayout.token) {
    const path = jumpHome.includes(response.config.url) ? '/' : notJump.includes(response.config.url) ? '/home/search' : '/admin/home/login';
    return router.push({ path }).then(() => {
      window.localStorage.removeItem('token');
      store.commit('UPDATE_MUTATIONS', { errorInfo: response.data.item }, { root: true });
      return Promise.resolve({ errorInfo: response.data.item });
    });
  }
  return router.push({ path: homeURL.includes(response.config.url) ? '/' : '/admin/result/index' }).then(() => {
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
  return parseInt((((response.data || {}).item || {}).code || '0'), 10) === 20000 ? Promise.resolve(response) : ErrorHandler(response);
}, error => {
  return Promise.reject(error);
});
export default instance;
