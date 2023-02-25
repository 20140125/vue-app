import { commonMethods } from '@/api/methods';

export default {
  /**
   * 通用方法（添加、修改、删除）
   * @param commit
   * @param payload
   * @return {Promise<unknown>}
   * @constructor
   */
  UPDATE_ACTIONS({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commonMethods(payload.url, payload.model).then(result => {
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  }
};
