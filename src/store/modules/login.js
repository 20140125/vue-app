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
export const actions =  {
    /**
     * todo:校验登录态
     * @param commit
     * @param state
     * @param authorized
     * @return {Promise<boolean>}
     */
    async checkAuthorized({ commit, state }, authorized) {
        if (state.userInfo) {
            commit('UPDATE_MUTATIONS', { userInfo: state.userInfo })
            return false
        }
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.login.checkAuthorized, authorized).then(result => {
                commit('UPDATE_MUTATIONS', { userInfo: ((result.data || {}).item || {}).lists || {}, isAuthorized: true })
                resolve(result)
            }).catch(error => {
                commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true })
                reject(error)
            })
        })
    },
    /**
     * todo:登录系统
     * @param commit
     * @param payload
     * @return {Promise<void>}
     */
    async loginSYS ({ commit }, payload) {
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.login.loginSystem, payload).then(result => {
                commit('UPDATE_MUTATIONS', { userInfo: ((result.data || {}).item || {}).lists || {}, isAuthorized: true })
                window.localStorage.setItem('token', (((result.data || {}).item || {}).lists || {}).remember_token || '' )
                resolve(result)
            }).catch(error => {
                commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true })
                reject(error)
            })
        })
    },
    /**
     * todo:验证码上报
     * @param commit
     * @param payload
     * @return {Promise<void>}
     */
    async reportCode ({ commit }, payload) {
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.login.reportCode, payload).then(result => {
                commit('UPDATE_MUTATIONS', { verifyCode: (((result.data || {}).item || {}).lists || {}).code || '' })
                resolve(result)
            }).catch(error => {
                commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true })
                reject(error)
            })
        })
    },
    /**
     * todo:发送邮件
     * @param commit
     * @param payload
     * @return {Promise<void>}
     */
    async sendMail({ commit }, payload) {
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.login.sendMail, payload).then(result => {
                commit('UPDATE_MUTATIONS', { mailLogin: true })
                resolve(result)
            }).catch(error => {
                commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true })
                reject(error)
            })
        })
    },
    /**
     * todo:授权登录配置
     * @param commit
     * @param state
     * @param payload
     * @return {Promise<boolean>}
     */
    async getOauthConfig({ commit, state }, payload) {
        if (state.oauthConfig) {
            commit('UPDATE_MUTATIONS', { oauthConfig: state.oauthConfig })
            return false
        }
        return new Promise((resolve, reject) => {
            requestMethods.__commonMethods(URLS.login.oauthConfig, payload).then(result => {
                commit('UPDATE_MUTATIONS', { oauthConfig: ((result.data || {}).item || {}).lists || {} })
                resolve(result)
            }).catch(error => {
                commit('UPDATE_MUTATIONS', { error: (error.data || {}).item || {} }, { root: true })
                reject(error)
            })
        })
    }
}
export default {
    namespaced: true,
    actions,
    mutations
}
