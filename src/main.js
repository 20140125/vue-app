import { createApp } from 'vue'
import 'element-plus/lib/theme-chalk/index.css'
import 'dayjs/locale/zh-cn'
import installElementPlus from './plugins/element'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import JsonViewer from 'vue3-json-viewer'

import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
/*todo: TodoList 任务列表*/
import '@kangc/v-md-editor/lib/theme/style/github.css'
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
/*todo: LineNumber 代码行号*/
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'
import createLineNumberPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'
/*todo: Tip 提示插件*/
import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index'
import '@kangc/v-md-editor/lib/plugins/tip/tip.css'

// highlightjs
import hljs from 'highlight.js'

import store from '@/store/index'
/* 引入组件 */
import App from './App'
/* 引入资源 */
import router from './route'
/* 创建app */
const app = createApp(App)
/* 注入路由 */
app.use(router)
/* 引入vuex */
app.use(store)
/* 引入element */
app.use(installElementPlus, { locale })
/* 引入JsonViewer */
app.use(JsonViewer)

VMdEditor.use(githubTheme, {
    Hljs: hljs,
})
VMdEditor.use(createTodoListPlugin())
VMdEditor.use(createLineNumberPlugin())
VMdEditor.use(createTipPlugin())
app.use(VMdEditor)

// 权限拦截
router.beforeEach(async (to, from, next) => {
    /* todo:设置标题 */
    if ((to.meta || {}).title || '') {
        document.title = `RBAC权限系统 -- ${to.meta.title}`
    }
    /* todo:地址中存在access_token (第三方授权登录) */
    if (to.params.access_token) {
        window.localStorage.setItem('token', to.params.access_token || '')
        await store.commit('UPDATE_MUTATIONS', { token: to.params.access_token }, { root: true })
        await store.commit('home/UPDATE_MUTATIONS', { tabs: [{ label: '欢迎页', value: '/admin/home/index' }], tabModel: { label: '欢迎页', value: '/admin/home/index' } })
        next({ path: '/admin/home/index', redirect: to.path })
    }
    /* todo:登录页校验权限 */
    if (to.name === 'LoginManage') {
        !store.state.token ? next () : await store.dispatch('login/checkAuthorized', { token: store.state.token }).then(() => {
            store.state.login.isAuthorized ? next({ path: '/admin/home/index', redirect: to.path }) : next()
        })
    } else {
        /* todo:登录后校验权限 */
        await store.dispatch('login/checkAuthorized', { token: store.state.token }).then(() => {
            !store.state.login.isAuthorized ? next({ path: '/login', redirect: to.path }) : next()
        })
    }
})
// 挂载实例
app.mount('#app')
