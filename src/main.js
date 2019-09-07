// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI, {Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import http from './api/request'
import md5 from 'js-md5'
import store from './store'
import code from "./api/code"
import apiLists from './api/api'
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.prototype.$http = http;
Vue.prototype.md5 = md5;

// 登录验证拦截 （校验token）
router.beforeEach((to,from,next)=>{
    if (to.meta.title){
        document.title = to.meta.title;
    }
    if (to.params.access_token){
        store.commit('setToken',to.params.access_token);
    }
    if (to.name === 'Login' || to.name === '/') {
        if (!store.state.login.token) {
            next();
            return ;
        }
        apiLists.CheckToken({token:store.state.login.token}).then(response=>{
            if (response && response.data.code === code.SUCCESS) {
                next({path:'/admin/index',redirect:to.path});
                store.commit('setAuthUrl',response.data.item.auth);
                store.commit('setToken',response.data.item.token);
                store.commit('setUserName',response.data.item.username);
                store.commit('setSocketServer',response.data.item.ip);
                store.commit('setAvatarUrl',response.data.item.avatar_url);
                return ;
            }
            next();
        });
    }  else {
        apiLists.CheckToken({token:store.state.login.token}).then(response=>{
            if (response && response.data.code !== code.SUCCESS){
                store.commit('setToken','');
                next({path:'/login',redirect:to.path});
                return ;
            }
            store.commit('setAuthUrl',response.data.item.auth);
            store.commit('setToken',response.data.item.token);
            store.commit('setUserName',response.data.item.username);
            store.commit('setSocketServer',response.data.item.ip);
            store.commit('setAvatarUrl',response.data.item.avatar_url);
            //用户权限验证 (admin  最高权限不做权限验证)
            if (store.state.login.auth_url.indexOf(to.path)===-1 && to.name !=='Welcome' && store.state.login.username!=='admin') {
                let info = '你没有访问权限，请联系管理员【'+code.QQ+'】检验数据的正确性'
                ElementUI.MessageBox.alert(info).then(()=>{
                    let req = {
                        username:store.state.login.username,
                        href:[to.path]
                    };
                    apiLists.ReqRuleSave(req).then((res)=>{
                        if (res && res.data.code === code.SUCCESS) {
                            let data = {
                                href: to.path,
                                msg: JSON.stringify({info: info, result: res.data.result}),
                                token: store.state.login.token
                            };
                            apiLists.LogSave(data).then((response)=>{
                                if (response && response.data.code === code.SUCCESS) {
                                    Message.success(response.data.msg);
                                    location.href='tencent://message/?uin='+code.QQ+'&Site=后台权限认证&Menu=yes';
                                }
                            });
                        }
                    });
                });
                next({path:'/admin/index',redirect:to.path})
            }
            next();
        });
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
