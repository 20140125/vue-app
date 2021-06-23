import { createApp } from 'vue'
import 'element-plus/lib/theme-chalk/index.css'
import 'dayjs/locale/zh-cn'
import installElementPlus from './plugins/element'
import locale from 'element-plus/lib/locale/lang/zh-cn'


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

// 权限拦截
router.beforeEach(async (to, from, next) => {
    /* todo:设置标题 */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    /* todo:地址中存在access_token (第三方授权登录) */
    if (to.params.access_token) {
        store.commit('UPDATE_MUTATIONS', {token: to.params.access_token}, { root: true })
    }
    /* todo:登录页校验权限 */
    if (to.name === 'Login') {
        !store.state.token ? next () : await store.dispatch('login/checkAuthorized', { token: store.state.token || localStorage.getItem('token') }).then(() => {
            store.state.login.isAuthorized ? next({path: '/admin/home/index'}) : next()
        })
    } else {
        /* todo:登录后校验权限 */
        await store.dispatch('login/checkAuthorized', { token: store.state.token || localStorage.getItem('token') }).then(() => {
            !store.state.login.isAuthorized ? next({path: '/login'}) : next()
        })
    }
})
// 挂载实例
app.mount('#app')
