import { commonMethods } from '@/api/methods';
import { auth } from '@/api/urls';
import { setTree } from '@/utils/func';

export const mutations = {
  /**
   * 更新vuex数据
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
   * 获取权限列表
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<boolean>}
   */
  async getAuthLists({ commit, state }, payload) {
    if (state.authLists && !payload.refresh) {
      commit('UPDATE_MUTATIONS', {
        authTree: setTree(JSON.parse(JSON.stringify(state.authLists)), 0, 'children'),
        authLists: state.authLists
      });
      return false;
    }
    return new Promise((resolve, reject) => {
      commonMethods(auth.lists, payload).then(result => {
        commit('UPDATE_MUTATIONS', {
          authTree: setTree(result?.data?.item?.lists || [], 0, 'children'),
          authLists: result?.data?.item?.lists || []
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
