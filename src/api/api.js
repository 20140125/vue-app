import url from './url';
import request from './request.js'
import qs from 'qs';
import store from '../store'
const token = {
    token:store.state.login.token
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
const localLists = function (params) {
    return request.post(url.localLists,qs.stringify(Object.assign(token,params)))
};
const localTools = function (params) {
    return request.post(url.localTools,qs.stringify(Object.assign(token,params)))
};
const interfaceLists = {
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
    LocalLists:localLists,
    LocalTools:localTools
};
export default interfaceLists;