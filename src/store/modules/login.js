import {Message,MessageBox } from "element-ui"
import apiLists from '../../api/api'
import code from '../../api/code'
import router from '../../router'
import func from '../../api/func'
import io from 'socket.io-client'
const md5 = require('js-md5');
const state={
    token:localStorage.getItem('token'),
    socketServer:'',
    avatarUrl:'',
    websocketServer:'',
    username:'',
    auth_url:'',
    menuLists:[],
    oauthConfig:[],
    role_id:0,
    uuid:''
};
const getters={
    token:state=>state.token,
    username:state=>state.username,
    auth_url:state=>state.auth_url,
    menuLists:state=>state.menuLists,
    oauthConfig:state=>state.oauthConfig,
    socketServer:state=>state.socketServer,
    avatarUrl:state=>state.avatarUrl,
    websocketServer:state=>state.websocketServer,
    role_id:state=>state.role_id,
    uuid:state=>state.uuid
};
const mutations={
    /**
     * todo:设置导航栏
     * @param state
     * @param menuLists
     */
    setMenuLists:function (state,menuLists) {
        state.menuLists = menuLists;
    },
    /**
     * todo:设置第三方配置
     * @param state
     * @param oauthConfig
     */
    setOauthConfig:function (state,oauthConfig) {
        state.oauthConfig = oauthConfig;
    },
    /**
     * todo:权限地址
     * @param state
     * @param auth_url
     */
    setAuthUrl:function (state,auth_url) {
        state.auth_url = auth_url;
    },
    /**
     * todo：用户token
     * @param state
     * @param token
     */
    setToken:function (state,token) {
        state.token = token;
        localStorage.setItem('token',token);
    },
    /**
     * todo：用户名称
     * @param state
     * @param username
     */
    setUserName:function (state,username) {
        state.username = username;
    },
    /**
     * todo：即时通讯服务
     * @param state
     * @param ip
     */
    setSocketServer:function (state,ip) {
        state.socketServer = io(ip);
    },
    /**
     * todo：用户头像
     * @param state
     * @param avatarUrl
     */
    setAvatarUrl:function (state,avatarUrl) {
        state.avatarUrl = avatarUrl;
    },
    /**
     * todo：websocketServer
     * @param state
     * @param websocketServer
     */
    setWebsocketServer:function (state,websocketServer) {
        state.websocketServer = new WebSocket(websocketServer);
    },
    /**
     * todo：角色ID
     * @param state
     * @param role_id
     */
    setRoleId:function (state,role_id) {
        state.role_id = role_id;
    },
    /**
     * todo：用户ID
     * @param state
     * @param uuid
     */
    setUUID:function (state,uuid) {
        state.uuid = uuid;
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
                commit('setRoleId',response.data.item.role_id);
                commit('setUUID',response.data.item.uuid);
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
    getAuthMenu:function({state,commit}) {
        if (state.menuLists.length>0){
            commit('setMenuLists',state.menuLists);
            return ;
        }
        if (state.username) {
            apiLists.AuthTree([]).then(response=>{
                if (response && response.data.code === code.SUCCESS) {
                    commit('setMenuLists',func.set_tree(response.data.item));
                }
            })
        } else {
            router.push({path:'/login'});
        }
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
        if (state.auth_url.indexOf(params.url)===-1 && params.url !=='/admin/index') {
            let info = '你没有访问权限，请联系管理员【' + code.QQ + '】检验数据的正确性！';
            MessageBox.alert(info).then(() => {
                let req = {
                    username:state.username,
                    href:[params.url]
                };
                apiLists.ReqRuleSave(req).then((res) => {
                    if (res && res.data.code === code.SUCCESS) {
                        let data = {
                            href: params.url.replace('admin','v1'),
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
