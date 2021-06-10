import Vue from 'vue'
import Router from 'vue-router'
import Default from '../pages/homeManage'
import Index from '../pages/index'
import Welcome from '../pages/base/index'
import LoginManage from '../pages/LoginManage'
import AuthManage from '../pages/AuthManage'
import RoleManage from '../pages/RoleManage'
import UserManage from '../pages/UserManage'
import UserCenter from '../pages/user/center'
import UserBind from '../pages/user/bind'
import LogManage from '../pages/LogManage'
import SystemLogManage from '../pages/SystemLogManage'
import SystemFileManage from '../pages/FileManage'
import ImagePreview from '../pages/image/view'
import ImageBed from '../pages/image/bed'
import ConfigManage from '../pages/ConfigManage'
import ApiManage from '../pages/ApiManage'
import DocManage from '../pages/DocManage'
import DatabaseManage from '../pages/DatabaseManage'
import OauthManage from '../pages/OauthManage'
import ReqRuleManage from '../pages/ReqRuleManage'
import AreaManage from '../pages/AreaManage'
import PushManage from '../pages/PushManage'
import ChatManage from '../pages/ChatManage'
import MarkDownManage from '../pages/MarkdownManage'
import UEditorManage from '../pages/UEditorManage'
import TimeLineManage from '../pages/TimelineManage'
import chatRoom from '../components/chatRoom/Main'
import Empty from '../pages/error/empty'
import TableExample from '../pages/example/tables'
import FormExample from '../pages/example/forms'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {path: '/', name: '/', component: Default, meta: { mode: '', title: '表情包' }},
        {path: '/login', name: 'LoginManage', component: LoginManage, meta: { mode: '', title: '登录' }},
        {path: '/404', name: 'Empty', component: Empty, meta: { mode: '', title: '404' }},
        {path: '/admin', name: 'Admin', component: Index, meta: { mode: '', title: '首页' }},
        {path: '/chat', name: 'chatRoom', component: chatRoom, meta: { mode: 'chat', title: '聊天室' }},
        {path: '*', redirect: '/404'},
        {
            path: '/admin',
            component: Index,
            children: [
                {path: 'index/:access_token?', name: 'Welcome', component: Welcome, meta: { mode: '', title: '欢迎页' }},
                {path: 'auth/index', name: 'AuthManage', component: AuthManage, meta: { mode: 'rule', title: '权限列表' }},
                {path: 'role/index', name: 'RoleManage', component: RoleManage, meta: { mode: 'role', title: '角色列表' }},
                {path: 'user/index', name: 'UserManage', component: UserManage, meta: { mode: 'user', title: '管理员列表' }},
                {path: 'center/index', name: 'UserCenter', component: UserCenter, meta: { mode: 'user_center', title: '个人中心' }},
                {path: 'user/bind/:access_token?', name: 'UserBind', component: UserBind, meta: { mode: 'user_bind', title: '账户绑定' }},
                {path: 'oauth/index', name: 'OauthLists', component: OauthManage, meta: { mode: 'oauth', title: '授权用户' }},
                {path: 'req_rule/index', name: 'ReqRuleLists', component: ReqRuleManage, meta: { mode: 'req_rule', title: '申请授权列表' }},
                {path: 'log/index', name: 'LogManage', component: LogManage, meta: { mode: 'log', title: '日志列表' }},
                {path: 'system/log', name: 'SystemLogManage', component: SystemLogManage, meta: { mode: 'log', title: '系统日志' }},
                {path: 'file/index', name: 'SystemFileManage', component: SystemFileManage, meta: { mode: 'file', title: '文件列表' }},
                {path: 'image/preview', name: 'ImagePreview', component: ImagePreview, meta: { mode: 'image', title: '图片预览' }},
                {path: 'image/bed', name: 'ImageBed', component: ImageBed, meta: { mode: 'image', title: '图床列表' }},
                {path: 'config/index', name: 'ConfigManage', component: ConfigManage, meta: { mode: 'config', title: '基础配置' }},
                {path: 'category/index', name: 'ApiManage', component: ApiManage, meta: { mode: 'api_lists', title: '项目列表' }},
                {path: 'api_doc/index', name: 'DocManage', component: DocManage, meta: { mode: 'api_lists', title: 'APIDoc' }},
                {path: 'database/index', name: 'DatabaseManage', component: DatabaseManage, meta: { mode: '', title: '数据表列表' }},
                {path: 'area/index', name: 'AreaManage', component: AreaManage, meta: { mode: 'china_area', title: '城市列表' }},
                {path: 'push/index', name: 'PushManage', component: PushManage, meta: { mode: 'push', title: '站内通知' }},
                {path: 'common/chat', name: 'ChatManage', component: ChatManage, meta: { mode: 'chat', title: '聊天记录' }},
                {path: 'editor/markdown', name: 'MarkDownManage', component: MarkDownManage, meta: { mode: 'push', title: 'MarkDown' }},
                {path: 'editor/quill', name: 'UEditorManage', component: UEditorManage, meta: { mode: 'push', title: 'Quill' }},
                {path: 'timeline/index', name: 'TimeLineManage', component: TimeLineManage, meta: { mode: 'timeline', title: '时间线' }},
                {path: 'example/table', name: 'TableExample', component: TableExample, meta: { mode: '', title: '表格组件' }},
                {path: 'example/form', name: 'FormExample', component: FormExample, meta: { mode: '', title: '表单组件' }}]}] })
