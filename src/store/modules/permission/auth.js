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
     * todo:获取权限列表
     * @param commit
     * @param state
     * @param payload
     * @return {Promise<boolean>}
     */
    async getAuthLists({commit, state}, payload) {
        if (state.authLists && !payload.refresh) {
            commit('UPDATE_MUTATIONS', {authTree: func.setTree(JSON.parse(JSON.stringify(state.authLists)), 0, 'children'), authLists: state.authLists});
            return false;
        }
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.auth.lists, payload).then(result => {
                commit('UPDATE_MUTATIONS', {authTree: func.setTree(((result.data || {}).item || {}).lists || [], 0, 'children'), authLists: ((result.data || {}).item || {}).lists || []});
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
    mutations,
    actions
};
