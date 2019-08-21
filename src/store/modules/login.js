import {Message,MessageBox } from "element-ui"
import apiLists from '../../api/api'
import code from '../../api/code'
import router from '../../router'
import func from '../../api/func'
import io from 'socket.io-client'
const state={
    token:localStorage.getItem('token'),
    socketServer:'',
    username:'',
    auth_url:'',
    menuLists:[],
    oauthConfig:[]
};
const getters={
    token:state=>state.token,
    username:state=>state.username,
    auth_url:state=>state.auth_url,
    menuLists:state=>state.menuLists,
    oauthConfig:state=>state.oauthConfig,
    socketServer:state=>state.socketServer
};
const mutations={
    setToken:function (state,token) {
        state.token = token;
        localStorage.setItem('token',token)
    },
    setUserName:function (state,username) {
        state.username = username;
    },
    setMenuLists:function (state,menuLists) {
        state.menuLists = menuLists;
    },
    setAuthUrl:function (state,auth_url) {
        state.auth_url = auth_url;
    },
    setOauthConfig:function (state,oauthConfig) {
        state.oauthConfig = oauthConfig;
    },
    setSocketServer:function (state,ip) {
        state.socketServer = io(ip);
    }
};
const actions={
    /**
     * todo：系统登录
     * @param state
     * @param commit
     * @param users
     */
    loginSystem:function ({state,commit},users) {
        apiLists.LoginSys(users).then(response=>{
            if (response && response.data.code === code.SUCCESS) {
                commit('setToken',response.data.item.token);
                commit('setUserName',response.data.item.username);
                commit('setSocketServer',response.data.item.ip);
                router.push({path:'/admin/index'});
            }
        });
    },
    /**
     * TODO：获取配置
     * @param state
     * @param commit
     * @param name
     */
    getOauthConfig:function({state,commit},name) {
        apiLists.GetConfig({name:name}).then(response=>{
            if (response && response.data.code === code.SUCCESS) {
                commit('setOauthConfig',response.data.item);
            }
        })
    },
    /**
     * todo：获取权限菜单
     * @param state
     * @param commit
     * @param username
     */
    getAuthMenu:function({state,commit},username) {
        if (state.menuLists.length>0){
            commit('setMenuLists',state.menuLists);
            return ;
        }
        apiLists.AuthTree({username:username}).then(response=>{
            if (response && response.data.code === code.SUCCESS) {
                commit('setMenuLists',func.set_tree(response.data.item));
            }
        })
    },
    /**
     * todo：系统登出
     * @param state
     * @param commit
     * @param token
     */
    logoutSystem:function ({state,commit},token) {
        apiLists.LogoutSys({token:token}).then(response=>{
            if (response && response.data.code === code.SUCCESS) {
                commit('setToken','');
                commit('setUserName','');
                router.push({path:'/login'});
            }
        })
    },
    /**
     * todo：保存日志
     * @param state
     * @param commit
     * @param params
     */
    saveSystemLog:function ({state,commit},params) {
        params.username = state.username;
        apiLists.LogSave(params).then(response=>{
            if (response && response.data.code === code.SUCCESS) {
                Message.success(response.data.msg);
            }
        });
    },
    /**
     * todo：权限校验
     * @param state
     * @param commit
     * @param params
     */
    checkAuth:function ({state,commit},params) {
        params.url = params.url.replace('v1','admin');
        if (state.auth_url.indexOf(params.url)===-1 && params.url !=='/admin/index' && state.username!=='admin') {
            let info = '你没有访问权限，请联系管理员【' + code.QQ + '】检验数据的正确性！！'
            MessageBox.alert(info).then(() => {
                let req = {
                    username:state.username,
                    href:[params.url]
                };
                apiLists.ReqRuleSave(req).then((res) => {
                    if (res && res.data.code === code.SUCCESS) {
                        let data = {
                            href: params.url,
                            msg: JSON.stringify({info: info, result: res.data.result}),
                            token: state.token
                        };
                        apiLists.LogSave(data).then((response) => {
                            if (response && response.data.code === code.SUCCESS) {
                                Message.success(response.data.msg);
                                location.href = 'tencent://message/?uin=' + code.QQ + '&Site=后台权限认证&Menu=yes';
                            }
                        });
                    }
                });
            });
        }
    }
};
export default {
    state,
    getters,
    mutations,
    actions
}
