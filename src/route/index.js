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
                { path: 'home/index:access_token?', name: 'HomeManage', component: () => import('@/pages/Index'), meta: { title: '欢迎页' } },
                { path: 'auth/index', name: 'AuthManage', component: () => import('@/pages/Auth'), meta: { title: '权限列表' } },
                { path: 'role/index', name: 'RoleManage', component: () => import('@/pages/Role'), meta: { title: '角色列表' } },
                { path: 'file/index', name: 'FileManage', component: () => import('@/pages/File'), meta: { title: '文件列表' } },
                { path: 'config/index', name: 'SystemConfigManage', component: () => import('@/pages/system/Config'), meta: { title: '系统配置' } },
                { path: 'push/index', name: 'PushManage', component: () => import('@/pages/Push'), meta: { title: '站内通知' } }
            ]
        }
    ]
})
export default router
