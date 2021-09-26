import requestMethods from '@/api/methods';
import URLS from '@/api/urls';

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
     * todo:获取管理员列表
     * @param commit
     * @param state
     * @param payload
     * @return {Promise<boolean>}
     */
    async getUsersLists({ commit, state }, payload) {
        /* 如果页码没有变，直接读取vuex里面的数据 */
        if (state.page === payload.page && !payload.refresh) {
            commit('UPDATE_MUTATIONS', { usersLists: state.usersLists });
            return false;
        }
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.users.lists, payload).then(result => {
                commit('UPDATE_MUTATIONS', {
                    usersLists: (((result.data || {}).item || {}).lists || {}).data || [],
                    total: (((result.data || {}).item || {}).lists || {}).total || 0,
                    page: payload.page || 1
                });
                resolve(result);
            }).catch(error => {
                commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
                reject(error);
            });
        });
    },
    /**
     * todo：获取用户信息
     * @param commit
     * @param state
     * @return {Promise<boolean>}
     */
    async getUserCenter({ commit, state }) {
        if (state.userCenter) {
            commit('UPDATE_MUTATIONS', { userCenter: state.userCenter });
            return false;
        }
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.userCenter.get, {}).then(result => {
                commit('UPDATE_MUTATIONS', { userCenter: ((result.data || {}).item || {}).lists || {} });
                resolve(result);
            }).catch(error => {
                commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
                reject(error);
            });
        });
    },
    /**
     * todo:获取缓存用户
     * @param commit
     * @param state
     * @param payload
     * @return {Promise<boolean>}
     */
    async getCacheUserLists({commit, state}, payload) {
        /* 如果页码没有变，直接读取vuex里面的数据 */
        if (state.cacheUsers) {
            commit('UPDATE_MUTATIONS', { cacheUsers: state.cacheUsers });
            return false;
        }
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.users.cache, payload).then(result => {
                commit('UPDATE_MUTATIONS', { cacheUsers: ((result.data || {}).item || {}).lists || [] });
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
