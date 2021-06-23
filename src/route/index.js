import { createWebHistory, createRouter } from 'vue-router'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name: 'Login', component: () => import('@/pages/Login'), meta: { title: 'RBAC权限系统--登录页' } },
        {
            path: '/admin',
            component: () => import('@/pages/Home'),
            children: [
                { path: 'home/index:access_token?', name: 'Home', component: () => import('@/pages/Index'), meta: { title: 'RBAC权限系统--欢迎页' } }
            ]
        }
    ]
})
export default router
