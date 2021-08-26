let urls = {
    /* todo:登录 */
    login: {
        loginSystem: '/api/v1/account/login',
        reportCode: '/api/v1/report/code',
        checkAuthorized: '/api/v1/check/authorized',
        sendMail: '/api/v1/mail/send',
        oauthConfig: '/api/v1/oauth/config'
    },
    /* todo:导航栏 */
    home: {
        getMenu: '/api/v1/common/menu'
    },
    /* todo:时间线 */
    timeline: {
        lists: '/api/v1/timeline/index'
    },
    /* todo:用户管理 */
    users: {
        lists: '/api/v1/users/index',
        update: '/api/v1/users/update',
        cache: '/api/v1/users/cache'
    },
    /* todo:授权优惠 */
    oauth: {
        lists: '/api/v1/oauth/index',
        update: '/api/v1/oauth/update'
    },
    /* todo:个人中心 */
    userCenter: {
        get: '/api/v1/userCenter/index',
        update: '/api/v1/userCenter/update'
    },
    /* todo:权限 */
    auth: {
        lists: '/api/v1/auth/index',
        save: '/api/v1/auth/save',
        update: '/api/v1/auth/update',
        tree: '/api/v1/auth/tree'
    },
    /* todo:日志 */
    log: {
        lists: '/api/v1/log/index',
        delete: '/api/v1/log/delete'
    },
    /* todo:角色 */
    role: {
        lists: '/api/v1/role/index',
        auth: '/api/v1/role/auth',
        update: '/api/v1/role/update',
        save: '/api/v1/role/save'
    },
    /* todo:权限申请 */
    permission: {
        lists: '/api/v1/permission/index',
        get: '/api/v1/permission/get',
        save: '/api/v1/permission/save',
        update: '/api/v1/permission/update'
    },
    /* todo:文件 */
    file: {
        lists: '/api/v1/file/index',
        read: '/api/v1/file/read',
        update: '/api/v1/file/update',
        zip: '/api/v1/file/zip',
        unzip: '/api/v1/file/unzip',
        delete: '/api/v1/file/delete',
        upload: '/api/v1/file/upload',
        chmod: '/api/v1/file/chmod',
        rename: '/api/v1/file/rename',
        save: '/api/v1/file/save'
    },
    /* todo:配置 */
    config: {
        lists: '/api/v1/config/index',
        save: '/api/v1/config/save',
        update: '/api/v1/config/update'
    },
    /* todo:接口分类 */
    interfaceCategory: {
        lists: '/api/v1/interfaceCategory/index',
        save: '/api/v1/interfaceCategory/save',
        update: '/api/v1/interfaceCategory/update',
        delete: '/api/v1/interfaceCategory/delete'
    },
    /* todo:接口详情 */
    interface: {
        save: '/api/v1/interface/save',
        update: '/api/v1/interface/update',
        get: '/api/v1/interface/detail'
    },
    /* todo:地区 */
    area: {
        lists: '/api/v1/area/index',
        cache: '/api/v1/area/cache',
        weather: '/api/v1/area/weather'
    },
    /* todo:数据库 */
    database: {
        lists: '/api/v1/database/index',
        backup: '/api/v1/database/backup',
        optimize: '/api/v1/database/optimize',
        repair: '/api/v1/database/repair',
        alter: '/api/v1/database/alter'
    },
    /* todo:站内通知 */
    push: {
        lists: '/api/v1/push/index',
        save: '/api/v1/push/save',
        update: '/api/v1/push/update'
    },
    tools: {
        getAddress: '/api/v1/tools/getAddress',
        getWeather: '/api/v1/tools/getWeather'
    },
    spider: {
        lists: '/api/v1/spider/index',
        running: '/api/v1/spider/running'
    },
    /* todo:域名 */
    // baseURL: process.env.NODE_ENV !== 'production' ? 'http://www.laravel.com' : 'https://www.fanglonger.com'
    baseURL: 'https://www.fanglonger.com'

};
export default urls;
