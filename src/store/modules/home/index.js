import { commonMethods } from '@/api/methods';
import URLS from '../../../api/urls';

export const state = {
  imageLists: {
    index: { lists: [], total: 0 },
    search: { lists: [], total: 0, searchKeys: '' }
  },
  configuration: {
    notice: [],
    hotKeyWord: []
  },
  menuLists: [
    { label: '首页', icon: 'el-icon-house', path: '/' },
    { label: '热搜', icon: 'el-icon-search', path: '/home/search' },
    { label: '消息', icon: 'el-icon-chat-dot-round', path: '/home/chat' },
    { label: '我的', icon: 'el-icon-user', path: '/home/users' }
  ]
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
   * todo:获取图片列表
   * @param commit
   * @param state
   * @param payload
   * @returns {Promise<unknown>|boolean}
   */
  getImageLists({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      commonMethods(URLS.image.list, payload).then((result) => {
        switch(payload.type) {
          case 'index':
            commit('UPDATE_MUTATIONS', {
              imageLists: {
                index: {
                  lists: ((((result || {}).data || {}).item || {}).lists || {}).data || [],
                  total: ((((result || {}).data || {}).item || {}).lists || {}).total || 0
                },
                search: { lists: state.imageLists.search.lists, total: state.imageLists.search.total, searchKeys: state.imageLists.search.searchKeys }
              }
            });
            break;
          case 'search':
            commit('UPDATE_MUTATIONS', {
              imageLists: {
                index: { lists: state.imageLists.index.lists, total: state.imageLists.index.total },
                search: {
                  lists: ((((result || {}).data || {}).item || {}).lists || {}).data || [],
                  total: ((((result || {}).data || {}).item || {}).lists || {}).total || 0,
                  searchKeys: payload.name
                }
              }
            });
            break;
          default:
            commit('UPDATE_MUTATIONS', {
              imageLists: {
                index: { lists: state.imageLists.index.lists, total: state.imageLists.index.total },
                search: { lists: state.imageLists.search.lists, total: state.imageLists.search.total, searchKeys: state.imageLists.search.searchKeys }
              }
            });
            break;
        }
        resolve(result);
      }).catch(error => {
        commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
        reject(error);
      });
    });
  },
  /**
   * todo:获取关键字
   * @param commit
   * @param state
   * @param payload
   * @returns {Promise<unknown>|boolean}
   */
  getConfiguration({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      commonMethods(URLS.image.config, payload).then((result) => {
        switch (payload.type) {
          case 'notice':
            commit('UPDATE_MUTATIONS', {
              configuration: {
                notice: state.configuration.notice.length > 0 ? state.configuration.notice : (((result || {}).data || {}).item || {}).lists || [],
                hotKeyWord: state.configuration.hotKeyWord
              }
            });
            break;
          case 'hotKeyWord':
            commit('UPDATE_MUTATIONS', {
              configuration: {
                notice: state.configuration.notice,
                hotKeyWord: state.configuration.hotKeyWord.length > 0 ? state.configuration.hotKeyWord : (((result || {}).data || {}).item || {}).lists || []
              }
            });
            break;
          default:
            commit('UPDATE_MUTATIONS', {
              configuration: {
                notice: state.configuration.notice,
                hotKeyWord: state.configuration.hotKeyWord
              }
            });
            break;
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
  actions,
  mutations,
  state
};
