// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import http from './api/request'
import md5 from 'js-md5'
import store from './store'
import code from './api/code'
import apiLists from './api/api'
import 'mavon-editor/dist/css/index.css'
import mavonEditor from 'mavon-editor'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
Vue.use(contentmenu)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.use(mavonEditor)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.prototype.$http = http
Vue.prototype.md5 = md5
// 登录验证拦截 （校验token）
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    if (to.params.access_token) {
        store.commit('setToken', to.params.access_token)
    }
    // 404页面
    if (to.name === 'Empty') {
        next()
        return
    }
    if (to.name === 'chatDemo' && !localStorage.getItem('token')) {
        next('/login')
        return
    }
    // 登录页
    if (to.name === 'Login' || to.name === '/') {
        if (!store.state.login.token) {
            next()
            return
        }
        apiLists.CheckToken({token: (store.state.login.token ? store.state.login.token : localStorage.getItem('token'))}).then(response => {
            if (response && response.data.code === code.SUCCESS) {
                next({path: '/admin/index', redirect: to.path})
                store.commit('setUserInfo', response.data.item)
                return
            }
            next()
        })
    } else {
        apiLists.CheckToken({token: (store.state.login.token ? store.state.login.token : localStorage.getItem('token'))}).then(response => {
            if (response && response.data.code !== code.SUCCESS) {
                next({path: '/login', redirect: to.path})
                store.commit('setToken', '')
                return
            }
            store.commit('setUserInfo', response.data.item)
            // 用户权限验证 (admin  最高权限不做权限验证)
            let commonAuth = ['Empty', 'Welcome']
            if (store.state.login.userInfo.auth.indexOf(to.path) === -1 && !commonAuth.includes(to.name)) {
                let info = '你没有访问权限，请联系管理员【' + code.QQ + '】检验数据的正确性'
                ElementUI.MessageBox.alert(info).then(() => {
                    let req = {
                        user_id: store.state.login.userInfo.user_id,
                        href: [to.path]
                    }
                    apiLists.ReqRuleSave(req).then((res) => {
                        if (res && res.data.code === code.SUCCESS) {
                            let data = {
                                href: to.path.replace('admin', 'v1'),
                                msg: JSON.stringify({info: info, result: res.data.result}),
                                token: store.state.login.token
                            }
                            apiLists.LogSave(data).then((response) => {
                                if (response && response.data.code === code.SUCCESS) {
                                    this.$message.success(response.data.msg)
                                    location.href = 'tencent://message/?uin=' + code.QQ + '&Site=后台权限认证&Menu=yes'
                                }
                            })
                        }
                    })
                })
                next({path: '/admin/index', redirect: to.path})
            }
            next()
        })
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
