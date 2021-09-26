import requestMethods from '@/api/methods';
import URLS from '@/api/urls';
import func from '@/utils/func';

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
        if (state.areaLists) {
            commit('UPDATE_MUTATIONS', { areaLists: state.areaLists });
            return false;
        }
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.area.lists, payload).then(result => {
                commit('UPDATE_MUTATIONS', { areaLists: ((result.data || {}).item || {}).lists || [] });
                resolve(result);
            }).catch(error => {
                commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
                reject(error);
            });
        });
    },
    /**
     * todo:获取地区列表
     * @param commit
     * @param payload
     * @return {Promise<boolean>}
     */
    async getChildrenLists({ commit }, payload) {
        /* 如果页码没有变，直接读取vuex里面的数据 */
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.area.lists, payload).then(result => {
                commit('UPDATE_MUTATIONS', { childrenLists: ((result.data || {}).item || {}).lists || [] });
                resolve(result);
            }).catch(error => {
                commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
                reject(error);
            });
        });
    },
    /**
     * todo:获取角色列表
     * @param commit
     * @param state
     * @param payload
     * @return {Promise<boolean>}
     */
    async getAreaCacheLists({ commit, state }, payload) {
        /* 如果页码没有变，直接读取vuex里面的数据 */
        if (state.cacheArea) {
            commit('UPDATE_MUTATIONS', { cacheArea: state.cacheArea });
            return false;
        }
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.area.cache, payload).then(result => {
                commit('UPDATE_MUTATIONS', { cacheArea: func.setTree(((result.data || {}).item || {}).lists || [], 0, 'children', 'parent_id') || [] });
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
