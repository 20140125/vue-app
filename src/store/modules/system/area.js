import { commonMethods } from '@/api/methods';
import URLS from '../../../api/urls';
import { setTree } from '@/utils/func';

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
   * todo:获取地区列表
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<boolean>}
   */
  async getAreaLists({ commit, state }, payload) {
    /* 如果页码没有变，直接读取vuex里面的数据 */
    if (state.areaLists && !payload.refresh) {
      commit('UPDATE_MUTATIONS', { areaLists: state.areaLists });
      return false;
    }
    return new Promise((resolve, reject) => {
      commonMethods(URLS.area.lists, payload).then(result => {
        commit('UPDATE_MUTATIONS', { areaLists: ((result.data || {}).item || {}).lists || [] });
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * todo:获取缓存城市列表
   * @param commit
   * @param state
   * @param payload
   * @return {Promise<boolean>}
   */
  async getAreaCacheLists({ commit, state }, payload) {
    /* 如果页码没有变，直接读取vuex里面的数据 */
    if (state.cacheArea) {
      commit('UPDATE_MUTATIONS', { cacheArea: state.cacheArea || [], cacheArea2: state.cacheArea2 || [] });
      return false;
    }
    return new Promise((resolve, reject) => {
      commonMethods(URLS.area.cache, payload).then(result => {
        if (payload.children) {
          commit('UPDATE_MUTATIONS', { cacheArea: setTree(((result.data || {}).item || {}).lists || [], 0, 'children', 'parent_id') || [] });
        } else {
          commit('UPDATE_MUTATIONS', { cacheArea2: ((result.data || {}).item || {}).lists || [] });
        }
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
