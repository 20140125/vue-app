import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/index'
import Welcome from '../components/common/index'
import Login from '../components/login'
import AuthLists from '../components/auth/lists'
import RoleLists from '../components/role/lists'
import UserLists from '../components/user/lists'
import UserCenter from '../components/user/center'
import UserBind from '../components/user/bind'
import LogLists from '../components/log/lists'
import SystemLog from '../components/system/log'
import SystemFile from '../components/system/file'
import ImagePreview from '../components/system/imageView'
import ConfigLists from '../components/system/config'
import ApiLists from '../components/interface/api'
import APIDoc from '../components/interface/doc'
import DatabaseLists from '../components/database/lists'
import OauthLists from '../components/oauth/lists'
import ReqRuleLists from '../components/req_rule/lists'
import AreaLists from '../components/area/lists'
import PushList from '../components/system/push'
import ChatLists from '../components/system/chat'
import MarkDown from '../components/editor/markdown'
import UEditor from '../components/editor/ueditor'
import TimeLine from '../components/system/timeline'
import chatRoom from '../components/chat-room/Main'
import Empty from '../components/empty'
import TableExample from '../components/components/example/tables'
import FormExample from '../components/components/example/forms'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        { path: '/', name: '/', component: Login, meta: { mode: '', title: '登录' } },
        { path: '/login', name: 'Login', component: Login, meta: { mode: '', title: '登录' } },
        { path: '/404', name: 'Empty', component: Empty, meta: { mode: '', title: '404' } },
        { path: '/admin', name: 'Admin', component: Index, meta: { mode: '', title: '首页' } },
        { path: '/admin',
          component: Index,
          children: [
              { path: 'index/:access_token?', name: 'Welcome', component: Welcome, meta: { mode: '', title: '欢迎页' } },
              { path: 'auth/index', name: 'AuthLists', component: AuthLists, meta: { mode: 'rule', title: '权限列表' } },
              { path: 'role/index', name: 'RoleLists', component: RoleLists, meta: { mode: 'role', title: '角色列表' } },
              { path: 'user/index', name: 'UserLists', component: UserLists, meta: { mode: 'user', title: '管理员列表' } },
              { path: 'center/index', name: 'UserCenter', component: UserCenter, meta: { mode: 'user_center', title: '个人中心' } },
              { path: 'user/bind/:access_token?', name: 'UserBind', component: UserBind, meta: { mode: 'user_bind', title: '账户绑定' } },
              { path: 'oauth/index', name: 'OauthLists', component: OauthLists, meta: { mode: 'oauth', title: '授权用户' } },
              { path: 'req_rule/index', name: 'ReqRuleLists', component: ReqRuleLists, meta: { mode: 'req_rule', title: '申请授权列表' } },
              { path: 'log/index', name: 'LogLists', component: LogLists, meta: { mode: 'log', title: '日志列表' } },
              { path: 'system/log', name: 'SystemLog', component: SystemLog, meta: { mode: 'log', title: '系统日志' } },
              { path: 'file/index', name: 'SystemFile', component: SystemFile, meta: { mode: 'file', title: '文件列表' } },
              { path: 'image/preview', name: 'ImagePreview', component: ImagePreview, meta: { mode: 'file', title: '图片预览' } },
              { path: 'config/index', name: 'ConfigLists', component: ConfigLists, meta: { mode: 'config', title: '基础配置' } },
              { path: 'category/index', name: 'ApiLists', component: ApiLists, meta: { mode: 'api_lists', title: '项目列表' } },
              { path: 'api_doc/index', name: 'APIDoc', component: APIDoc, meta: { mode: 'api_lists', title: 'APIDoc' } },
              { path: 'database/index', name: 'DatabaseLists', component: DatabaseLists, meta: { mode: '', title: '数据表列表' } },
              { path: 'area/index', name: 'AreaLists', component: AreaLists, meta: { mode: 'china_area', title: '城市列表' } },
              { path: 'push/index', name: 'PushList', component: PushList, meta: { mode: 'push', title: '站内通知' } },
              { path: 'common/chat', name: 'ChatLists', component: ChatLists, meta: { mode: 'chat', title: '聊天记录' } },
              { path: 'editor/markdown', name: 'MarkDown', component: MarkDown, meta: { mode: 'push', title: 'MarkDown' } },
              { path: 'editor/quill', name: 'UEditor', component: UEditor, meta: { mode: 'push', title: 'Quill' } },
              { path: 'timeline/index', name: 'TimeLine', component: TimeLine, meta: { mode: 'timeline', title: '时间线' } },
              { path: 'example/table', name: 'TableExample', component: TableExample, meta: { mode: '', title: '表格组件' } },
              { path: 'example/form', name: 'FormExample', component: FormExample, meta: { mode: '', title: '表单组件' } }

          ]
        },
        { path: '/chat', name: 'chatRoom', component: chatRoom, meta: { mode: 'chat', title: '聊天室' } },
        {path: '*', redirect: '/404'}
    ]
})
