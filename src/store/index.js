import {createStore, createLogger} from 'vuex';
import login from '@/store/modules/login';
import home from '@/store/modules/home';
import chat from '@/store/modules/chat';
import file from '@/store/modules/file';

import auth from '@/store/modules/permission/auth';
import role from '@/store/modules/permission/role';
import apply from '@/store/modules/permission/apply';

import users from '@/store/modules/users/user';
import oauth from '@/store/modules/users/oauth';

import push from '@/store/modules/system/push';
import config from '@/store/modules/system/config';
import area from '@/store/modules/system/area';
import database from '@/store/modules/system/database';
import log from '@/store/modules/system/log';

import category from '@/store/modules/interface/category';

import spider from '@/store/modules/spider';

import mutations from '@/store/mutaions';
import state from '@/store/state';
import actions from '@/store/actions';

/**
 * Vuex全局状态管理
 * @param options {Array}
 */
const debug = process.env.NODE_ENV !== 'production';
export default createStore({
    modules: {login, home, chat, file, auth, role, apply, push, users, oauth, config, area, database, log, category, spider},
    mutations,
    state,
    actions,
    strict: debug,
    plugins: debug ? [createLogger()] : []
});
