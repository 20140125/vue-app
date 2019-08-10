import url from './url';
import request from './request.js'
import qs from 'qs';
import store from '../store'
const token = {
    token:store.state.login.token
};
const loginSys = function (params) {
    return request.post(url.login,qs.stringify(Object.assign(token,params)))
};
const getConfig = function (params) {
    return request.post(url.getConfig,qs.stringify(Object.assign(token,params)))
};
const logoutSys = function (params) {
    return request.post(url.logout,qs.stringify(Object.assign(token,params)))
};
const logSave = function (params) {
    return request.post(url.logSave,qs.stringify(Object.assign(token,params)))
};
const checkToken = function (params) {
    return request.post(url.checkToken,qs.stringify(Object.assign(token,params)))
};
const authLists = function (params) {
    return request.post(url.authLists,qs.stringify(Object.assign(token,params)))
};
const roleLists = function(params){
    return request.post(url.roleLists,qs.stringify(Object.assign(token,params)))
};
const authTree = function(params){
    return request.post(url.tree,qs.stringify(Object.assign(token,params)))
};
const userLists = function(params){
    return request.post(url.userLists,qs.stringify(Object.assign(token,params)))
};
const logLists = function(params){
    return request.post(url.logLists,qs.stringify(Object.assign(token,params)))
};
const apiLists = function (params) {
    return request.post(url.apiLists,qs.stringify(Object.assign(token,params)))
};
const categoryLists = function (params) {
    return request.post(url.categoryLists,qs.stringify(Object.assign(token,params)))
};
const categoryDelete = function (params) {
    return request.post(url.categoryDelete,qs.stringify(Object.assign(token,params)))
};
const fileLists = function (params) {
    return request.post(url.fileLists,qs.stringify(Object.assign(token,params)))
};
const fileRead = function (params) {
    return request.post(url.fileRead,qs.stringify(Object.assign(token,params)))
};
const fileRename = function (params) {
    return request.post(url.fileRename,qs.stringify(Object.assign(token,params)))
};
const fileSave = function (params) {
    return request.post(url.fileSave,qs.stringify(Object.assign(token,params)))
};
const fileDelete = function (params) {
    return request.post(url.fileDelete,qs.stringify(Object.assign(token,params)))
};
const databaseLists = function (params) {
    return request.post(url.databaseLists,qs.stringify(Object.assign(token,params)))
};
const musicLists = function (params) {
    return request.post(url.musicLists,qs.stringify(Object.assign(token,params)))
};
const musicPlay = function (params) {
    return request.post(url.musicPlay,qs.stringify(Object.assign(token,params)))
};
const compressionFile = function (params) {
    return request.post(url.fileCompression,qs.stringify(Object.assign(token,params)))
};
const decompressionFile = function (params) {
    return request.post(url.fileDecompression,qs.stringify(Object.assign(token,params)))
};
const imagePreview = function (params) {
    return request.post(url.imagePreview,qs.stringify(Object.assign(token,params)))
};
const configLists = function (params) {
    return request.post(url.configLists,qs.stringify(Object.assign(token,params)))
};
const configValUpdate = function (params) {
    return request.post(url.configValUpdate,qs.stringify(Object.assign(token,params)))
};
const oauthLists = function (params) {
    return request.post(url.oauthLists,qs.stringify(Object.assign(token,params)))
};
const reqRuleLists = function (params) {
    return request.post(url.reqRuleLists,qs.stringify(Object.assign(token,params)))
};
const reqRuleSave = function (params) {
    return request.post(url.reqRuleSave,qs.stringify(Object.assign(token,params)))
};
const sendEmail = function (params) {
    return request.post(url.sendMail,qs.stringify(Object.assign(token,params)))
};
const verifyCode = function (params) {
    return request.post(url.verifyCode,qs.stringify(Object.assign(token,params)))
};
const interfaceLists = {
    LoginSys:loginSys,
    LogoutSys:logoutSys,
    LogSave:logSave,
    CheckToken:checkToken,
    AuthLists:authLists,
    RoleLists:roleLists,
    AuthTree:authTree,
    UserLists:userLists,
    LogLists:logLists,
    ApiLists:apiLists,
    CategoryLists:categoryLists,
    FileLists:fileLists,
    FileRead:fileRead,
    FileRename:fileRename,
    FileSave:fileSave,
    FileDelete:fileDelete,
    DatabaseLists:databaseLists,
    MusicLists:musicLists,
    MusicPlay:musicPlay,
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
    SendEmail:sendEmail,
    VerifyCode:verifyCode
};
export default interfaceLists;
