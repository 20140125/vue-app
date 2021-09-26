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
     * todo:获取爬虫配置
     * @param commit
     * @param state
     * @return {Promise<boolean>}
     */
    async getSpiderConfiguration({ commit, state }) {
        if (state.spiderConfig) {
            commit('UPDATE_MUTATIONS', { spiderConfig: state.spiderConfig });
            return false;
        }
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.spider.lists).then(result => {
                commit('UPDATE_MUTATIONS', { spiderConfig: (((result || {}).data || {}).item || {}).lists || {} });
                resolve(result);
            }).catch(error => {
                commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true });
                reject(error);
            });
        });
    },
    /**
     * todo:获取爬虫配置
     * @param commit
     * @param payload
     * @return {Promise<boolean>}
     */
    async runningSpider({ commit }, payload) {
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.spider.running, payload).then(result => {
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
    mutations
};
