<template>
    <div>
        <!---chat message-->
        <el-dialog id="chat" top="8vh" :width="dialogWidth" center :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="visible">
            <div slot="title" style="display: flex;align-items: center;position: relative;">
                <el-avatar :src="chat.img" :size="50" fit="fill" :alt="chat.title"/>
                <div>
                    <div v-html="chat.title" style="margin-left: 10px;text-align: left;color: #fff"/>
                    <div slot="title" v-html="chat.desc" style="margin-left: 10px;color: #fff"/>
                </div>
            </div>
            <el-row :gutter="24">
                <el-col :xl="{'span':18}" :lg="{'span':16}" :md="{'span':16}" :sm="{'span':16}" :xs="{'span':14}" id="leftBox">
                    <el-card>
                        <div class="main">
                            <div class="list-container">
                                <virtual-list v-show="!!chat.messageLists.length" class="stream scroll-touch" :class="{ overflow: overflow }" ref="vsl"
                                              :data-key="'uid'"
                                              :data-sources="chat.messageLists"
                                              :data-component="messageComponent"
                                              :estimate-size="70"
                                              :item-class="'stream-item'"
                                              :item-class-add="addItemClass"
                                              @resized="onItemRendered"
                                              @totop="onTotop">
                                    <div slot="header" v-show="overflow" class="header">
                                        <div class="spinner" v-show="!finished"></div>
                                        <div class="finished" v-show="finished">No more data</div>
                                    </div>
                                </virtual-list>
                                <div class="empty" v-show="!chat.messageLists.length">
                                    <div class="wrapper">
                                        <div class="icon"></div>
                                        <div class="tips">No chats</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="input-msg">
                            <emotion @clickEmotion="getEmotion" v-show="showEmotion" :height="300"/>
                            <div>
                                <el-tooltip effect="dark" content="房间名称" placement="top-start">
                                    <el-menu :default-active="chat.room_id"   background-color="#409EFF"
                                             text-color="#fff"
                                             active-text-color="#ffd04b" mode="horizontal" style="margin-bottom:10px;">
                                        <el-menu-item @click="setRoomID(room)" v-for="(room,index) in oauthConfig" :key="index" :index="room.id.toString()">
                                            {{room.name}}
                                        </el-menu-item>
                                    </el-menu>
                                </el-tooltip>
                                <el-tooltip effect="dark" content="发送表情" placement="top-start">
                                    <i @click="showEmotion = !showEmotion" class="el-icon-picture-outline-round icon"/>
                                </el-tooltip>
                                <el-upload :action="cgi.uploadUrl"
                                           :data="fileData"
                                           :headers="headers"
                                           :show-file-list="false"
                                           :on-success="uploadSuccess"
                                           :before-upload="beforeUpload" style="float: left">
                                    <el-tooltip effect="dark" content="发送文件和图片" placement="top-start">
                                        <i  @click="showEmotion = false" class="el-icon-picture-outline icon"/>
                                    </el-tooltip>
                                </el-upload>
                            </div>
                            <div contentEditable="true" ref="message" id="content" @focus="showEmotion = false" @keydown="setMsg">

                            </div>
                        </div>
                        <div class="input-button" style="text-align: right">
                            <el-tooltip effect="dark" content="Shift + Enter 快捷发送" placement="top-start">
                                <el-button type="primary" round plain size="medium" @click="sendMsg">发 送</el-button>
                            </el-tooltip>
                        </div>
                    </el-card>
                </el-col>
                <el-col :xl="{'span':6}" :lg="{'span':8}" :md="{'span':8}" :sm="{'span':8}" :xs="{'span':10}" id="rightBox">
                    <el-card>
                        <div style="background: #fff;min-height: 60px">
                            群公告:
                            <el-carousel tyle="cursor: pointer" :interval="4000" arrow="never" direction="vertical" indicator-position="none" height="100px">
                                <el-carousel-item v-for="(item,index) in groupAnnouncementConfig" :key="index">
                                    <div style="cursor: pointer;margin-top: 20px" v-html="item.name"/>
                                </el-carousel-item>
                            </el-carousel>
                        </div>
                        <el-divider/>
                        <div style="margin-bottom: 10px">
                            在线人数({{chat.userTotal}}/{{chat.userOnline}})
                        </div>
                        <el-autocomplete placeholder="搜索" v-model="chat.users" clearable :fetch-suggestions="querySearch" @clear="clearSearch" style="width: 100%"/>
                        <div class="user-list">
                            <el-menu style="width: 100%;">
                                <el-menu-item :users="user" v-contextmenu:contextmenu @click="sendUser(user,index)" v-for="(user,index) in chat.client_list_part" :key="index" :index="index.toString()">
                                    <el-avatar :size="30" :src="user.client_img" style="cursor: pointer"/>
                                    <span slot="title" style="font-size: 14px" v-html="user.client_name.replace(chat.users,'<b style=color:#0e82fc;font-weight:300>'+chat.users+'</b>')"/>
                                    <!--未读消息数-->
                                    <el-badge v-if="user.total" type="danger" :value="user.total" style="top: 10px;right: 15px"/>
                                    <!--在线-->
                                    <el-badge v-else-if="user.online" type="success" is-dot style="top: 12px;right: 10px"/>
                                    <!--离线-->
                                    <el-badge v-else-if="!user.online" type="info" is-dot style="top: 12px;right: 10px"/>
                                </el-menu-item>
                            </el-menu>
                        </div>
                        <!--右键菜单-->
                        <v-contextmenu ref="contextmenu" @contextmenu="menuRightChange">
                            <v-contextmenu-item @click="userInfoVisible = true"><i class="el-icon-postcard"/> 查看资料</v-contextmenu-item>
                            <v-contextmenu-item divider></v-contextmenu-item>
                            <v-contextmenu-item @click="sendToMessage"><i class="el-icon-chat-line-square"/> 发送消息</v-contextmenu-item>
                        </v-contextmenu>
                    </el-card>
                </el-col>
            </el-row>
        </el-dialog>
        <!---chat message-->
        <!--userInfo Start-->
        <UserInfo :user-info="targetUsers" :dialog-width="dialogWidth" :user-info-visible="userInfoVisible" :closeDialog="closeDialog"/>
        <!--userInfo End-->
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import func from '../../api/func'
    import emotion from '../emotion/Index'
    import Push from 'push.js'
    import Item from './Item'
    import VirtualList from 'vue-virtual-scroll-list'
    import UserInfo from './UserInfo'
    export default {
        props: {
            chatVisible: {
                type: Boolean,
                default: () => true
            },
            dialogWidth: {
                type: String,
                default: () => '50%'
            },
            currentPage: {
                type: Number,
                default: () => 1
            },
            sizeLimit: {
                type: Number,
                default: () => 19
            }
        },
        name: 'chatRoom',
        data () {
            return {
                cgi: {uploadUrl: process.env.API_ROOT + 'v1/common/upload'},
                fileData: {},
                headers: {},
                inputMsg: '',
                emotionLists: [],
                showEmotion: false,
                chat: {},
                messageComponent: Item,
                overflow: false,
                finished: false,
                visible: this.chatVisible,
                targetUsers: {},
                userInfoVisible: false,
                userInfoDialogWidth: this.dialogWidth
            }
        },
        components: {
            UserInfo,
            emotion,
            VirtualList
        },
        computed: {
            ...mapGetters(['oauthConfig', 'groupAnnouncementConfig', 'userInfo'])
        },
        watch: {
            inputMsg: function () {
                this.inputMsg = this.$refs.message.innerHTML
            },
            chatVisible: function () {
                this.visible = this.chatVisible
                if (!this.visible) {
                    this.userInfoVisible = false
                }
            }
        },
        methods: {
            ...mapActions(['getOauthConfig', 'saveWeather']),
            /**
             * todo:获取目标用户的信息
             * @param item
             */
            menuRightChange (item) {
                if (item.data.attrs && item.data.attrs.users) {
                    this.targetUsers = item.data.attrs.users
                }
            },
            /**
             * todo:弹框关闭回调
             */
            closeDialog: function () {
                this.userInfoVisible = false
            },
            /**
             * todo:发送消息
             */
            sendToMessage: function () {
                this.sendUser(this.targetUsers, this.targetUsers.uid)
            },
            /**
             * todo:添加class
             * @param index
             */
            addItemClass (index) {
                if (this.chat.messageLists.length > 0) {
                    this.userInfo.username = this.chat.messageLists[index].to_client_name === 'all'
                        ? (this.chat.messageLists[index].from_client_name ? 'creator' : '')
                        : (this.chat.messageLists[index].to_client_name ? '' : 'creator')
                    return this.userInfo.username
                }
            },
            /**
             * todo:记录读取
             */
            onItemRendered () {
                if (!this.$refs.vsl) {
                    return
                }
                if (this.$refs.vsl) {
                    const vsl = this.$refs.vsl
                    if (vsl) {
                        this.overflow = vsl.getScrollSize() > vsl.getClientSize()
                    }
                }
            },
            /**
             * todo:向上滚动获取数据
             */
            onTotop: function () {
                setTimeout(() => {
                    if (this.chat.currentPage <= Math.ceil(this.chat.messageTotal / this.chat.sizeLimit)) {
                        this.chat.currentPage++
                        // 获取聊天记录
                        let str = {
                            type: 'history',
                            from_client_name: this.userInfo.username,
                            from_client_id: this.userInfo.uuid,
                            to_client_name: this.chat.to_client_name,
                            to_client_id: this.chat.to_client_id,
                            room_id: this.chat.to_client_name === 'all' ? this.chat.room_id : '',
                            uid: this.userInfo.uuid,
                            page: this.chat.currentPage,
                            limit: this.chat.sizeLimit,
                            source: 'user'
                        }
                        this.userInfo.websocketServer.send(JSON.stringify(str))
                    }
                    this.finished = true
                }, 500)
            },
            /**
             * todo:workerMan-chat链接
             * @param ws
             */
            connect: function (ws) {
                let __this = this
                // 连接建立时发送登录信息
                ws.onopen = function () {
                    let str = {
                        type: 'login',
                        from_client_id: __this.userInfo.uuid,
                        client_name: __this.userInfo.username,
                        room_id: __this.chat.room_id,
                        client_img: __this.userInfo.avatar_url,
                        uid: __this.userInfo.uuid,
                        adcode: __this.userInfo.adcode
                    }
                    ws.send(JSON.stringify(str))
                }
                ws.onmessage = function (response) {
                    let data = JSON.parse(response.data)
                    switch (data['type']) {
                    // 心跳
                    case 'ping':
                        ws.send('{"type":"pong"}')
                        break
                    // 登陆
                    case 'login':
                        __this.chat.client_list = data.client_list
                        __this.chat.client_list_part = data.client_list
                        __this.setUsersLists()
                        __this.saveWeather(data.weather)
                        console.log(data)
                        break
                    // 发送消息
                    case 'say':
                        __this.say(data)
                        __this.chat.client_list = data.client_list
                        __this.chat.client_list_part = data.client_list
                        __this.setUsersLists()
                        __this.$refs.vsl.scrollToBottom()
                        console.log(data)
                        break
                    // 聊天记录
                    case 'history':
                        __this.chat.messageTotal = data.total
                        __this.chat.client_list = data.client_list
                        __this.chat.client_list_part = data.client_list
                        if (__this.chat.currentPage > 1) {
                            __this.chat.messageLists = __this.chat.messageLists.concat(data.message)
                        } else {
                            __this.chat.messageLists = data.message
                            __this.$refs.vsl.scrollToBottom()
                        }
                        __this.chat.messageLists.sort(function (a, b) {
                            return a.time > b.time ? 1 : -1
                        })
                        __this.setUsersLists()
                        console.log(data)
                        break
                    // 消息删除/消息撤回
                    case 'srem':
                    case 'recall':
                        __this.chat.messageLists = data.message
                        __this.chat.client_list = data.client_list
                        __this.chat.client_list_part = data.client_list
                        __this.setUsersLists()
                        __this.removeMessageList(data)
                        console.log(data)
                        break
                    case 'logout':
                        console.log(data)
                        break
                    }
                }
                ws.onclose = function () {
                    console.log('连接关闭，定时重连')
                    __this.connect(ws)
                }
                ws.onerror = function () {
                    console.log('出现错误')
                }
            },
            /**
             * todo:用户搜索
             * @param queryString
             * @param cb (回调函数 cb(result))
             */
            querySearch: function (queryString, cb) {
                let result = []
                for (let i in this.chat.client_list) {
                    if (this.chat.client_list[i].client_name.indexOf(queryString) >= 0) {
                        result.push(this.chat.client_list[i])
                    }
                }
                this.chat.client_list_part = result
            },
            /**
             * todo:清空搜索内容
             */
            clearSearch: function () {
                this.chat.client_list_part = this.chat.client_list
            },
            /**
             * todo:设置未读消息数
             */
            setUsersLists: function () {
                // 展示单个用户未读消息数
                let unreadMessage = []
                this.chat.userOnline = 0
                this.chat.userTotal = 0
                for (let i in this.chat.client_list) {
                    if (this.userInfo.username === this.chat.client_list[i]['client_name']) {
                        unreadMessage = this.chat.client_list[i]['unread']
                        this.chat.msgCount = this.chat.client_list[i]['unreadCount']
                        this.$emit('setMsgCount', this.chat.msgCount)
                    }
                    if (this.chat.client_list[i]['online']) {
                        this.chat.userOnline++
                    }
                    this.chat.userTotal++
                }
                if (unreadMessage.length > 0) {
                    for (let i in unreadMessage) {
                        for (let j in this.chat.client_list) {
                            if (unreadMessage[i]['form'] === j) {
                                this.chat.client_list[j]['total'] = parseInt(unreadMessage[i]['total'])
                            }
                        }
                    }
                }
            },
            /**
             * TODO:设置群聊房间号
             * @param room
             */
            setRoomID: function (room) {
                if (this.chat.room_id !== room.id.toString()) {
                    this.showEmotion = false
                    this.finished = false
                    this.chat.room_id = room.id.toString()
                    this.chat.title = room.name
                    this.chat.desc = room.value
                    this.chat.currentPage = 1
                    this.chat.img = 'https://cdn.pixabay.com/photo/2016/12/13/21/20/alien-1905155_960_720.png'
                    // 加入房间
                    let login = {
                        type: 'login',
                        from_client_id: this.userInfo.uuid,
                        client_name: this.userInfo.username,
                        room_id: this.chat.room_id,
                        client_img: this.userInfo.avatar_url,
                        uid: this.userInfo.uuid,
                        adcode: this.userInfo.adcode
                    }
                    this.userInfo.websocketServer.send(JSON.stringify(login))
                }
                // 群聊时，接收方为所有用户
                this.chat.to_client_id = 'all'
                this.chat.to_client_name = 'all'
                // 获取聊天记录
                let str = {
                    type: 'history',
                    from_client_name: this.userInfo.username,
                    from_client_id: this.chat.from_client_id,
                    to_client_name: this.chat.to_client_name,
                    to_client_id: this.chat.to_client_id,
                    room_id: this.chat.to_client_name === 'all' ? this.chat.room_id : '',
                    uid: this.userInfo.uuid,
                    page: this.chat.currentPage,
                    limit: this.chat.sizeLimit,
                    source: 'room'
                }
                this.userInfo.websocketServer.send(JSON.stringify(str))
            },
            /**
             * TODO:设置发送给谁
             * @param user
             * @param clientId
             */
            sendUser: function (user, clientId) {
                this.finished = false
                this.chat.to_client_name = user.client_name
                this.chat.to_client_id = clientId === '0' ? 'all' : clientId
                this.chat.from_client_id = user.uid
                this.chat.uid = this.chat.to_client_id
                this.chat.title = user.client_name
                if (this.chat.users) {
                    this.chat.users = user.client_name
                }
                this.chat.img = user.client_img
                this.chat.desc = user.centerInfo.desc
                this.chat.room_id = ''
                user.total = 0
                this.chat.currentPage = 1
                // 获取聊天记录
                let str = {
                    type: 'history',
                    from_client_name: this.userInfo.username,
                    from_client_id: this.userInfo.uuid,
                    to_client_name: this.chat.to_client_name,
                    to_client_id: this.chat.to_client_id,
                    room_id: this.chat.to_client_name === 'all' ? this.chat.room_id : '',
                    uid: this.userInfo.uuid,
                    page: this.chat.currentPage,
                    limit: this.chat.sizeLimit,
                    source: 'user'
                }
                this.userInfo.websocketServer.send(JSON.stringify(str))
            },
            /**
             * TODO:获取发送内容
             */
            setMsg: function () {
                this.inputMsg = this.$refs.message.innerHTML
            },
            /**
             * TODO:发送表情
             * @param emotion
             */
            getEmotion: function (emotion) {
                this.chat.msg_type = 'text'
                this.inputMsg += "<img src='" + emotion.icon + "' width='50px' height='50px' style='object-fit: contain;' alt='" + emotion.emoji + "' title='" + emotion.title + "'>"
                this.$refs.message.innerHTML = this.inputMsg
            },
            /**
             * TODO：图片上传成功
             * @param response
             */
            uploadSuccess: function (response) {
                if (response && response.code === 200) {
                    switch (this.chat.msg_type) {
                    case 'img':
                        this.inputMsg += "<img src='" + response.item.src + "' width='100px' height='100px' style='object-fit: contain;' alt='" + this.chat.from_client_name + "'>"
                        break
                    case 'video':
                        this.inputMsg += "<video src='" + response.item.src + "' width='200px' height='200px' controls='controls'>"
                        break
                    }
                    this.$refs.message.innerHTML = this.inputMsg
                    return
                }
                this.$message({type: 'warning', message: response.msg})
            },
            /**
             * TODO：图片上传前
             * @param file
             */
            beforeUpload: function (file) {
                let ext = file.name.split('.')[1]
                switch (ext.toLocaleLowerCase()) {
                case 'jpg':
                case 'gif':
                case 'png':
                case 'jpeg':
                    this.chat.msg_type = 'img'
                    if (file.size > 2 * 1024 * 1024) {
                        this.$message({type: 'warning', message: 'upload image size error'})
                    }
                    break
                case 'mp4':
                    this.chat.msg_type = 'video'
                    if (file.size > 5 * 1024 * 1024) {
                        this.$message({type: 'warning', message: 'upload video size error'})
                    }
                    break
                default:
                    this.$message({type: 'warning', message: 'Unsupported file format'})
                    break
                }
            },
            /**
             * TODO:发送消息
             * @param data
             */
            say: function (data) {
                if (this.userInfo.username !== data['from_client_name']) {
                    if (data['to_client_id'] !== 'all') {
                        this.chat.title = data['from_client_name']
                        this.chat.to_client_name = data['from_client_name']
                        this.chat.to_client_id = data['from_client_id']
                    }
                    this.chat.messageLists.push(data)
                    this.pushMessage(data['content'])
                }
                if (this.chatVisible && this.userInfo.username === data['from_client_name']) {
                    if (data['to_client_id'] !== 'all') {
                        this.chat.title = data['to_client_name']
                        this.chat.to_client_name = data['to_client_name']
                        this.chat.to_client_id = data['to_client_id']
                    }
                }
            },
            /**
             * TODO:消息发送
             */
            sendMsg: function () {
                this.showEmotion = false
                this.inputMsg = this.$refs.message !== undefined ? this.$refs.message.innerHTML : ''
                if (this.inputMsg.trim() !== '') {
                    // 发送消息
                    let str = {
                        type: 'say',
                        to_client_id: this.chat.to_client_id,
                        to_client_name: this.chat.to_client_name,
                        from_client_name: this.userInfo.username,
                        from_client_id: this.userInfo.uuid,
                        msg_type: this.chat.msg_type,
                        content: this.inputMsg,
                        client_img: this.userInfo.avatar_url,
                        room_id: this.chat.to_client_name === 'all' ? this.chat.room_id : '',
                        uid: this.chat.uid,
                        time: func.setTime(func.getTimestamp() * 1000)
                    }
                    this.userInfo.websocketServer.send(JSON.stringify(str))
                    this.chat.messageLists.push(str)
                    this.$refs.vsl.scrollToBottom()
                    this.$refs.message.innerHTML = ''
                    this.inputMsg = ''
                    return
                }
                if (this.chatVisible) {
                    this.$refs.message.focus()
                    this.$message({type: 'info', message: 'Please enter message'})
                }
            },
            /**
             * todo:推送弹框消息
             * @param message
             */
            pushMessage: function (message) {
                Push.create('你有未读消息', {
                    body: message,
                    requireInteraction: true,
                    icon: 'https://www.fanglonger.com/favicon.ico',
                    timeout: 60000
                })
            },
            /**
             * todo:删除消息
             */
            removeMessageList: function (targetMessage) {
                if (this.chat.messageLists.length > 0) {
                    let i = 0
                    this.chat.messageLists.map((item, index) => {
                        if (this.compareJson(item, targetMessage)) {
                            i = index
                        }
                    })
                    let __this = this
                    let messageLists = []
                    Object.keys(__this.chat.messageLists).forEach(function (message) {
                        messageLists.push(__this.chat.messageLists[message])
                    })
                    messageLists.splice(i, 1)
                    this.chat.messageLists = messageLists
                }
            },
            /**
             * todo:json字符串比较
             * @param jsonA
             * @param jsonB
             * @param field
             * @returns {boolean}
             */
            compareJson: function (jsonA, jsonB, field = ['type']) {
                let a = Object.keys(jsonA)
                let b = Object.keys(jsonB)
                if (a.length !== b.length) {
                    return false
                }
                let total = a.length
                let num = field.length
                for (let i in jsonA) {
                    if (!field.includes(i) && jsonA[i] === jsonB[i]) {
                        num++
                    }
                }
                return num === total
            }
        },
        /**
         * todo：生命周期
         */
        created () {
            // 初始化聊天系统参数
            this.chat = {
                to_client_name: 'all',
                to_client_id: 'all',
                from_client_id: this.userInfo.uuid,
                from_client_name: this.userInfo.username,
                uid: this.userInfo.uuid,
                room_id: this.userInfo.room_id,
                title: this.userInfo.room_name,
                msgCount: 0,
                client_list: [],
                client_list_part: [],
                img: 'https://cdn.pixabay.com/photo/2016/12/13/21/20/alien-1905155_960_720.png',
                desc: '',
                messageLists: [],
                msg_type: 'text',
                users: '',
                userTotal: 0,
                userOnline: 0,
                currentPage: this.currentPage,
                sizeLimit: this.sizeLimit,
                messageTotal: 0
            }
            // 浏览器消息推送
            try {
                Push.Permission.request()
            } catch (e) {
                // eslint-disable-next-line no-unused-expressions
                e ? this.$message.error(JSON.stringify(e)) : ''
            }
            // 图片上传参数
            this.fileData.token = this.userInfo.token
            this.fileData.rand = false
            this.headers.Authorization = `${func.setPassword(func.setRandom(32), func.setRandom(12))}${this.userInfo.token}${func.setPassword(func.setRandom(32), func.setRandom(12))}`
            // 客服系统初始化
            this.connect(this.userInfo.websocketServer)
            this.getOauthConfig('RoomLists')
            this.getOauthConfig('GroupAnnouncementConfig')
            let __this = this
            // 键盘事件
            document.onkeydown = function (e) {
                if (e.code === 'Enter' && e.shiftKey) {
                    e.preventDefault()
                    __this.sendMsg()
                    return false
                }
            }
            // 撤回消息
            this.$on('recallMessage', (newMessage, oldMessage) => {
                // 消息撤回
                newMessage.type = 'recall'
                newMessage['recall_message'] = JSON.parse(JSON.stringify(oldMessage))
                this.removeMessageList(oldMessage)
                // 消息推送
                this.userInfo.websocketServer.send(JSON.stringify(newMessage))
                this.chat.messageLists.push(newMessage)
            })
            // 删除消息
            this.$on('deleteMessage', (newMessage, oldMessage) => {
                // 删除消息
                newMessage.type = 'srem'
                this.removeMessageList(oldMessage)
                this.userInfo.websocketServer.send(JSON.stringify(newMessage))
            })
        }
    }
