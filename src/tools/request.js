import axios from 'axios';
import { ElMessage } from 'element-plus';
import store from '../store';
import router from '../route';
import urls from '../api/urls';

/**
 * todo:错误跳转
 * @param response
 */
const ErrorHandler = (response) => {
  if (!store.state.baseLayout.token) {
    return router.push({ path: '/login' }).then(() => {
      ElMessage.error(response.data.item.message);
      store.commit('UPDATE_MUTATIONS', { error: response.data.item }, { root: true });
      return Promise.resolve({ error: response.data.item });
    });
  }
  router.push({ path: '/admin/result/index' }).then(() => {
    store.commit('UPDATE_MUTATIONS', { error: response.data.item }, { root: true });
    return Promise.resolve({ error: response.data.item });
  });
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
instance.defaults.baseURL = urls.baseURL;
// http request 拦截器
instance.interceptors.request.use(config => {
  const commonURL = store.state.baseLayout.token ? [urls.login.loginSystem, urls.login.reportCode, urls.login.sendMail] : [urls.login.loginSystem, urls.login.reportCode, urls.login.oauthConfig, urls.login.sendMail];
  if (commonURL.indexOf(config.url) === -1) {
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
