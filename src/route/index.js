import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    /* 首页 */
    {
      path: '/:access_token?',
      name: 'HomeIndex',
      component: () => import('../pages/home/Home'),
      meta: { title: '首页' }
    },
    /* 搜索页 */
    {
      path: '/home/search',
      name: 'HomeSearch',
      component: () => import('../pages/home/Search'),
      meta: { title: '热搜' }
    },
    /* 联系人 */
    {
      path: '/home/chat',
      name: 'ConnectPerson',
      component: () => import('../pages/home/Chat'),
      meta: { title: '联系人' }
    },
    {
      path: '/home/message/:id',
      name: 'MessageBox',
      component: () => import('../pages/home/Message'),
      meta: { title: '消息记录' }
    },
    /* 个人中心 */
    {
      path: '/home/users',
      name: 'UserCenter',
      component: () => import('../pages/home/Users'),
      meta: { title: '我的' }
    },
    {
      path: '/admin/home/login',
      name: 'LoginManage',
      component: () => import('../pages/Login'),
      meta: { title: '登录页' }
    },
    {
      path: '/admin',
      name: 'AdminManage',
      component: () => import('../pages/admin/Home'),
      children: [
        /* 欢迎页 */
        {
          path: 'home/index/:access_token?',
          name: 'HomeManage',
          component: () => import('../pages/admin/Index'),
          meta: { title: '欢迎页' }
        },
        /* 权限管理 */
        {
          path: 'auth/index',
          name: 'AuthManage',
          component: () => import('../pages/permission/Auth'),
          meta: { title: '权限列表' }
        },
        {
          path: 'role/index',
          name: 'RoleManage',
          component: () => import('../pages/permission/Role'),
          meta: { title: '角色列表' }
        },
        {
          path: 'permission/index',
          name: 'PermissionApply',
          component: () => import('../pages/permission/Apply'),
          meta: { title: '授权列表' }
        },
        /* 文件管理 */
        {
          path: 'file/index',
          name: 'FileManage',
          component: () => import('../pages/file/File'),
          meta: { title: '文件列表' }
        },
        /* 系统管理 */
        {
          path: 'push/index',
          name: 'PushManage',
          component: () => import('../pages/system/Push'),
          meta: { title: '系统通知' }
        },
        {
          path: 'config/index',
          name: 'SystemConfigManage',
          component: () => import('../pages/system/Config'),
          meta: { title: '系统配置' }
        },
        {
          path: 'database/index',
          name: 'DatabaseManage',
          component: () => import('../pages/system/Database'),
          meta: { title: '数据表列表' }
        },
        {
          path: 'log/index',
          name: 'SystemLogManage',
          component: () => import('../pages/system/Log'),
          meta: { title: '系统日志' }
        },
        {
          path: 'area/index',
          name: 'AreaManage',
          component: () => import('../pages/system/Area'),
          meta: { title: '城市列表' }
        },
        {
          path: 'tools/index',
          name: 'SystemTools',
          component: () => import('../pages/system/Tools'),
          meta: { title: '系统工具' }
        },
        {
          path: 'plugin/index',
          name: 'PluginManage',
          component: () => import('../pages/system/Plugin'),
          meta: { title: '插件管理' }
        },
        /* 用户管理 */
        {
          path: 'users/index',
          name: 'UsersManage',
          component: () => import('../pages/users/Users'),
          meta: { title: '用户列表' }
        },
        {
          path: 'userCenter/index',
          name: 'CenterManage',
          component: () => import('../pages/users/Center'),
          meta: { title: '个人中心' }
        },
        {
          path: 'oauth/index',
          name: 'OAuthManage',
          component: () => import('../pages/users/OAuth'),
          meta: { title: '授权用户' }
        },
        /* 接口管理 */
        {
          path: 'interfaceCategory/index',
          name: 'InterfaceManage',
          component: () => import('../pages/interface/Interface'),
          meta: { title: '接口列表' }
        },
        /* 同步工具 */
        {
          path: 'spider/index',
          name: 'SpiderManage',
          component: () => import('../pages/system/Spider'),
          meta: { title: '同步工具' }
        },
        /* 结果页 */
        {
          path: 'result/index',
          name: 'ResultManage',
          component: () => import('../pages/Result'),
          meta: { title: '错误页面' }
        }
      ]
    }
  ]
});
export default router;
