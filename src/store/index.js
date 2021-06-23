import { createStore, createLogger } from 'vuex'
import login from '@/store/modules/login'
import home from '@/store/modules/home'
import getters from '@/store/getters'
import mutations from '@/store/mutaions'
import state from '@/store/state'
/**
 * Vuex全局状态管理
 * @param options {Array}
 */
const debug = process.env.NODE_ENV !== 'production'
export default createStore({
    modules: {
        login,
        home
    },
    getters,
    mutations,
    state,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
