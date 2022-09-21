import { commonMethods } from '@/api/methods';
import URLS from '@/api/urls';

export const state = {
  imageLists: {
    index: { lists: [], total: 0 },
    search: { lists: [], total: 0, searchKeys: '' }
  },
  configuration: {
    notice: [],
    hotKeyWord: [],
    tags: []
  },
  menuLists: [
    { label: '首页', icon: 'el-icon-house', path: '/', highlight: ['HomeIndex'] },
    { label: '热搜', icon: 'el-icon-search', path: '/home/search', highlight: ['HomeSearch'] },
    { label: '信息', icon: 'el-icon-chat-dot-square', path: '/home/chat', highlight: ['ConnectPerson', 'MessageBox'] },
    { label: '我的', icon: 'el-icon-user', path: '/home/users', highlight: ['Users', 'UsersCenter', 'Settings'] }
  ],
  accountSetting: [
    { label: '账号信息', icon: 'el-icon-user', path: '/home/users/info', value: 'account' },
    { label: '系统设置', icon: 'el-icon-setting', path: '/home/users/setting', value: 'setting' },
    { label: '退出系统', icon: 'el-icon-upload2', value: 'logout' },
    { label: '敬请期待', icon: 'el-icon-loading', value: 'loading' }
  ],
  systemSetting: [
    { label: '账号与安全', value: 1, class: 'grid-item settings' },
    { label: '个人信息与权限', value: 1, class: 'grid-item' },
    { label: '关于我们', value: 1, class: 'grid-item' },
    { label: '插件', value: 1, class: 'grid-item' }
  ],
  /* 更多配置 */
  moreInformationConfig: { ip_address: '居住地址', local: '所在地', desc: '个性签名', tags: '个性标签', notice_status: '站内通知', u_name: '切换账号' },
  /* 联系人 */
  chatBody: {
    userLists: [],
    indexLists: []
  },
  /* 接收者 */
  receiver: {},
  /* 用户列表 */
  userLists: [],
  /* 消息列表 */
  messageLists: [],
  /* 个人消息记录 */
  selfMessage: [],
  /* 错误消息 */
  error: {
    /* 成功 */
    success: { code: '20000', message: 'successfully' },
    /* 未登录系统 */
    login: { code: '20003', message: 'Please Login System' },
    /* 取消授权登录 */
    cancel: { code: '40001', message: 'Cancel Oauth Login' }
  }

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
      commonMethods(payload.value === 'index' ? URLS.image.list : URLS.image.hot, payload).then((result) => {
        switch (payload.type) {
          case 'index':
            commit('UPDATE_MUTATIONS', {
              imageLists: {
                index: {
                  lists: ((((result || {}).data || {}).item || {}).lists || {}).data || [],
                  total: ((((result || {}).data || {}).item || {}).lists || {}).total || 0
                },
                search: {
                  lists: state.imageLists.search.lists,
                  total: state.imageLists.search.total,
                  searchKeys: state.imageLists.search.searchKeys
                }
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
                search: {
                  lists: state.imageLists.search.lists,
                  total: state.imageLists.search.total,
                  searchKeys: state.imageLists.search.searchKeys
                }
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
                hotKeyWord: state.configuration.hotKeyWord,
                tags: state.configuration.tags
              }
            });
            break;
          case 'hotKeyWord':
            commit('UPDATE_MUTATIONS', {
              configuration: {
                notice: state.configuration.notice,
                hotKeyWord: state.configuration.hotKeyWord.length > 0 ? state.configuration.hotKeyWord : (((result || {}).data || {}).item || {}).lists || [],
                tags: state.configuration.tags
              }
            });
            break;
          case 'tags':
            commit('UPDATE_MUTATIONS', {
              configuration: {
                notice: state.configuration.notice,
                hotKeyWord: state.configuration.hotKeyWord,
                tags:  state.configuration.tags.length > 0 ? state.configuration.tags : (((result || {}).data || {}).item || {}).lists || []
              }
            });
            break;
          default:
            commit('UPDATE_MUTATIONS', {
              configuration: {
                notice: state.configuration.notice,
                hotKeyWord: state.configuration.hotKeyWord,
                tags: state.configuration.tags
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
