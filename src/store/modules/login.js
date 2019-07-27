import {Message} from "element-ui";
import apiLists from '../../api/api'
import code from '../../api/code'
import router from '../../router';
import func from '../../api/func'
const state={
    token:localStorage.getItem('token'),
    username:localStorage.getItem('username'),
    auth_url:localStorage.getItem('urls'),
    menuLists:[],
};
const getters={
    token:state=>state.token,
    username:state=>state.username,
    auth_url:state=>state.auth_url,
    menuLists:state=>state.menuLists
};
const mutations={
    setToken:function (state,token) {
        state.token = token;
        localStorage.setItem('token',token)
    },
    setUserName:function (state,username) {
        state.username = username;
        localStorage.setItem('username',username);
    },
    setMenuLists:function (state,menuLists) {
        state.menuLists = menuLists;
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
            if (response.data.code === code.SUCCESS){
                Message.success(response.data.msg);
                commit('setToken',response.data.item.token);
                commit('setUserName',response.data.item.username);
                router.push({path:'/admin/index'});
            }
        });
    },
    /**
     * todo：获取权限菜单
     * @param state
     * @param commit
     * @param username
     */
    getAuthMenu:function({state,commit},username){
        if (state.menuLists.length>0){
            commit('setMenuLists',state.menuLists);
            return ;
        }
        apiLists.AuthTree({username:username}).then(response=>{
            if (response.data.code === code.SUCCESS){
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
            if (response.data.code === code.SUCCESS){
                Message.success(response.data.msg);
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
            if (response.data.code === code.SUCCESS){
                Message.success(response.data.msg);
            }
        });
    }
};
export default {
    state,
    getters,
    mutations,
    actions
}
