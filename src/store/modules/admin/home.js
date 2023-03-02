import { commonMethods } from '@/api/methods';
import { home, timeline } from '@/api/urls';
import { setTree } from '@/utils/func';

export const state = {
  tabs: [{ label: '欢迎页', value: '/admin/index' }],
  tabModel: { label: '欢迎页', value: '/admin/index' },
  notice: [],
  seriesData: { log: [], oauth: [], notice: [] }
};
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
   * 获取导航栏
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
      commonMethods(home.getMenu, payload).then(result => {
        commit('UPDATE_MUTATIONS', { menuLists: setTree((((result || {}).data || {}).item || {}).lists || []) });
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * 获取时间线
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
      commonMethods(timeline.lists, payload).then(result => {
        commit('UPDATE_MUTATIONS', { timeline: ((((result || {}).data || {}).item || {}).lists || {}).data || [] });
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * 添加tabs
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
   * 删除tabs
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
