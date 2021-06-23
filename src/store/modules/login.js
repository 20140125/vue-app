import requestMethods from '@/api/methods'
import URLS from '@/api/urls'
import { ElMessage } from 'element-plus'

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
     * @param authorized
     * @return {Promise<void>}
     */
    async checkAuthorized({ commit }, authorized) {
        let response = await requestMethods.__commonMethods(URLS.login.checkAuthorized, authorized).catch(error => {
            ElMessage.error(JSON.stringify(error))
        })
        if (((response || {}).data || {}).code === 200) {
            commit('UPDATE_MUTATIONS', { userInfo: response.data.item.lists, isAuthorized: true })
        }
    },
    /**
     * todo:登录系统
     * @param commit
     * @param user
     * @return {Promise<void>}
     */
    async loginSYS ({ commit }, user) {
        let response = await requestMethods.__commonMethods(URLS.login.loginSystem, user).catch(error => {
            ElMessage.error(JSON.stringify(error))
        })
        if (((response || {}).data || {}).code === 200) {
            commit('UPDATE_MUTATIONS', { userInfo: response.data.item.lists, isAuthorized: true })
            window.localStorage.setItem('token', response.data.item.lists.remember_token )
        }
    },
    /**
     * todo:验证码上报
     * @param commit
     * @param code
     * @return {Promise<void>}
     */
    async reportCode ({ commit }, code) {
        let response = await requestMethods.__commonMethods(URLS.login.reportCode, code).catch(error => {
            ElMessage.error(JSON.stringify(error))
        })
        if (((response || {}).data || {}).code === 200) {
            commit('UPDATE_MUTATIONS', { verifyCode: response.data.item.lists.code })
        }
    },
    /**
     * todo:发送邮件
     * @param commit
     * @param email
     * @return {Promise<void>}
     */
    async sendMail({ commit }, email) {
        let response = await requestMethods.__commonMethods(URLS.login.sendMail, email).catch(error => {
            ElMessage.error(JSON.stringify(error))
        })
        if (((response || {}).data || {}).code === 200) {
            commit('UPDATE_MUTATIONS', { mailLogin: true })
        }
    },
    /**
     * todo:授权登录配置
     * @param commit
     * @param state
     * @param oauthConfig
     * @return {Promise<boolean>}
     */
    async getOauthConfig({ commit, state }, oauthConfig) {
        if (state.oauthConfig) {
            commit('UPDATE_MUTATIONS', { oauthConfig: state.oauthConfig })
            return false
        }
        let response = await requestMethods.__commonMethods(URLS.login.oauthConfig, oauthConfig).catch(error => {
            ElMessage.error(JSON.stringify(error))
        })
        if (((response || {}).data || {}).code === 200) {
            commit('UPDATE_MUTATIONS', { oauthConfig: response.data.item.lists })
        }
    }
}
export default {
    namespaced: true,
    actions,
    mutations
}
