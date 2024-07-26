/* 登录 */
export const login = {
  loginSystem: '/api/v1/account/login',
  reportCode: '/api/v1/report/code',
  checkAuthorized: '/api/v1/check/authorized',
  sendMail: '/api/v1/mail/send',
  oauthConfig: '/api/v1/oauth/config',
  logoutSystem: '/api/v1/account/logout'
};
/* 导航栏 */
export const home = {
  getMenu: '/api/v1/common/menu',
  /* 域名 */
// baseURL: process.env.NODE_ENV !== 'production' ? 'http://www.laravel.com' : 'https://www.fanglonger.com'
  baseURL: 'https://www.fanglonger.com'
};
/* 时间线 */
export const timeline = {
  lists: '/api/v1/timeline/index'
};
/* 表情图 */
export const emotion = {
  lists: '/api/v1/emotion/index'
};
/* 用户管理 */
export const users = {
  lists: '/api/v1/users/index',
  update: '/api/v1/users/update',
  cache: '/api/v1/users/cache'
};
/* 授权优惠 */
export const oauth = {
  lists: '/api/v1/oauth/index',
  update: '/api/v1/oauth/update'
};
/* 个人中心 */
export const userCenter = {
  get: '/api/v1/userCenter/index',
  update: '/api/v1/userCenter/update'
};
/* 权限 */
export const auth = {
  lists: '/api/v1/auth/index',
  save: '/api/v1/auth/save',
  update: '/api/v1/auth/update',
  tree: '/api/v1/auth/tree'
};
/* 日志 */
export const log = {
  lists: '/api/v1/log/index',
  get: '/api/v1/log/get',
  delete: '/api/v1/log/delete'
};
/* 角色 */
export const role = {
  lists: '/api/v1/role/index',
  auth: '/api/v1/role/auth',
  update: '/api/v1/role/update',
  save: '/api/v1/role/save'
};
/* 权限申请 */
export const permission = {
  lists: '/api/v1/permission/index',
    get: '/api/v1/permission/get',
    save: '/api/v1/permission/save',
    update: '/api/v1/permission/update'
};
/* 文件 */
export const file = {
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
};
/* 配置 */
export const config = {
  lists: '/api/v1/config/index',
  save: '/api/v1/config/save',
  update: '/api/v1/config/update',
  plugin: '/api/v1/plugin/action'
};
/* 接口分类 */
export const category = {
  lists: '/api/v1/interfaceCategory/index',
  save: '/api/v1/interfaceCategory/save',
  update: '/api/v1/interfaceCategory/update',
  delete: '/api/v1/interfaceCategory/delete'
};
/* 接口详情 */
export const api = {
  save: '/api/v1/interface/save',
  update: '/api/v1/interface/update',
  get: '/api/v1/interface/detail'
};
/* 地区 */
export const area = {
  lists: '/api/v1/area/index',
  cache: '/api/v1/area/cache',
  weather: '/api/v1/area/weather'
};
/* 数据库 */
export const database = {
  lists: '/api/v1/database/index',
  backup: '/api/v1/database/backup',
  optimize: '/api/v1/database/optimize',
  repair: '/api/v1/database/repair',
  alter: '/api/v1/database/alter'
};
/* 站内通知 */
export const push = {
  lists: '/api/v1/push/index',
  save: '/api/v1/push/save',
  update: '/api/v1/push/update'
};
/* 工具 */
export const tools = {
  getAddress: '/api/v1/tools/getAddress',
  getWeather: '/api/v1/tools/getWeather'
};
/* 爬虫 */
export const spider = {
  lists: '/api/v1/spider/index',
    running: '/api/v1/spider/running'
};
/* 图片列表 */
export const image = {
  list: '/api/v1/image/lists',
  hot: '/api/v1/image/hotLists',
  config: '/api/v1/image/hotKeyWord'
};
