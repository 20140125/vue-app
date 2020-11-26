let url = {
    // 权限操作接口
    authLists: '/v1/auth/index',
    authSave: '/v1/auth/save',
    authUpdate: '/v1/auth/update',
    authDelete: '/v1/auth/delete',
    // 角色操作接口
    roleLists: '/v1/role/index',
    roleSave: '/v1/role/save',
    roleUpdate: '/v1/role/update',
    roleDelete: '/v1/role/delete',
    // 管理员操作接口
    userLists: '/v1/user/index',
    userSave: '/v1/user/save',
    userUpdate: '/v1/user/update',
    userDelete: '/v1/user/delete',
    userCenter: '/v1/center/index',
    saveUserCenter: '/v1/center/save',
    userBind: '/v1/user/bind',
    // 系统日志操作接口
    logLists: '/v1/log/index',
    logDelete: '/v1/log/delete',
    // 基础配置
    configLists: '/v1/config/index',
    configSave: '/v1/config/save',
    configUpdate: '/v1/config/update',
    configDelete: '/v1/config/delete',
    // 接口列表
    apiLists: '/v1/api/index',
    apiSave: '/v1/api/save',
    apiUpdate: '/v1/api/update',
    // 接口列表(markdown)
    apiDocLists: '/v1/api_doc/index',
    apiDocSave: '/v1/api_doc/save',
    apiDocUpdate: '/v1/api_doc/update',
    // 接口分类
    categoryLists: '/v1/category/index',
    categorySave: '/v1/category/save',
    categoryUpdate: '/v1/category/update',
    categoryDelete: '/v1/category/delete',
    // 数据表列表
    databaseLists: '/v1/database/index',
    databaseBackUp: '/v1/database/backup',
    databaseRepair: '/v1/database/repair',
    databaseOptimize: '/v1/database/optimize',
    databaseUpdateComment: '/v1/database/comment',
    // 授权列表
    oauthLists: '/v1/oauth/index',
    oauthUpdate: '/v1/oauth/update',
    oauthDelete: '/v1/oauth/delete',
    oauthBind: '/v1/oauth/save',
    // 请求授权
    reqRuleLists: '/v1/req_rule/index',
    reqRuleSave: '/v1/req_rule/save',
    reqRuleUpdate: '/v1/req_rule/update',
    reqRuleDelete: '/v1/req_rule/delete',
    getAuthByToken: '/v1/req_rule/get',
    // 文件列表
    fileLists: '/v1/file/index',
    fileRead: '/v1/file/read',
    fileRename: '/v1/file/rename',
    fileChmod: '/v1/file/chmod',
    fileSave: '/v1/file/save',
    fileDelete: '/v1/file/delete',
    fileUpdate: '/v1/file/update',
    fileUpload: '/v1/file/upload',
    fileCompression: '/v1/file/zip',
    fileDecompression: '/v1/file/unzip',
    imageBed: '/v1/image/bed',
    // 城市地区
    areaIndex: '/v1/area/index',
    areaWeather: '/v1/area/weather',
    // 推送列表
    pushList: '/v1/push/index',
    pushSave: '/v1/push/save',
    pushUpdate: '/v1/push/update',
    pushRead: '/v1/push/see',
    pushDelete: '/v1/push/delete',
    // 相关组件
    tableComponent: '/v1/components/table',
    componentAction: '/v1/components/actions',
    excelExport: '/v1/excel/export',
    excelImport: '/v1/excel/import',
    timeLineLists: '/v1/timeline/index',
    timeLineSave: '/v1/timeline/save',
    timeLineUpdate: '/v1/timeline/update',
    // 公共操作接口
    menu: '/v1/common/menu',
    login: '/v1/common/login',
    reportCode: '/v1/common/report',
    logout: '/v1/common/logout',
    checkToken: '/v1/common/check_login',
    getConfig: '/v1/common/config',
    sendEmail: '/v1/common/send_email',
    checkCode: '/v1/common/check_code',
    getCityName: '/v1/common/get_city_name',
    resetPass: '/v1/common/reset_pass',
    logSave: '/v1/common/log_save',
    chatLists: '/v1/common/chat',
    areaLists: '/v1/common/area',
    emotionLists: '/v1/common/emotion',
    fileDownload: '/v1/common/download',
    sooGif: '/v1/common/image_bed'

}
export default url
