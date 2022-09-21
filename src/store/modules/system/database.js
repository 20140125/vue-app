import { commonMethods } from '@/api/methods';
import URLS from '@/api/urls';

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
   * todo:获取数据表
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<boolean>}
   */
  async getDatabaseLists({ commit, state }, payload) {
    /* 如果页码没有变，直接读取vuex里面的数据 */
    if (state.databaseLists && !payload.refresh) {
      commit('UPDATE_MUTATIONS', { databaseLists: state.databaseLists });
      return false;
    }
    return new Promise((resolve, reject) => {
      commonMethods(URLS.database.lists, payload).then(result => {
        commit('UPDATE_MUTATIONS', { databaseLists: ((result.data || {}).item || {}).lists || [] });
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
