import requestMethod from '@/api/methods';

export default {
  /**
   * todo:通用方法（添加、修改、删除）
   * @param commit
   * @param payload
   * @return {Promise<unknown>}
   * @constructor
   */
  UPDATE_ACTIONS({ commit }, payload) {
    return new Promise((resolve, reject) => {
      requestMethod.__commonMethods(payload.url, payload.model).then(result => {
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * todo:更新主题
   * @param commit
   * @param payload
   * @constructor
   */
  UPDATE_THEME({ commit }, payload) {
    if (payload.theme.theme === 'default') {
      delete require.cache['@/theme/element-variables_primary.scss'];
      require('@/theme/element-variables.scss');
    } else {
      delete require.cache['@/theme/element-variables.scss'];
      require('@/theme/element-variables_primary.scss');
    }
    window.localStorage.setItem('theme', payload.theme.theme);
    commit('UPDATE_MUTATIONS', { theme: payload.theme.theme }, { root: true });
  }
};
