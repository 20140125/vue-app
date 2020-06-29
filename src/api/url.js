let url={
    //权限操作接口
    authLists:'/v1/auth/index',
    authSave:'/v1/auth/save',
    authUpdate:'/v1/auth/update',
    authDelete:'/v1/auth/delete',
    //角色操作接口
    roleLists:'/v1/role/index',
    roleSave:'/v1/role/save',
    roleUpdate:'/v1/role/update',
    roleDelete:'/v1/role/delete',
    //管理员操作接口
    userLists:'/v1/user/index',
    userSave:'/v1/user/save',
    userUpdate:'/v1/user/update',
    userDelete:'/v1/user/delete',
    userCenter:'/v1/user/center',
    saveUserCenter:'/v1/center/save',
    userBind:'/v1/user/bind',
    //系统日志操作接口
    logLists:'/v1/log/index',
    logSave:'/v1/log/save',
    logDelete:'/v1/log/delete',
    //基础配置
    configLists:'/v1/config/index',
    configSave:'/v1/config/save',
    configUpdate:'/v1/config/update',
    configValUpdate:'/v1/config/updateVal',
    configDelete:'/v1/config/delete',
    //接口列表
    apiLists:'/v1/api/index',
    apiSave:'/v1/api/save',
    apiUpdate:'/v1/api/update',
    //接口列表(markdown)
    apiDocLists:'/v1/apidoc/index',
    apiDocSave:'/v1/apidoc/save',
    apiDocUpdate:'/v1/apidoc/update',
    //接口分类
    categoryLists:'/v1/category/index',
    categorySave:'/v1/category/save',
    categoryUpdate:'/v1/category/update',
    categoryDelete:'/v1/category/delete',
    //数据表列表
    databaseLists:'/v1/database/index',
    databaseBackUp:'/v1/database/backup',
    databaseRepair:'/v1/database/repair',
    databaseOptimize:'/v1/database/optimize',
    databaseUpdateComment:'/v1/database/comment',
    //授权列表
    oauthLists:'/v1/oauth/index',
    oauthUpdate:'/v1/oauth/update',
    oauthDelete:'/v1/oauth/delete',
    oauthBind:'/v1/oauth/bind',
    sendMail:'/v1/oauth/sendMail',
    verifyCode:'/v1/oauth/verifyCode',
    //请求授权
    reqRuleLists:'/v1/req-rule/index',
    reqRuleSave:'/v1/req-rule/save',
    reqRuleUpdate:'/v1/req-rule/update',
    reqRuleDelete:'/v1/req-rule/delete',
    getAuthByToken:'/v1/req-rule/getAuth',
    //文件列表
    fileLists:'/v1/file/index',
    fileRead:'/v1/file/read',
    fileRename:'/v1/file/rename',
    fileChmod:'/v1/file/chmod',
    fileSave:'/v1/file/save',
    fileDelete:'/v1/file/delete',
    fileUpdate:'/v1/file/update',
    fileUpload:'/v1/file/upload',
    fileDownload:'/v1/file/download',
    fileCompression:'/v1/file/zip',
    fileDecompression:'/v1/file/unzip',
    imagePreview:'/v1/image/preview',
    //城市地区
    areaIndex:'/v1/area/index',
    areaLists:'/v1/area/lists',
    areaWeather:'/v1/area/weather',
    //聊天记录
    emotionLists:'/v1/emotion/index',
    chatLists:'/v1/chat/index',
    //推送列表
    pushList:'/v1/push/index',
    pushSave:'/v1/push/save',
    pushUpdate:'/v1/push/update',
    pushRead:'/v1/push/see',
    pushDelete:'/v1/push/delete',
    //相关组件
    tableComponent:'/v1/components/table',
    componentAction:'/v1/components/actions',
    excelExport:'/v1/excel/export',
    timeLineLists:'/v1/timeline/index',
    timeLineSave:'/v1/timeline/save',
    timeLineUpdate:'/v1/timeline/update',
    //公共操作接口
    tree:'/v1/menu',
    login:'/v1/login',
    logout:'/v1/logout',
    checkToken:'/v1/checkLogin',
    getConfig:'/v1/config',
    getCountData:'/v1/total',
    sendEmail:'/v1/sendEmail',
    checkCode:'/v1/checkCode',
    getCityName:'/v1/getCityName',
    confirmMail:'/v1/confirmMail',
    resetPass: '/v1/resetPass'
};
export default url
