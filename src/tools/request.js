import axios from 'axios/index';
import { ElMessage } from 'element-plus';
import store from '../store';
import router from '../route';
import urls from '../api/urls';

/**
 * todo:错误跳转
 * @param error
 * @return {boolean}
 * @constructor
 */
const ErrorHandler = (error) => {
  if (store.state.token) {
    router.push({ path: '/admin/error/page' }).then(() => {
      store.commit('UPDATE_MUTATIONS', {
        error: {
          code: error.response.status,
          message: error.response.status === 403 ? 'Permission denied login system' : 'Network error, Please try again later'
        }
      }, { root: true });
      return Promise.reject({
        error: {
          code: error.response.status,
          message: error.response.status === 403 ? 'Permission denied login system' : 'Network error, Please try again later'
        }
      });
    });
    return false;
  }
  switch (error.response.status) {
    case 401:
      router.push({ path: '/login' }).then(() => {
        ElMessage.error('Unauthenticated login system');
      });
      break;
    case 403:
      router.push({ path: '/login' }).then(() => {
        ElMessage.error('Permission denied login system');
      });
      break;
    case 500:
      router.push({ path: '/login' }).then(() => {
        ElMessage.error('Network error, Please try again later');
      });
      break;
    default:
      router.push({ path: '/login' }).then(r => console.info(r));
      break;
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
instance.defaults.baseURL = urls.baseURL;
// http request 拦截器
instance.interceptors.request.use(config => {
  const commonURL = store.state.token ? [urls.login.loginSystem, urls.login.reportCode, urls.login.sendMail] : [urls.login.loginSystem, urls.login.reportCode, urls.login.oauthConfig, urls.login.sendMail];
  if (commonURL.indexOf(config.url) === -1) {
    config.headers.Authorization = store.state.token || window.localStorage.getItem('token');
    config.data.token = store.state.token || window.localStorage.getItem('token');
  }
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
  ErrorHandler(error);
});
export default instance;
