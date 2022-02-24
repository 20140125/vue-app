import requestMethods from '../../../api/methods';
import URLS from '../../../api/urls';

export const mutations = {
  /**
   * todo: 更新vuex数据
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
   * todo:获取系统日志
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<boolean>}
   */
  async getSystemLogLists({ commit, state }, payload) {
    /* 如果页码没有变，直接读取vuex里面的数据 */
    if (state.page === payload.page && !payload.refresh && state.systemLogLists.length > 0) {
      commit('UPDATE_MUTATIONS', { systemLogLists: state.systemLogLists });
      return false;
    }
    return new Promise((resolve, reject) => {
      requestMethods.commonMethods(URLS.log.lists, payload).then(result => {
        commit('UPDATE_MUTATIONS', {
          systemLogLists: ((((result || {}).data || {}).item || {}).lists || {}).data || [],
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
