const state = {
    apiVisible: false,
    interfaceName: '',
    apiModel: {},
    docVisible: false,
    docModel: {},
    docName: '',
    dialogWidth: ''
}
const getters = {
    apiVisible: state => state.apiVisible,
    interfaceName: state => state.interfaceName,
    apiModel: state => state.apiModel,
    docVisible: state => state.docVisible,
    docModel: state => state.docModel,
    docName: state => state.docName,
    dialogWidth: state => state.dialogWidth
}
const mutations = {
    /**
     * todo：api接口显示
     * @param state
     * @param apiVisible
     */
    setApiVisible (state, apiVisible) {
        state.apiVisible = apiVisible
    },
    /**
     * todo：api接口显示(markdown)
     * @param state
     * @param docVisible
     */
    setDocVisible (state, docVisible) {
        state.docVisible = docVisible
    },
    /**
     * todo：保存当前的接口名称
     * @param state
     * @param interfaceName
     */
    setInterfaceName (state, interfaceName) {
        state.interfaceName = interfaceName
    },
    /**
     * todo：保存当前的接口名称(markdown)
     * @param state
     * @param docName
     */
    setDocName (state, docName) {
        state.docName = docName
    },
    /**
     * todo：保存当前的apiModel
     * @param state
     * @param apiModel
     */
    setApiModel (state, apiModel) {
        state.apiModel = apiModel
    },
    /**
     * todo：保存当前的docModel (markdown)
     * @param state
     * @param docModel
     */
    setDocModel (state, docModel) {
        state.docModel = docModel
    },
    /**
     * todo:设置弹框的宽度
     * @param state
     * @param dialogWidth
     */
    setDialogWidth (state, dialogWidth) {
        state.dialogWidth = dialogWidth
    }
}
const actions = {
    /**
     * todo：api接口显示
     * @param state
     * @param commit
     * @param obj
     */
    addApiVisible ({state, commit}, obj) {
        commit('setApiVisible', obj.apiVisible)
        commit('setInterfaceName', obj.interfaceName)
    },
    /**
     * todo：api接口显示(markdown)
     * @param state
     * @param commit
     * @param obj
     */
    addDocVisible ({state, commit}, obj) {
        commit('setDocVisible', obj.docVisible)
        commit('setDocName', obj.docName)
    },
    /**
     * todo：保存当前的apiModel
     * @param state
     * @param commit
     * @param apiModel
     */
    addApiModel ({state, commit}, apiModel) {
        commit('setApiModel', apiModel)
    },
    /**
     * todo：保存当前的apiModel(markdown)
     * @param state
     * @param commit
     * @param docModel
     */
    addDocModel ({state, commit}, docModel) {
        commit('setDocModel', docModel)
    },
    /**
     * todo:设置弹框宽度
     * @param state
     * @param commit
     * @param dialogWidth
     */
    addDialogWidth ({state, commit}, dialogWidth) {
        commit('setDialogWidth', dialogWidth)
    }
}
export default {
    state,
    getters,
    mutations,
    actions
}
