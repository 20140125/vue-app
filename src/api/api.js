import url from './url'
import request from './request.js'
import qs from 'qs'
// eslint-disable-next-line camelcase
const access_token = {'token': localStorage.getItem('token')}
/**
 * TODO:数据上报
 * @param url
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const reportSys = function (url, params = {}) {
    return request.post(url, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:登录系统
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const loginSys = function (params = {}) {
    return request.post(url.login, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:获取配置
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const getConfig = function (params = {}) {
    return request.post(url.getConfig, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:登出系统
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const logoutSys = function (params = {}) {
    return request.post(url.logout, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:日志保存
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const logSave = function (params = {}) {
    return request.post(url.logSave, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:校验TOKEN
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const checkToken = function (params = {}) {
    return request.post(url.checkToken, qs.stringify(Object.assign(access_token, params)))
}
/**
 * TODO:权限列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const authLists = function (params = {}) {
    return request.post(url.authLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:角色列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const roleLists = function (params = {}) {
    return request.post(url.roleLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:导航栏数据
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const authMenu = function (params = {}) {
    return request.post(url.menu, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:管理员列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const userLists = function (params = {}) {
    return request.post(url.userLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:个人中心
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const userCenter = function (params = {}) {
    return request.post(url.userCenter, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:账户绑定
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const userBind = function (params = {}) {
    return request.post(url.userBind, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:日志列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const logLists = function (params = {}) {
    return request.post(url.logLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:接口详情
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const apiLists = function (params = {}) {
    return request.post(url.apiLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:接口详情 (markdown)
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const apiDocLists = function (params = {}) {
    return request.post(url.apiDocLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:接口保存 (markdown)
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const apiDocSave = function (params = {}) {
    return request.post(url.apiDocSave, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:接口更新 (markdown)
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const apiDocUpdate = function (params = {}) {
    return request.post(url.apiDocUpdate, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:接口分类列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const categoryLists = function (params = {}) {
    return request.post(url.categoryLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:删除接口分类
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const categoryDelete = function (params = {}) {
    return request.post(url.categoryDelete, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:文件列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileLists = function (params = {}) {
    return request.post(url.fileLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:文件读取
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileRead = function (params = {}) {
    return request.post(url.fileRead, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:文件重命名
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileRename = function (params = {}) {
    return request.post(url.fileRename, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:文件保存
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileSave = function (params = {}) {
    return request.post(url.fileSave, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:文件删除
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const fileDelete = function (params = {}) {
    return request.post(url.fileDelete, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:数据表列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseLists = function (params = {}) {
    return request.post(url.databaseLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:数据表备份
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseBackup = function (params = {}) {
    return request.post(url.databaseBackUp, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:数据表修复
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseRepair = function (params = {}) {
    return request.post(url.databaseRepair, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:数据表优化
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseOptimize = function (params = {}) {
    return request.post(url.databaseOptimize, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:修改数据表注释
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const databaseUpdateComment = function (params = {}) {
    return request.post(url.databaseUpdateComment, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:文件压缩
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const compressionFile = function (params = {}) {
    return request.post(url.fileCompression, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:文件解压
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const decompressionFile = function (params = {}) {
    return request.post(url.fileDecompression, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:图床列表
 * @param params
 * @param href
 * @returns {Promise<AxiosResponse<T>>}
 */
