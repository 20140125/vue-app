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
     * todo:设置用户列表
     * @param state
     * @param users
     */
    addClientUsers({ commit }, users) {
        commit('UPDATE_MUTATIONS', users)
    },
    /**
     * todo：添加聊天用户
     * @param state
     * @param commit
     * @param users
     */
    addChatUsers ({ state, commit }, users) {
        const newChatUsers = JSON.parse(JSON.stringify(state.chatUsers || []))
        if (JSON.stringify(newChatUsers).indexOf(JSON.stringify(users)) === -1) {
            newChatUsers.push(users)
            commit('UPDATE_MUTATIONS', { chatUsers: newChatUsers })
        }
    },
    /**
     * todo：添加日志
     * @param state
     * @param commit
     * @param log
     */
    addClientLog ({ state, commit }, log) {
        const newClientLog = JSON.parse(JSON.stringify(state.clientLog || []))
        newClientLog.push(log)
        commit('UPDATE_MUTATIONS', { clientLog: newClientLog })
    },
    /**
     * todo：添加聊天记录
     * @param state
     * @param commit
     * @param payload
     */
    addMessageLists ({ state, commit }, payload) {
        const newMessageLists = JSON.parse(JSON.stringify(state.messageLists || []))
        newMessageLists.push(payload.message)
        newMessageLists['uuid'] = payload.uuid
        commit('UPDATE_MUTATIONS', { messageLists: newMessageLists })
    },
}

export default {
    namespaced: true,
    actions,
    mutations
}
