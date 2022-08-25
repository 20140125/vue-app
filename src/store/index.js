import { createLogger, createStore } from 'vuex';
import login from './modules/login';
import home from './modules/admin/home';
import file from './modules/file/file';
/* 权限管理 */
import auth from './modules/permission/auth';
import role from './modules/permission/role';
import apply from './modules/permission/apply';
/* 用户管理 */
import users from './modules/users/user';
import oauth from './modules/users/oauth';
/* 系统管理 */
import push from './modules/system/push';
import config from './modules/system/config';
import area from './modules/system/area';
import database from './modules/system/database';
import log from './modules/system/log';
/* 接口管理 */
import category from './modules/category/category';
/* 爬虫管理 */
import spider from './modules/system/spider';
/* 首页数据 */
import index from './modules/home/index';
/* Vuex */
import mutations from './mutaions';
import state from './state';
import actions from './actions';
import getters from './getters';

/**
 * Vuex全局状态管理
 * @param options {Array}
 */
const debug = process.env.NODE_ENV !== 'production';
export default createStore({
  modules: {
    login,
    home,
    file,
    auth,
    role,
    apply,
    push,
    users,
    oauth,
    config,
    area,
    database,
    log,
    category,
    spider,
    index
  },
  mutations,
  state,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