</script>
<style>
.user-list{
    min-height:355px;
    max-height: 355px;
    overflow: hidden;
    overflow-y: auto;
    padding: 0 !important;
}
#content{
    border: 1px solid #eee;
    height: 95px;
    border-radius: 10px;
    -moz-border-radius:10px;
    -webkit-border-radius:10px;
    padding:10px;
    overflow: scroll;
    overflow-x: hidden;
}
.input-msg{
    min-height: 100px;
    margin-bottom: 10px;
    margin-top: 10px;
}
.input-msg .icon{
    font-size: 25px;
    margin:0 10px 10px 0;
    color: #000;
    cursor: pointer;
}
#leftBox {
    padding-left: 0 !important;
    padding-right: 2px !important;
}
#rightBox {
    padding: 0 !important;
}
#rightBox .el-input__inner{
    margin-bottom: 10px;
}
.el-autocomplete-suggestion {
    display: none;
}
#chat .el-dialog__header {
    background: #409EFF;
}
#chat .el-dialog--center .el-dialog__body {
    padding: 5px 15px 5px !important;
}
#chat .el-card {
    border-radius: 0 !important;
    -webkit-border-radius:  0 !important;
    -moz-border-radius:  0 !important;
}
</style>
<style lang="less">
#chat {
    .stream, .empty {
        position: relative;
        width: 100%;
        height: 320px;
        overflow-y: auto;
        border: 1px solid #eee;
        display: flex;
        flex-direction: column-reverse;

        &.overflow {
            flex-direction: column;
        }

        .stream-item {
            display: flex;
            align-items: center;
            padding: 1em;

            &.creator {
                flex-direction: row-reverse;
            }
        }
    }

    .empty {
        .wrapper {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: #bfbfbf;
        }

        .icon {
            width: 70px;
            height: 70px;
            background-size: cover;
            background-image: url("data:image/svg+xml,%3Csvg t='1587779561352' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='1970' width='200' height='200'%3E%3Cpath d='M915.90919 428.28025l40.909735 6.785543 1.77339-10.488889 8.708336-12.93766-103.649662-69.574588-7.776104-5.219885-7.837502-2.918469L552.61093 223.932142l-6.92676-2.579755-6.962575 2.308579-347.57209 115.214045-8.804527 2.14792-5.704932 4.046153L53.550637 432.126858l9.832949 13.854543 4.493338 11.238972 39.739073-16.353456L75.734892 485.09114l96.368838 54.05001 0.107447 199.534476-2.349511 4.28356 2.352581 1.310855 0.001023 2.709715 4.859681 0 281.95872 157.194158 7.696286 4.260024 2.344395 1.277086 2.635013 1.726318 9.41851-3.080152 8.748245-3.419889 388.69979-159.572322 0.031722-9.44307L878.607632 546.373879l92.490507-35.759435L915.90919 428.28025zM561.218982 260.057921l245.843174 91.538833-245.843174 92.115977L561.218982 260.057921zM121.002888 475.127208l40.684608-56.45171 5.983271-8.358365 23.439852-32.558533 262.998903 123.622552L411.290297 637.993552 121.002888 475.127208zM203.051579 726.133985l-0.100284-169.629375 226.371704 126.989229 28.646434-91.38636 0.893346 276.69688L203.051579 726.133985zM473.818399 476.500485 225.704508 359.870184l304.674071-100.980879 0 196.376553L473.818399 476.500485zM847.766207 724.616422 489.771743 871.571379l-0.955768-301.186643 45.281299 109.166305 313.667909-121.215736L847.765183 724.616422zM551.061644 639.889739l-57.241702-137.940652 347.098299-130.082684 83.064834 123.892705L551.061644 639.889739z' p-id='1971' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E");
        }
    }

    .header {
        padding: .5em;
        .finished {
            font-size: 14px;
            text-align: center;
            color: #bfbfbf;
        }

        .spinner {
            font-size: 10px;
            margin: 0 auto;
            text-indent: -9999em;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #ffffff;
            background: linear-gradient(to right, #ccc 10%, rgba(255, 255, 255, 0) 42%);
            position: relative;
            animation: load3 1.4s infinite linear;
            transform: translateZ(0);
        }

        .spinner:before {
            width: 50%;
            height: 50%;
            background: #ccc;
            border-radius: 100% 0 0 0;
            position: absolute;
            top: 0;
            left: 0;
            content: '';
        }

        .spinner:after {
            background: #ffffff;
            width: 75%;
            height: 75%;
            border-radius: 50%;
            content: '';
            margin: auto;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
        }

        @-webkit-keyframes load3 {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        @keyframes load3 {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    }
}
</style>
