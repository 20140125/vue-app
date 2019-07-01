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
import ApiLists from '../components/interface/api'
import MusicLists from '../components/interface/music'
import databaseLists from '../components/database/lists'

Vue.use(Router);

export default new Router({
    routes: [
        { path: '/login', name: 'Login', component: Login,meta:{ mode:'',title:'登录' } },
        { path: '/admin', name: 'Index', component: Index,meta:{ mode:'',title:'首页' } },
        { path:'/admin',component: Index,
            children:[
                { path: 'index', name:'Welcome',component:Welcome,meta:{ mode:'',title:'欢迎页' } },
                { path: 'auth/index', name:'AuthLists',component:AuthLists,meta:{ mode:'auth_role',title:'权限列表' } },
                { path: 'role/index', name:'RoleLists',component:RoleLists,meta:{ mode:'role',title:'角色列表' } },
                { path: 'user/index', name:'UserLists',component:UserLists,meta:{ mode:'user',title:'管理员列表' } },
                { path: 'log/index',  name:'SystemLog',component:SystemLog,meta:{ mode:'log',title:'日志列表' } },
                { path: 'file/index',  name:'SystemFile',component:SystemFile,meta:{ mode:'file',title:'文件列表' } },
                { path: 'api/index', name:'ApiLists',component:ApiLists,meta:{ mode:'api_lists',title:'接口详情' } },
                { path: 'music/index', name:'MusicLists',component:MusicLists,meta:{ mode:'music',title:'音乐列表' } },
                { path: 'database/index', name:'databaseLists',component:databaseLists,meta:{ mode:'',title:'数据表列表' } },
            ]
        },
    ]
})
