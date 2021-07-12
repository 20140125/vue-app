import { createStore, createLogger } from 'vuex'
import login from '@/store/modules/login'
import home from '@/store/modules/home'
import chat from '@/store/modules/chat'
import file from '@/store/modules/file'
import auth from '@/store/modules/auth'
import role from '@/store/modules/role'
import push from '@/store/modules/push'
import config from '@/store/modules/system/config'

import mutations from '@/store/mutaions'
import state from '@/store/state'
import actions from '@/store/actions'
/**
 * Vuex全局状态管理
 * @param options {Array}
 */
const debug = process.env.NODE_ENV !== 'production'
export default createStore({
    modules: {
        login,
        home,
        chat,
        file,
        auth,
        role,
        push,
        config
    },
    mutations,
    state,
    actions,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