const imageBed = function (params = {}, href) {
    return request.post(href, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:配置列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const configLists = function (params = {}) {
    return request.post(url.configLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:授权用户列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const oauthLists = function (params = {}) {
    return request.post(url.oauthLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:授权账户绑定
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const oauthBind = function (params = {}) {
    return request.post(url.oauthBind, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:申请权限列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const reqRuleLists = function (params = {}) {
    return request.post(url.reqRuleLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:申请权限保存
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const reqRuleSave = function (params = {}) {
    return request.post(url.reqRuleSave, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:根据角色获取权限
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const getAuthByToken = function (params = {}) {
    return request.post(url.getAuthByToken, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:邮件发送
 * @param params
 * @param href
 * @returns {Promise<AxiosResponse<T>>}
 */
const sendEmail = function (params = {}, href = url.sendEmail) {
    return request.post(href, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:校验验证码
 * @param params
 * @param href
 * @returns {Promise<AxiosResponse<T>>}
 */
const verifyCode = function (params = {}, href = url.checkCode) {
    return request.post(href, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:城市列表
 * @param params
 * @param href
 * @returns {Promise<AxiosResponse<T>>}
 */
const areaLists = function (params = {}, href) {
    return request.post(href, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:城市天气
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const areaWeather = function (params = {}) {
    return request.post(url.areaWeather, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO：站内信息推送
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const pushList = function (params = {}) {
    return request.post(url.pushList, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:通知已查看
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const pushRead = function (params = {}) {
    return request.post(url.pushRead, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:表情列表
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const emotionLists = function (params = {}) {
    return request.post(url.emotionLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:获取历史聊天记录
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const chatLists = function (params = {}) {
    return request.post(url.chatLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:数据表组件
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const tableComponents = function (params = {}) {
    return request.post(url.tableComponent, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:数据保存
 * @param params
 * @param url
 * @returns {Promise<AxiosResponse<T>>}
 */
const saveData = function (params = {}, url = '') {
    return request.post(url, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:删除
 * @param params
 * @param url
 * @returns {Promise<AxiosResponse<T>>}
 */
const removeData = function (params = {}, url = '') {
    return request.post(url, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:excelExport
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const excelExport = function (params = {}) {
    return request.post(url.excelExport, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:excelImport
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const excelImport = function (params = {}) {
    return request.post(url.excelImport, qs.stringify(Object.assign(params, access_token)))
}
/**
 * TODO:获取历史聊天记录
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
const timeLineLists = function (params = {}) {
    return request.post(url.timeLineLists, qs.stringify(Object.assign(params, access_token)))
}
/**
 * todo:获取当前用户地址
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
const getCityName = function (params = {}) {
    return request.post(url.getCityName, qs.stringify(Object.assign(params, access_token)))
}
const interfaceLists = {
    ReportSys: reportSys,
    LoginSys: loginSys,
    LogoutSys: logoutSys,
    LogSave: logSave,
    CheckToken: checkToken,
    AuthLists: authLists,
    RoleLists: roleLists,
    AuthMenu: authMenu,
    UserLists: userLists,
    UserCenter: userCenter,
    UserBind: userBind,
    LogLists: logLists,
    ApiLists: apiLists,
    ApiDocLists: apiDocLists,
    ApiDocSave: apiDocSave,
    ApiDocUpdate: apiDocUpdate,
    CategoryLists: categoryLists,
    FileLists: fileLists,
    FileRead: fileRead,
    FileRename: fileRename,
    FileSave: fileSave,
    FileDelete: fileDelete,
    DatabaseLists: databaseLists,
    DatabaseBackup: databaseBackup,
    DatabaseRepair: databaseRepair,
    DatabaseOptimize: databaseOptimize,
    DatabaseUpdateComment: databaseUpdateComment,
    CategoryDelete: categoryDelete,
    Compression: compressionFile,
    Decompression: decompressionFile,
    ImageBed: imageBed,
    ConfigLists: configLists,
    GetConfig: getConfig,
    OauthLists: oauthLists,
    OauthBind: oauthBind,
    ReqRuleLists: reqRuleLists,
    ReqRuleSave: reqRuleSave,
    GetAuthByToken: getAuthByToken,
    SendEmail: sendEmail,
    VerifyCode: verifyCode,
    AreaLists: areaLists,
    AreaWeather: areaWeather,
    PushList: pushList,
    PushRead: pushRead,
    ChatLists: chatLists,
    EmotionLists: emotionLists,
    TableComponents: tableComponents,
    SaveData: saveData,
    RemoveData: removeData,
    ExcelExport: excelExport,
    ExcelImport: excelImport,
    TimeLineLists: timeLineLists,
    GetCityName: getCityName
}
export default interfaceLists
