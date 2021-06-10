import { MessageBox } from 'element-ui'
import apiLists from '../../api/api'
import code from '../../api/code'
import router from '../../router'
import func from '../../api/func'
import io from 'socket.io-client'
const state = {
    // 登录标识
    token: localStorage.getItem('token'),
    // 用户详细信息
    userInfo: {
        socketServer: '',
        websocketServer: '',
        username: '',
        auth: '',
        role_id: 0,
        uuid: '',
        token: '',
        adcode: '',
        city: '',
        user_id: '',
        default_client_id: ''
    },
    weather: {},
    menuLists: [],
    // 第三方授权登录
    oauthConfig: [],
    // 机器人
    robotConfig: [],
    // 群公告
    groupAnnouncementConfig: []
}
const getters = {
    menuLists: state => state.menuLists,
    oauthConfig: state => state.oauthConfig,
    robotConfig: state => state.robotConfig,
    groupAnnouncementConfig: state => state.groupAnnouncementConfig,
    userInfo: state => state.userInfo,
    token: state => state.token,
    weather: state => state.weather
}
const mutations = {
    /**
     * todo:设置导航栏
     * @param state
     * @param menuLists
     */
    setMenuLists: function (state, menuLists) {
        state.menuLists = menuLists
    },
    /**
     * todo:设置系统配置
     * @param state
     * @param oauthConfig
     */
    setOauthConfig: function (state, oauthConfig) {
        state.oauthConfig = oauthConfig
    },
    /**
     * todo:设置机器人配置
     * @param state
     * @param robotConfig
     */
    setRobotConfig: function (state, robotConfig) {
        state.robotConfig = robotConfig
    },
    /**
     * todo:群公告
     * @param state
     * @param groupAnnouncementConfig
     */
    setGroupAnnouncementConfig: function (state, groupAnnouncementConfig) {
        state.groupAnnouncementConfig = groupAnnouncementConfig
    },
    /**
     * todo:设置用户信息
     * @param state
     * @param userInfo
     */
    setUserInfo: function (state, userInfo) {
        state.userInfo = userInfo
        state.userInfo.socketServer = io(userInfo.socket)
        state.userInfo.websocketServer = new WebSocket(userInfo.websocket)
        localStorage.setItem('token', userInfo.token)
    },
    /**
     * todo:设置token
     * @param state
     * @param token
     */
    setToken: function (state, token) {
        state.token = token
        state.userInfo.token = token
        localStorage.setItem('token', token)
    },
    /**
     * todo:设置城市天气
     * @param state
     * @param weather
     */
    setWeather: function (state, weather) {
        state.weather = JSON.parse(weather)
    }
}
const actions = {
    /**
     * todo：系统登录
     * @param state
     * @param commit
     * @param users
     */
    loginSystem: async function ({state, commit}, users) {
        let response = await apiLists.LoginSys(users).catch(() => {
            this.$message.error('网络异常')
        })
        if (response && response.data.code === code.SUCCESS) {
            commit('setUserInfo', response.data.item)
            router.push({path: '/admin/index'})
        }
    },
    /**
     * TODO：获取配置
     * @param state
     * @param commit
     * @param name
     */
    getOauthConfig: async function ({state, commit}, name) {
        let response = await apiLists.GetConfig({name: name}).catch(() => {
            this.$message.error('网络异常')
        })
        if (response && response.data.code === code.SUCCESS) {
            if (name === 'RobotConfig') {
                commit('setRobotConfig', response.data.item)
            }
            if (name === 'Oauth' || name === 'RoomLists') {
                commit('setOauthConfig', response.data.item)
            }
            if (name === 'GroupAnnouncementConfig') {
                commit('setGroupAnnouncementConfig', response.data.item)
            }
        }
    },
    /**
     * todo：获取权限菜单
     * @param state
     * @param commit
     * @param username
     */
    getAuthMenu: async function ({state, commit}) {
        if (state.menuLists.length > 0) {
            commit('setMenuLists', state.menuLists)
        }
        if (state.userInfo.username) {
            let response = await apiLists.AuthMenu([]).catch(() => {
                this.$message.error('网络错误')
            })
            if (response && response.data.code === code.SUCCESS) {
                commit('setMenuLists', func.setTree(response.data.item))
            }
        } else {
            router.push({path: '/login'})
        }
    },
    /**
     * todo：系统登出
     * @param state
     * @param commit
     * @param token
     */
    logoutSystem: async function ({state, commit}, token) {
        let response = await apiLists.LogoutSys({token: token}).catch(() => {
            this.$message.error('网络错误')
        })
        if (response && response.data.code === code.SUCCESS) {
            commit('setToken', '')
            router.push({path: '/login'})
        }
    },
    /**
     * todo:保存城市天气
     * @param state
     * @param commit
     * @param weather
     */
    saveWeather: function ({state, commit}, weather) {
        commit('setWeather', weather)
    },
    /**
     * todo:设置用户信息
     * @param state
     * @param commit
     * @param userInfo
     */
    saveUserInfo: function ({state, commit}, userInfo) {
        commit('setUserInfo', userInfo)
    },
    /**
     * todo：保存日志
     * @param state
     * @param commit
     * @param params
     */
    saveSystemLog: async function ({state, commit}, params) {
        params.username = state.username
        await apiLists.LogSave(params).catch(() => {
            this.$message.error('网络错误')
        })
    },
    /**
     * todo：权限校验
     * @param state
     * @param commit
     * @param params
     */
    checkAuth: async function ({state, commit}, params) {
        params.url = params.url.replace('v1', 'admin')
        if (state.userInfo.auth.indexOf(params.url) === -1) {
            let info = '你没有访问权限，请联系管理员【' + code.QQ + '】检验数据的正确性！'
            await MessageBox.alert(info).then(() => {
                let req = {user_id: state.user_id, href: [params.url]}
                apiLists.ReqRuleSave(req).then((res) => {
                    if (res && res.data.code === code.SUCCESS) {
                        let data = {
                            href: params.url.replace('admin', 'v1'),
                            msg: JSON.stringify({info: info, result: res.data.result}),
                            token: state.token
                        }
                        this.saveSystemLog(data)
                        location.href = 'tencent://message/?uin=' + code.QQ + '&Site=后台权限认证&Menu=yes'
                    }
                })
            })
        }
    }
}
export default {
    state,
    getters,
    mutations,
    actions
}
