import { commonMethods } from '@/api/methods';
import URLS from '@/api/urls';
import router from '@/route/index';

export const mutations = {
  /**
   *  更新vuex数据
   * @param state
   * @param update
   */
  UPDATE_MUTATIONS(state, update) {
    Object.keys(update).forEach(item => {
      state[item] = update[item];
    });
  }
};
export const actions = {
  /**
   * 校验登录态
   * @param commit
   * @param state
   * @param authorized
   * @return {Promise<boolean>}
   */
  async checkAuthorized({ commit, state }, authorized) {
    if (state.userInfo) {
      commit('UPDATE_MUTATIONS', { userInfo: state.userInfo });
      return false;
    }
    return new Promise((resolve, reject) => {
      commonMethods(URLS.login.checkAuthorized, authorized).then(result => {
        commit('UPDATE_MUTATIONS', {
          userInfo: (((result || {}).data || {}).item || {}).lists || {},
          isAuthorized: true
        });
        window.localStorage.setItem('RTX', state.userInfo.username || 'tourist');
        resolve(result);
      }).catch(error => {
        window.localStorage.removeItem('token');
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * 登录系统
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<void>}
   */
  async loginSYS({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      commonMethods(URLS.login.loginSystem, payload).then(result => {
        commit('UPDATE_MUTATIONS', {
          userInfo: (((result || {}).data || {}).item || {}).lists || {},
          isAuthorized: true
        });
        if (Object.keys(state.userInfo).length > 0) {
          window.localStorage.setItem('token', state.userInfo.remember_token || '');
          window.localStorage.setItem('RTX', state.userInfo.username || 'tourist');
          router.push({ path: '/admin/index' });
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * 登出系统
   * @param commit
   * @param payload
   * @return {Promise<void>}
   */
  async logoutSYS({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commonMethods(URLS.login.logoutSystem, payload).then(result => {
        commit('UPDATE_MUTATIONS', { userInfo: {}, isAuthorized: false });
        commit('UPDATE_MUTATIONS', { baseLayout: { token: '', username: 'tourist' } }, { root: true });
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('RTX');
        router.push({ path: '/admin/login' });
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * 验证码上报
   * @param commit
   * @param payload
   * @return {Promise<void>}
   */
  async reportCode({ commit }, payload) {
    return new Promise((resolve, reject) => {
     commonMethods(URLS.login.reportCode, payload).then(result => {
        commit('UPDATE_MUTATIONS', { verifyCode: ((((result || {}).data || {}).item || {}).lists || {}).key || payload.verify_code });
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * 发送邮件
   * @param commit
   * @param payload
   * @return {Promise<void>}
   */
  async sendMail({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commonMethods(URLS.login.sendMail, payload).then(result => {
        commit('UPDATE_MUTATIONS', { mailLogin: true });
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * 授权登录配置
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<boolean>}
   */
  async getOauthConfig({ commit, state }, payload) {
    if (state.oauthConfig && !payload.refresh) {
      commit('UPDATE_MUTATIONS', { oauthConfig: state.oauthConfig });
      return false;
    }
    return new Promise((resolve, reject) => {
      commonMethods(URLS.login.oauthConfig, payload).then(result => {
        commit('UPDATE_MUTATIONS', { oauthConfig: (((result || {}).data || {}).item || {}).lists || [] });
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  }
};
export default {
  namespaced: true,
  actions,
  mutations
};
