let urls  = {
    /* todo:登录 */
    login: {
        loginSystem: '/v1/account/login',
        reportCode: '/v1/report/code',
        checkAuthorized: '/v1/check/authorized',
        sendMail: '/v1/mail/send',
        oauthConfig: '/v1/oauth/config'
    },
    /* todo:导航栏 */
    home: {
        getMenu: '/v1/common/menu'
    },
    /* todo:时间线 */
    timeline: {
        lists: '/v1/timeline/index'
    },
    /* todo:用户管理 */
    users: {
        lists: '/v1/users/index',
        update: '/v1/users/update',
        cache: '/v1/users/cache'
    },
    /* todo:授权优惠 */
    oauth: {
        lists: '/v1/oauth/index',
        update: '/v1/oauth/update'
    },
    /* todo:个人中心 */
    userCenter: {
        get: '/v1/userCenter/index',
        update: '/v1/userCenter/update'
    },
    /* todo:权限 */
    auth: {
        lists: '/v1/auth/index',
        save: '/v1/auth/save',
        update: '/v1/auth/update',
        tree: '/v1/auth/tree'
    },
    /* todo:日志 */
    log: {
        lists: '/v1/log/index',
        delete: '/v1/log/delete'
    },
    /* todo:角色 */
    role: {
        lists: 'v1/role/index',
        auth: '/v1/role/auth',
        update: '/v1/role/update',
        save: '/v1/role/save'
    },
    /* todo:权限申请 */
    permission: {
        lists: '/v1/permission/index',
        get: '/v1/permission/get',
        save: '/v1/permission/save',
        update: '/v1/permission/update'
    },
    /* todo:文件 */
    file: {
        lists: '/v1/file/index',
        read: '/v1/file/read',
        update: '/v1/file/update',
        zip: '/v1/file/zip',
        unzip: '/v1/file/unzip',
        delete: '/v1/file/delete',
        upload: '/v1/file/upload',
        chmod: '/v1/file/chmod',
        rename: '/v1/file/rename',
        save: '/v1/file/save'
    },
    /* todo:配置 */
    config: {
        lists: '/v1/config/index',
        save: '/v1/config/save',
        update: '/v1/config/update',
        get: '/v1/config/get'
    },
    /* todo:接口 */
    interface: {
        lists: '/v1/interface/index',
        save: '/v1/interface/save',
        update: '/v1/interface/update',
        get: '/v1/interface/detail',
        delete: '/v1/interface/delete'
    },
    /* todo:地区 */
    area: {
        lists: '/v1/area/index',
        cache: '/v1/area/cache',
        weather: '/v1/area/weather'
    },
    /* todo:数据库 */
    database: {
        lists: '/v1/database/index',
        backup: '/v1/database/backup',
        optimize: '/v1/database/optimize',
        repair: '/v1/database/repair',
        alter: '/v1/database/alter'
    },
    /* todo:站内通知 */
    push: {
        lists: '/v1/push/index',
        save: '/v1/push/save',
        update: '/v1/push/update'
    },
    /* todo:域名 */
    baseURL: process.env.NODE_ENV !== 'production' ? 'http://www.laravel.com/api' : 'https://www.fanglonger.com/api'
}
export default urls
