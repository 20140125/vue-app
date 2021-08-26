import requestMethods from '@/api/methods';
import URLS from '@/api/urls';
import func from '@/utils/func';

export const mutations = {
    /**
     * todo: 更新vuex数据
     * @param state
     * @param update
     */
    UPDATE_MUTATIONS: function (state, update) {
        Object.keys(update).forEach(item => {
            state[item] = update[item];
        });
    }
};
export const actions = {
    /**
     * todo:获取接口列表
     * @param commit
     * @param state
     * @param payload
     * @return {Promise<boolean>}
     */
    async getInterfaceCategory({commit, state}, payload) {
        if (state.categoryLists && !payload.refresh) {
            commit('UPDATE_MUTATIONS', {categoryLists: state.categoryLists, categoryTree: func.setTree(state.categoryLists, 0, 'children')});
            return false;
        }
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.interfaceCategory.lists, payload).then(result => {
                commit('UPDATE_MUTATIONS', {categoryLists: ((result.data || {}).item || {}).lists || {}, categoryTree: func.setTree(((result.data || {}).item || {}).lists || {}, 0, 'children')});
                resolve(result);
            }).catch(error => {
                commit('UPDATE_MUTATIONS', {error: (error.data || {}).item || {}}, {root: true});
                reject(error);
            });
        });
    },
    /**
     * todo:获取接口详情
     * @param commit
     * @param state
     * @param payload
     * @return {Promise<boolean>}
     */
    async getInterfaceDetails({commit, state}, payload) {
        if (parseInt(payload.id, 10) === parseInt(state.id, 10) && payload.source !== state.source) {
            commit('UPDATE_MUTATIONS', {details: state.details, id: payload.id, source: payload.source});
            return false;
        }
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.interface.get, payload).then(result => {
                commit('UPDATE_MUTATIONS', {details: ((result.data || {}).item || {}).lists || {}, id: payload.id || 0, source: payload.source || ''});
                resolve(result);
            }).catch(error => {
                commit('UPDATE_MUTATIONS', {error: (error.data || {}).item || {}}, {root: true});
                reject(error);
            });
        });
    }
};
export default {
    namespaced: true,
    actions,
    mutations
};
