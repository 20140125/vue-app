import requestMethods from '../../api/methods';
import URLS from '../../api/urls';
import func from '../../utils/func';

export const state = {
  tabs: [{ label: '欢迎页', value: '/admin/home/index' }],
  tabModel: { label: '欢迎页', value: '/admin/home/index' },
  notice: [],
  seriesData: { log: [], oauth: [], notice: [] }
};
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
   * todo:获取导航栏
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<boolean>}
   */
  async getMenu({ commit, state }, payload = {}) {
    if (state.menuLists) {
      commit('UPDATE_MUTATIONS', { menuLists: state.menuLists });
      return false;
    }
    return new Promise((resolve, reject) => {
      requestMethods.commonMethods(URLS.home.getMenu, payload).then(result => {
        commit('UPDATE_MUTATIONS', { menuLists: func.setTree((((result || {}).data || {}).item || {}).lists || {}) });
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * todo:保存长链接通知信息
   * @param commit
   * @param payload
   * @return {Promise<void>}
   */
  async saveSocketMessage({ commit }, payload) {
    commit('UPDATE_MUTATIONS', payload);
  },
  /**
   * todo:获取时间线
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<boolean>}
   */
  async getTimeLine({ commit, state }, payload = {}) {
    if (state.timeline) {
      commit('UPDATE_MUTATIONS', { timeline: state.timeline });
      return false;
    }
    return new Promise((resolve, reject) => {
      requestMethods.commonMethods(URLS.timeline.lists, payload).then(result => {
        commit('UPDATE_MUTATIONS', { timeline: ((((result || {}).data || {}).item || {}).lists || {}).data || [] });
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
   * @param payload
   */
  addTabs({ commit, state }, payload) {
    try {
      let newTabs = JSON.parse(JSON.stringify(state.tabs));
      if (JSON.stringify(newTabs).indexOf(JSON.stringify(payload)) === -1) {
        newTabs.push(payload);
      }
      commit('UPDATE_MUTATIONS', { tabs: newTabs, tabModel: payload });
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
      let newTabs = JSON.parse(JSON.stringify(state.tabs));
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
  state,
  mutations
};
