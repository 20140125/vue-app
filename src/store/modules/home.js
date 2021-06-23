import requestMethods from '@/api/methods'
import URLS from '@/api/urls'
import {ElMessage} from 'element-plus'
import func from '@/utils/func'

export const state = {
    tabs: [{ label: '欢迎页', value: '/admin/home/index' }],
    tabModel: { label: '欢迎页', value: '/admin/home/index' }
}
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
     * todo:获取导航栏
     * @param commit
     * @param state
     * @return {Promise<void>}
     */
    async getMenu({ commit, state }) {
        if (state.menuLists) {
            commit('UPDATE_MUTATIONS', { menuLists: state.menuLists }, { root: true })
        }
        let response = await requestMethods.__commonMethods(URLS.home.getMenu).catch(error => {
            ElMessage.error(JSON.stringify(error))
        })
        if (((response || {}).data || {}).code === 200) {
            commit('UPDATE_MUTATIONS', { menuLists: func.setTree(response.data.item.lists) }, { root: true })
        }
    },
    /**
     * todo:获取时间线
     * @param commit
     * @param state
     * @return {Promise<void>}
     */
    async getTimeLine({ commit, state }) {
        if (state.menuLists) {
            commit('UPDATE_MUTATIONS', { timeline: state.timeline })
        }
        let response = await requestMethods.__commonMethods(URLS.timeline.lists).catch(error => {
            ElMessage.error(JSON.stringify(error))
        })
        if (((response || {}).data || {}).code === 200) {
            commit('UPDATE_MUTATIONS', { timeline: response.data.item.lists.lists })
        }
    },
    /**
     * todo：添加tabs
     * @param state
     * @param commit
     * @param tabs
     */
    addTabs ({state, commit}, tabs) {
        let newTabs = JSON.parse(JSON.stringify(state.tabs))
        if (JSON.stringify(newTabs).indexOf(JSON.stringify(tabs)) === -1) {
            newTabs.push(tabs)
            commit('UPDATE_MUTATIONS', { tabs: newTabs, tabModel: tabs })
        }
    },
    /**
     * todo：删除tabs
     * @param state
     * @param commit
     * @param index
     */
    deleteTabs ({state, commit}, index) {
        let newTabs = JSON.parse(JSON.stringify(state.tabs))
        newTabs.splice(index, 1)
        commit('UPDATE_MUTATIONS', { tabs:newTabs, tabModel: newTabs[index + 1] || newTabs[index - 1] })
    }
}
export default {
    namespaced: true,
    actions,
    state,
    mutations
}
