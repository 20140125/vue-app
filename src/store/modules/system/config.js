import { commonMethods } from '@/api/methods';
import URLS from '@/api/urls';

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
   * 获取配置
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<boolean>}
   */
  async getConfigLists({ commit, state }, payload) {
    /* 如果页码没有变，直接读取vuex里面的数据 */
    if (state.page === payload.page && !payload.refresh && state.configLists.length > 0) {
      commit('UPDATE_MUTATIONS', { configLists: state.configLists });
      return false;
    }
    return new Promise((resolve, reject) => {
      commonMethods(URLS.config.lists, payload).then(result => {
        commit('UPDATE_MUTATIONS', {
          configLists: ((((result || {}).data || {}).item || {}).lists || {}).data || [],
          total: ((((result || {}).data || {}).item || {}).lists || {}).total || 0,
          page: payload.page || 1
        });
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * 获取系统配置
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<unknown>}
   */
  async getConfigDetails({ commit, state }, payload) {
    /* 如果页码没有变，直接读取vuex里面的数据 */
    if (state.systemConfig) {
      commit('UPDATE_MUTATIONS', { systemConfig: state.systemConfig });
      return false;
    }
    return new Promise((resolve, reject) => {
      commonMethods(URLS.login.oauthConfig, payload).then(result => {
        commit('UPDATE_MUTATIONS', { systemConfig: (((result || {}).data || {}).item || {}).lists || {} });
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
  mutations,
  actions
};
