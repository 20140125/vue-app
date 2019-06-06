let url={
    //权限操作接口
    authLists:'/v1/auth/index',
    authSave:'/v1/auth/save',
    authUpdate:'/v1/auth/update',
    //角色操作接口
    roleLists:'/v1/role/index',
    roleSave:'/v1/role/save',
    roleUpdate:'/v1/role/update',
    //管理员操作接口
    userLists:'/v1/user/index',
    userSave:'/v1/user/save',
    userUpdate:'/v1/user/update',
    //系统日志操作接口
    logLists:'/v1/log/index',
    logSave:'/v1/log/save',
    //接口列表
    apiLists:'/v1/api/index',
    apiSave:'/v1/api/save',
    apiUpdate:'/v1/api/update',
    //接口分类
    categorySave:'/v1/category/save',
    categoryUpdate:'/v1/category/update',

    //数据表列表
    databaseLists:'/v1/database/index',
    //音乐列表
    musicLists:'/v1/music/index',
    musicPlay:'/v1/music/play',

    //文件列表
    fileLists:'/v1/file/index',
    fileRead:'/v1/file/read',
    fileRename:'/v1/file/rename',
    fileSave:'/v1/file/save',
    fileDelete:'/v1/file/delete',
    fileUpdate:'/v1/file/update',
    localLists:'/v1/local/index',
    localTools:'/v1/local/tools',

    //公共操作接口
    tree:'/v1/menu',
    login:'/v1/user/login',
    logout:'/v1/logout',
    checkToken:'/v1/checkLogin'
};
export default url