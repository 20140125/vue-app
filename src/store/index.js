import { createLogger, createStore } from 'vuex';
import login from '@/store/modules/login';
import home from '@/store/modules/admin/home';
import file from '@/store/modules/file/file';
/* 权限管理 */
import auth from '@/store/modules/permission/auth';
import role from '@/store/modules/permission/role';
import apply from '@/store/modules/permission/apply';
/* 用户管理 */
import users from '@/store/modules/users/user';
import oauth from '@/store/modules/users/oauth';
/* 系统管理 */
import push from '@/store/modules/system/push';
import config from '@/store/modules/system/config';
import area from '@/store/modules/system/area';
import database from '@/store/modules/system/database';
import log from '@/store/modules/system/log';
/* 接口管理 */
import category from '@/store/modules/category/category';
/* 爬虫管理 */
import spider from '@/store/modules/system/spider';
/* 首页数据 */
import index from '@/store/modules/home/index';
/* Vuex */
import mutations from '@/store/mutaions';
import state from '@/store/state';
import actions from '@/store/actions';
import getters from '@/store/getters';

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
