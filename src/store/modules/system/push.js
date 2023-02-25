import { commonMethods } from '@/api/methods';
import URLS from '@/api/urls';

export const mutations = {
  /**
   *  更新vuex数据
   * @param state
   * @param update
   */
  UPDATE_MUTATIONS: function (state, update) {
    Object.keys(update).forEach(item => {
      state[item] = update[item];
    });
  }
};

export const actions = {
  /**
   * 获取站内通知
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<boolean>}
   */
  async getPushLists({ commit, state }, payload) {
    /* 如果页码没有变，直接读取vuex里面的数据 */
    if (state.page === payload.page && !payload.refresh && state.pushLists.length > 0) {
      commit('UPDATE_MUTATIONS', { pushLists: state.pushLists });
      return false;
    }
    return new Promise((resolve, reject) => {
      commonMethods(URLS.push.lists, payload).then(result => {
        commit('UPDATE_MUTATIONS', {
          pushLists: ((((result || {}).data || {}).item || {}).lists || {}).data || [],
          total: ((((result || {}).data || {}).item || {}).lists || {}).total || 0,
          page: payload.page || 1
        });
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
