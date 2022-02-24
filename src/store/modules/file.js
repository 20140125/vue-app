import requestMethods from '../../api/methods';
import URLS from '../../api/urls';

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
   * todo:获取文件列表
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<*|{}>}
   */
  async getFileLists({ commit, state }, payload) {
    if (payload.basename === state.basename) {
      commit('UPDATE_MUTATIONS', { fileLists: state.fileLists, basename: payload.basename });
      return false;
    }
    return new Promise((resolve, reject) => {
      requestMethods.commonMethods(URLS.file.lists, payload).then(result => {
        commit('UPDATE_MUTATIONS', {
          fileLists: (((result || {}).data || {}).item || {}).lists || [],
          basename: payload.basename
        });
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * todo:获取文件内容
   * @param dispatch
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<void>}
   */
  async getFileContent({ dispatch, commit, state }, payload) {
    if (payload.content) {
      state.tabs.forEach(item => {
        if (item.content === payload.content) {
          dispatch('addTabs', payload);
          return false;
        }
      });
    }
    return new Promise((resolve, reject) => {
      requestMethods.commonMethods(URLS.file.read, payload).then(result => {
        payload.content = (((result || {}).data || {}).item || {}).lists || {};
        dispatch('addTabs', payload);
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * todo：添加tabs
   * @param commit
   * @param state
   * @param tabs
   */
  addTabs({ commit, state }, tabs) {
    try {
      let newTabs = JSON.parse(JSON.stringify(state.tabs || []));
      if (JSON.stringify(newTabs).indexOf(JSON.stringify(tabs)) === -1) {
        newTabs.push(tabs);
      }
      commit('UPDATE_MUTATIONS', { tabs: newTabs, tabModel: tabs });
    } catch (error) {
      commit('UPDATE_MUTATIONS', { error: error }, { root: true });
    }
  },
  /**
   * todo：删除tabs
   * @param commit
   * @param state
   * @param payload
   */
  deleteTabs({ commit, state }, payload) {
    try {
      let newTabs = JSON.parse(JSON.stringify(state.tabs || []));
      newTabs.splice(payload.index, 1);
      commit('UPDATE_MUTATIONS', { tabs: newTabs, tabModel: payload.nextTab });
    } catch (error) {
      commit('UPDATE_MUTATIONS', { error: error }, { root: true });
    }
  }
};

export default {
  namespaced: true,
  actions,
  mutations
};
