import requestMethods from '@/api/methods'
import URLS from '@/api/urls'

export const mutations = {
    /**
     * todo: 更新vuex数据
     * @param state
     * @param update
     */
    UPDATE_MUTATIONS: function (state, update) {
        Object.keys(update).forEach(item => {
            state[item] = update[item]
        })
    },
}

export const actions = {
    /**
     * todo:获取角色列表
     * @param commit
     * @param state
     * @param payload
     * @return {Promise<boolean>}
     */
    async getConfigLists({ commit, state }, payload) {
        /* 如果页码没有变，直接读取vuex里面的数据 */
        if (state.page === payload.page && !payload.refresh) {
            commit('UPDATE_MUTATIONS', { configLists: state.configLists })
            return false
        }
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.config.lists, payload).then(result => {
                commit('UPDATE_MUTATIONS', {
                    configLists: (((result.data || {}).item || {}).lists || {}).data || [],
                    total: (((result.data || {}).item || {}).lists || {}).total || 0,
                    page: payload.page || 1
                })
                resolve(result)
            }).catch(error => {
                commit('UPDATE_MUTATIONS', { error: error }, { root: true })
                reject(error)
            })
        })
    }
}
export default {
    namespaced: true,
    mutations,
    actions
}
