const state = {
    fileTabs: [],
    currFileObj: {name: null, content: null, path: null, label: null},
    currSystemLogObj: {}
}
const getters = {
    fileTabs: state => state.fileTabs,
    currFileObj: state => state.currFileObj,
    currSystemLogObj: state => state.currSystemLogObj
}
const mutations = {
    /**
     * todo：设置tabs
     * @param state
     * @param fileTabs
     */
    setFileTabs (state, fileTabs) {
        state.fileTabs.push(fileTabs)
    },
    /**
     * todo：移除tabs
     * @param state
     * @param fileTabs
     */
    delFileTabs (state, fileTabs) {
        state.fileTabs = fileTabs
    },
    /**
     * todo：设置当前file对象
     * @param state
     * @param currFileObj
     */
    setCurrFileObj (state, currFileObj) {
        state.currFileObj = currFileObj
    },
    /**
     * TODO：设置系统日志的内容
     * @param state
     * @param currSystemLogObj
     */
    setCurrSystemLogObj (state, currSystemLogObj) {
        state.currSystemLogObj = currSystemLogObj
    }
}
const actions = {
    /**
     * todo：添加tabs
     * @param state
     * @param commit
     * @param fileTabs
     */
    addFileTabs ({state, commit}, fileTabs) {
        if (JSON.stringify(state.fileTabs).indexOf(JSON.stringify(fileTabs)) === -1) {
            commit('setFileTabs', fileTabs)
        }
    },
    /**
     * todo：删除tabs
     * @param state
     * @param commit
     * @param tabName
     */
    deleteFileTabs ({state, commit}, tabName) {
        let index = 0
        for (let i in state.fileTabs) {
            if (tabName === state.fileTabs[i].name) {
                index = i
            }
        }
        state.fileTabs.splice(index, 1)
        commit('delFileTabs', state.fileTabs)
    },
    /**
     * todo：添加当前file对象
     * @param state
     * @param commit
     * @param currFileObj
     */
    addCurrFileObj ({state, commit}, currFileObj) {
        commit('setCurrFileObj', currFileObj)
    },
    /**
     * TODO：添加系统日志
     * @param state
     * @param commit
     * @param currSystemLogObj
     */
    addCurrSystemLogObj ({state, commit}, currSystemLogObj) {
        commit('setCurrSystemLogObj', currSystemLogObj)
    }
}
export default {
    state,
    getters,
    mutations,
    actions
}
