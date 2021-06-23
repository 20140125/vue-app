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
    async getAuthLists({ commit, state }) {

    }
}
export default {
    namespaced: true,
    mutations
}
