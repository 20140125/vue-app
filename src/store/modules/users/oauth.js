import { commonMethods } from '@/api/methods';
import { oauth } from '@/api/urls';

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
   * 获取管理员列表
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<boolean>}
   */
  async getOAuthLists({ commit, state }, payload) {
    /* 如果页码没有变，直接读取vuex里面的数据 */
    if (state.page === payload.page && !payload.refresh && state.oAuthLists.length > 0) {
      commit('UPDATE_MUTATIONS', { oAuthLists: state.oAuthLists });
      return false;
    }
    return new Promise((resolve, reject) => {
      commonMethods(oauth.lists, payload).then(result => {
        commit('UPDATE_MUTATIONS', {
          oAuthLists: result?.data?.item?.lists?.data || [],
          total: result?.data?.item?.lists?.total || 0,
          page: payload.page || 1
        });
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: error.data?.item || {} }, { root: true });
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
