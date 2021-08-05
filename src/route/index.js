import { createWebHistory, createRouter } from 'vue-router'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name: 'LoginManage', component: () => import('@/pages/Login'), meta: { title: '登录页' } },
        { path: '/chat', name: 'ChatManage', component: () => import('@/components/chat/Main'), meta: { title: '聊天窗口' } },
        {
            path: '/admin',
            name: 'AdminManage',
            component: () => import('@/pages/Home'),
            children: [
                /* 欢迎页 */
                { path: 'home/index/:access_token?', name: 'HomeManage', component: () => import('@/pages/Index'), meta: { title: '欢迎页' } },
                /* 权限管理 */
                { path: 'auth/index', name: 'AuthManage', component: () => import('@/pages/permission/Auth'), meta: { title: '权限列表' } },
                { path: 'role/index', name: 'RoleManage', component: () => import('@/pages/permission/Role'), meta: { title: '角色列表' } },
                { path: 'permission/index', name: 'PermissionApply', component: () => import('@/pages/permission/Apply'), meta: { title: '权限申请' } },
                /* 文件管理 */
                { path: 'file/index', name: 'FileManage', component: () => import('@/pages/File'), meta: { title: '文件列表' } },
                /* 系统管理 */
                { path: 'push/index', name: 'PushManage', component: () => import('@/pages/system/Push'), meta: { title: '站内通知' } },
                { path: 'config/index', name: 'SystemConfigManage', component: () => import('@/pages/system/Config'), meta: { title: '系统配置' } },
                { path: 'database/index', name: 'DatabaseManage', component: () => import('@/pages/system/Database'), meta: { title: '数据表列表' } },
                { path: 'log/index', name: 'SystemLogManage', component: () => import('@/pages/system/Log'), meta: { title: '日志列表' } },
                { path: 'area/index', name: 'AreaManage', component: () => import('@/pages/system/Area'), meta: { title: '城市列表' } },
                /* 用户管理 */
                { path: 'users/index', name: 'UsersManage', component: () => import('@/pages/users/Users'),  meta: { title: '管理员列表' } },
                { path: 'userCenter/detail', name: 'CenterManage', component: () => import('@/pages/users/Center'),  meta: { title: '个人中心' } },
                { path: 'oauth/index', name: 'OAuthManage', component: () => import('@/pages/users/OAuth'),  meta: { title: '授权用户' } },
                /* 接口管理 */
                { path: 'interfaceCategory/index', name: 'InterfaceManage', component: () => import('@/pages/Interface'),  meta: { title: '接口列表' } }
            ]
        }
    ]
})
export default router
