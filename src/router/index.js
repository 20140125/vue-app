import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/index'
import Welcome from '../components/common/index'
import Login from '../components/login'
import AuthLists from '../components/auth/lists'
import RoleLists from '../components/role/lists'
import UserLists from '../components/user/lists'
import SystemLog from '../components/system/log'
import SystemFile from '../components/system/file'
import ConfigLists from '../components/system/config'
import ApiLists from '../components/interface/api'
import DatabaseLists from '../components/database/lists'
import OauthLists from '../components/oauth/lists'
import ReqRuleLists from '../components/req_rule/lists'
import AreaLists from '../components/area/lists'
import PushList from '../components/system/push'
import Empty from '../components/empty'

Vue.use(Router);

export default new Router({
    routes: [
        { path: '/', name: '/', component: Login,meta:{ mode:'',title:'登录' } },
        { path: '/login', name: 'Login', component: Login,meta:{ mode:'',title:'登录' } },
        { path: '/404', name: 'Empty', component: Empty,meta:{ mode:'',title:'404' } },
        { path: '/admin', name: 'Admin', component: Index,meta:{ mode:'',title:'首页' } },
        { path:'/admin',component: Index,
            children:[
                { path: 'index/:access_token?', name:'Welcome',component:Welcome,meta:{ mode:'',title:'欢迎页' } },
                { path: 'auth/index', name:'AuthLists',component:AuthLists,meta:{ mode:'rule',title:'权限列表' } },
                { path: 'role/index', name:'RoleLists',component:RoleLists,meta:{ mode:'role',title:'角色列表' } },
                { path: 'user/index', name:'UserLists',component:UserLists,meta:{ mode:'user',title:'管理员列表' } },
                { path: 'oauth/index', name:'OauthLists', component:OauthLists,meta:{ mode:'oauth',title:'授权列表' }},
                { path: 'req-rule/index', name:'ReqRuleLists', component:ReqRuleLists,meta:{ mode:'req_rule',title:'申请授权列表' }},
                { path: 'log/index',  name:'SystemLog',component:SystemLog,meta:{ mode:'log',title:'日志列表' } },
                { path: 'file/index',  name:'SystemFile',component:SystemFile,meta:{ mode:'file',title:'文件列表' } },
                { path: 'config/index',  name:'ConfigLists',component:ConfigLists,meta:{ mode:'config',title:'基础配置' } },
                { path: 'category/index', name:'CategoryLists',component:ApiLists,meta:{ mode:'api_lists',title:'接口详情' } },
                { path: 'database/index', name:'DatabaseLists',component:DatabaseLists,meta:{ mode:'',title:'数据表列表' } },
                { path: 'area/index', name:'AreaLists',component:AreaLists,meta:{ mode:'china_area',title:'城市列表' } },
                { path: 'push/index', name:'PushList',component:PushList,meta:{ mode:'push',title:'推送列表' }}
            ]
        },
        { path: '*',redirect:'/404'}
    ]
})
