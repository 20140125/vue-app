import url from './url';
import request from './request.js'
import qs from 'qs';
const access_token = {
    token:localStorage.getItem('token'),
};
/**
 * TODO:登录系统
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const loginSys = function (params) {
    return request.post(url.login,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:获取配置
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const getConfig = function (params) {
    return request.post(url.getConfig,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:登出系统
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const logoutSys = function (params) {
    return request.post(url.logout,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:日志保存
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const logSave = function (params) {
    return request.post(url.logSave,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:校验TOKEN
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const checkToken = function (params) {
    return request.post(url.checkToken,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:权限列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const authLists = function (params) {
    return request.post(url.authLists,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:角色列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const roleLists = function(params){
    return request.post(url.roleLists,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:导航栏数据
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const authTree = function(params){
    return request.post(url.tree,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:管理员列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const userLists = function(params){
    return request.post(url.userLists,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:个人中心
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const userCenter = function(params){
    return request.post(url.userCenter,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:日志列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const logLists = function(params){
    return request.post(url.logLists,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:接口详情
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const apiLists = function (params) {
    return request.post(url.apiLists,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:接口详情 (markdown)
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const apiDocLists = function (params) {
    return request.post(url.apiDocLists,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:接口保存 (markdown)
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const apiDocSave = function (params) {
    return request.post(url.apiDocSave,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:接口更新 (markdown)
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const apiDocUpdate = function (params) {
    return request.post(url.apiDocUpdate,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:接口分类列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const categoryLists = function (params) {
    return request.post(url.categoryLists,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:删除接口分类
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const categoryDelete = function (params) {
    return request.post(url.categoryDelete,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:文件列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileLists = function (params) {
    return request.post(url.fileLists,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:文件读取
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileRead = function (params) {
    return request.post(url.fileRead,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:文件重命名
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileRename = function (params) {
    return request.post(url.fileRename,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:文件保存
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileSave = function (params) {
    return request.post(url.fileSave,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:文件删除
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileDelete = function (params) {
    return request.post(url.fileDelete,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:数据表列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseLists = function (params) {
    return request.post(url.databaseLists,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:数据表备份
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseBackup = function (params) {
    return request.post(url.databaseBackUp,qs.stringify(Object.assign(access_token,params)));
};
/**
 * TODO:数据表修复
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseRepair = function (params) {
    return request.post(url.databaseRepair,qs.stringify(Object.assign(access_token,params)));
};
/**
 * TODO:数据表优化
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseOptimize = function (params) {
    return request.post(url.databaseOptimize,qs.stringify(Object.assign(access_token,params)));
};
/**
 * TODO:修改数据表注释
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseUpdateComment = function (params) {
    return request.post(url.databaseUpdateComment,qs.stringify(Object.assign(access_token,params)));
}
/**
 * TODO:文件压缩
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const compressionFile = function (params) {
    return request.post(url.fileCompression,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:文件解压
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const decompressionFile = function (params) {
    return request.post(url.fileDecompression,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:图片查看
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const imagePreview = function (params) {
    return request.post(url.imagePreview,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:配置列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const configLists = function (params) {
    return request.post(url.configLists,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:修改配置值
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const configValUpdate = function (params) {
    return request.post(url.configValUpdate,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:授权用户列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const oauthLists = function (params) {
    return request.post(url.oauthLists,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:申请权限列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const reqRuleLists = function (params) {
    return request.post(url.reqRuleLists,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:申请权限保存
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const reqRuleSave = function (params) {
    return request.post(url.reqRuleSave,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:根据角色获取权限
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const getAuthByToken = function (params) {
    return request.post(url.getAuthByToken,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:邮件发送
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const sendEmail = function (params) {
    return request.post(url.sendMail,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:校验验证码
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const verifyCode = function (params) {
    return request.post(url.verifyCode,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:城市列表
 * @param params
 * @param href
 * @returns {Promise<AxiosResponse<T>>}
 */
const areaLists = function (params,href) {
    return request.post(href,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:城市天气
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const areaWeather = function (params) {
    return request.post(url.areaWeather,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO：站内信息推送
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const pushList = function (params) {
    return request.post(url.pushList,qs.stringify(Object.assign(access_token,params)))
}
/**
 * TODO:通知已查看
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const pushRead = function (params) {
    return request.post(url.pushRead,qs.stringify(Object.assign(access_token,params)))
}
/**
 * TODO:表情列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const emotionLists = function (params) {
    return request.post(url.emotionLists,qs.stringify(Object.assign(access_token,params)))
}
/**
 * TODO:获取历史聊天记录
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const chatLists = function (params) {
    return request.post(url.chatLists,qs.stringify(Object.assign(access_token,params)))
}
/**
 * TODO:获取记录总数
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const getCountData = function (params) {
    return request.post(url.getCountData,qs.stringify(Object.assign(access_token,params)))
}
const interfaceLists = {
    LoginSys:loginSys,
    LogoutSys:logoutSys,
    LogSave:logSave,
    CheckToken:checkToken,
    AuthLists:authLists,
    RoleLists:roleLists,
    AuthTree:authTree,
    UserLists:userLists,
    UserCenter:userCenter,
    LogLists:logLists,
    ApiLists:apiLists,
    ApiDocLists:apiDocLists,
    ApiDocSave:apiDocSave,
    ApiDocUpdate:apiDocUpdate,
    CategoryLists:categoryLists,
    FileLists:fileLists,
    FileRead:fileRead,
    FileRename:fileRename,
    FileSave:fileSave,
    FileDelete:fileDelete,
    DatabaseLists:databaseLists,
    DatabaseBackup:databaseBackup,
    DatabaseRepair:databaseRepair,
    DatabaseOptimize:databaseOptimize,
    DatabaseUpdateComment:databaseUpdateComment,
    CategoryDelete:categoryDelete,
    Compression:compressionFile,
    Decompression:decompressionFile,
    ImagePreview:imagePreview,
    ConfigLists:configLists,
    ConfigValUpdate:configValUpdate,
    GetConfig:getConfig,
    OauthLists:oauthLists,
    ReqRuleLists:reqRuleLists,
    ReqRuleSave:reqRuleSave,
    GetAuthByToken:getAuthByToken,
    SendEmail:sendEmail,
    VerifyCode:verifyCode,
    AreaLists:areaLists,
    AreaWeather:areaWeather,
    PushList:pushList,
    PushRead:pushRead,
    ChatLists:chatLists,
    EmotionLists:emotionLists,
    GetCountData:getCountData
};
export default interfaceLists;
