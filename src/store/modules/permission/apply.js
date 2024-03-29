import { commonMethods } from '@/api/methods';
import { permission } from '@/api/urls';
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
   * 权限申请列表
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<boolean>}
   */
  async getPermissionApply({ commit, state }, payload) {
    /* 如果页码没有变，直接读取vuex里面的数据 */
    if (state.page === payload.page && !payload.refresh && state.permissionLists.length > 0) {
      commit('UPDATE_MUTATIONS', { permissionLists: state.permissionLists });
      return false;
    }
    return new Promise((resolve, reject) => {
      commonMethods(permission.lists, payload).then(result => {
        commit('UPDATE_MUTATIONS', {
          permissionLists: result?.data?.item?.lists?.data || [],
          total: result?.data?.item?.lists?.total || 0,
          page: payload.page || 1
        });
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: error.data?.item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * 权限申请列表
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<boolean>}
   */
  async getUserAuth({ commit, state }, payload) {
    /* 如果页码没有变，直接读取vuex里面的数据 */
    if (parseInt(state.user_id, 10) === parseInt(payload.user_id, 10) && !payload.refresh) {
      commit('UPDATE_MUTATIONS', { authLists: state.authLists, user_id: state.user_id });
      return false;
    }
    return new Promise((resolve, reject) => {
      commonMethods(permission.get, payload).then(result => {
        commit('UPDATE_MUTATIONS', {
          authLists: setTree(result?.data?.item?.lists?.authLists || []),
          user_id: result?.data?.item?.lists?.user_id || 0
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
