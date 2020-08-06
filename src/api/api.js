import url from './url';
import request from './request.js'
import qs from 'qs';
const access_token = {
    "token":localStorage.getItem('token'),
};
/**
 * TODO:数据上报
 * @param url
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const reportSys = async function (url,params = {}) {
    return await request.post(url,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:登录系统
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const loginSys = async function (params = {}) {
    return await request.post(url.login,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:获取配置
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const getConfig = async function (params = {}) {
    return await request.post(url.getConfig,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:登出系统
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const logoutSys = async function (params = {}) {
    return await request.post(url.logout,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:日志保存
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const logSave = async function (params = {}) {
    return await request.post(url.logSave,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:校验TOKEN
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const checkToken = async function (params = {}) {
    return await request.post(url.checkToken,qs.stringify(Object.assign(access_token,params)))
};
/**
 * TODO:权限列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const authLists = async function (params = {}) {
    return await request.post(url.authLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:角色列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const roleLists = async function(params = {}){
    return await request.post(url.roleLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:导航栏数据
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const authTree = async function(params = {}){
    return await request.post(url.tree,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:管理员列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const userLists = async function(params = {}){
    return await request.post(url.userLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:个人中心
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const userCenter = async function(params = {}){
    return await request.post(url.userCenter,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:账户绑定
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const userBind = async function (params={}) {
    return await request.post(url.userBind,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:日志列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const logLists = async function(params = {}){
    return await request.post(url.logLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:接口详情
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const apiLists = async function (params = {}) {
    return await request.post(url.apiLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:接口详情 (markdown)
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const apiDocLists = async function (params = {}) {
    return await request.post(url.apiDocLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:接口保存 (markdown)
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const apiDocSave = async function (params = {}) {
    return await request.post(url.apiDocSave,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:接口更新 (markdown)
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const apiDocUpdate = async function (params = {}) {
    return await request.post(url.apiDocUpdate,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:接口分类列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const categoryLists = async function (params = {}) {
    return await request.post(url.categoryLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:删除接口分类
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const categoryDelete = async function (params = {}) {
    return await request.post(url.categoryDelete,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:文件列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileLists = async function (params = {}) {
    return await request.post(url.fileLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:文件读取
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileRead = async function (params = {}) {
    return await request.post(url.fileRead,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:文件重命名
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileRename = async function (params = {}) {
    return await request.post(url.fileRename,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:文件保存
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileSave = async function (params = {}) {
    return await request.post(url.fileSave,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:文件删除
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileDelete = async function (params = {}) {
    return await request.post(url.fileDelete,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:数据表列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseLists = async function (params={}) {
    return await request.post(url.databaseLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:数据表备份
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseBackup = async function (params = {}) {
    return await request.post(url.databaseBackUp,qs.stringify(Object.assign(params,access_token)));
};
/**
 * TODO:数据表修复
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseRepair = async function (params = {}) {
    return await request.post(url.databaseRepair,qs.stringify(Object.assign(params,access_token)));
};
/**
 * TODO:数据表优化
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseOptimize = async function (params = {}) {
    return await request.post(url.databaseOptimize,qs.stringify(Object.assign(params,access_token)));
};
/**
 * TODO:修改数据表注释
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseUpdateComment = async function (params = {}) {
    return await request.post(url.databaseUpdateComment,qs.stringify(Object.assign(params,access_token)));
}
/**
 * TODO:文件压缩
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const compressionFile = async function (params = {}) {
    return await request.post(url.fileCompression,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:文件解压
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const decompressionFile = async function (params = {}) {
    return await request.post(url.fileDecompression,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:图片查看
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const imagePreview = async function (params = {}) {
    return await request.post(url.imagePreview,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:配置列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const configLists = async function (params = {}) {
    return await request.post(url.configLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:修改配置值
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const configValUpdate = async function (params = {}) {
    return await request.post(url.configValUpdate,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:授权用户列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const oauthLists = async function (params = {}) {
    return await request.post(url.oauthLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:授权账户绑定
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const oauthBind = async function (params = {}) {
    return await request.post(url.oauthBind,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:申请权限列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const reqRuleLists = async function (params = {}) {
    return await request.post(url.reqRuleLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:申请权限保存
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const reqRuleSave = async function (params = {}) {
    return await request.post(url.reqRuleSave,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:根据角色获取权限
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const getAuthByToken = async function (params = {}) {
    return await request.post(url.getAuthByToken,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:邮件发送
 * @param params
 * @param href
 * @returns {Promise<AxiosResponse<T>>}
 */
const sendEmail = async function (params = {},href = url.sendMail ) {
    return await request.post(href,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:校验验证码
 * @param params
 * @param href
 * @returns {Promise<AxiosResponse<T>>}
 */
const verifyCode = async function (params = {},href= url.verifyCode) {
    return await request.post(href,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:城市列表
 * @param params
 * @param href
 * @returns {Promise<AxiosResponse<T>>}
 */
const areaLists = async function (params = {},href) {
    return await request.post(href,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:城市天气
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const areaWeather = async function (params = {}) {
    return await request.post(url.areaWeather,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO：站内信息推送
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const pushList = async function (params = {}) {
    return await request.post(url.pushList,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:通知已查看
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const pushRead = async function (params = {}) {
    return await request.post(url.pushRead,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:表情列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const emotionLists = async function (params = {}) {
    return await request.post(url.emotionLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:获取历史聊天记录
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const chatLists = async function (params = {}) {
    return await request.post(url.chatLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:获取记录总数
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const getCountData = async function (params = {}) {
    return await request.post(url.getCountData,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:数据表组件
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const tableComponents = async function (params = {}) {
    return await request.post(url.tableComponent,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:数据保存
 * @param params
 * @param url
 * @returns {Promise<AxiosResponse<T>>}
 */
const saveData = async function (params={},url='') {
    return await request.post(url,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:删除
 * @param params
 * @param url
 * @returns {Promise<AxiosResponse<T>>}
 */
const removeData = async function (params={},url='') {
    return await request.post(url,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:excelExport
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const excelExport = async function (params={}) {
    return await request.post(url.excelExport,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:excelImport
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const excelImport = async function (params={}) {
    return await request.post(url.excelImport,qs.stringify(Object.assign(params,access_token)))
};
/**
 * TODO:获取历史聊天记录
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const timeLineLists = async function (params = {}) {
    return await request.post(url.timeLineLists,qs.stringify(Object.assign(params,access_token)))
};
/**
 * todo:获取当前用户地址
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
const getCityName = async function (params={}) {
    return await request.post(url.getCityName,qs.stringify(Object.assign(params,access_token)))
}
const interfaceLists = {
    ReportSys:reportSys,
    LoginSys:loginSys,
    LogoutSys:logoutSys,
    LogSave:logSave,
    CheckToken:checkToken,
    AuthLists:authLists,
    RoleLists:roleLists,
    AuthTree:authTree,
    UserLists:userLists,
    UserCenter:userCenter,
    UserBind:userBind,
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
    OauthBind:oauthBind,
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
    GetCountData:getCountData,
    TableComponents:tableComponents,
    SaveData:saveData,
    RemoveData:removeData,
    ExcelExport:excelExport,
    ExcelImport:excelImport,
    TimeLineLists:timeLineLists,
    GetCityName:getCityName
};
export default interfaceLists;
