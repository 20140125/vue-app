<template>
    <div :style="bgStyle" id="main">
        <el-row :gutter="24" style="padding-top: 190px;">
            <el-col :span="14" :offset="5">
                <el-row :gutter="24" style="width: 1135px;">
                    <!--聊天用户-->
                    <el-col :span="6" v-if="showLeftBar" class="left-bar">
                        <el-card shadow="hover">
                            <LeftBar :chat-users="chatUsers" :user-info="userInfo" @getReceiver="getReceiver"></LeftBar>
                        </el-card>
                    </el-col>
                    <!--消息记录-->
                    <el-col :span="(showLeftBar && showRightBar) ? 12 : ((showLeftBar || showRightBar) ? 18 : 24)" class="main-bar">
                        <el-card shadow="hover">
                            <MessageBox @sendMessage="sendMessage" ref="messageBox" :user-info="userInfo" :message-lists="messageLists" :receive-name="receiver.client_name"></MessageBox>
                        </el-card>
                    </el-col>
                    <!--所有用户-->
                    <el-col :span="6" v-if="showRightBar" class="right-bar">
                        <el-card shadow="hover">
                            <RightBar :client-users="clientUsers" :user-info="userInfo" @getReceiver="getReceiver"></RightBar>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import func from '@/utils/func';
import Push from 'push.js';
import LeftBar from '@/components/chat/LeftBar';
import RightBar from '@/components/chat/RightBar';
import MessageBox from '@/components/chat/MessageBox';
import router from '@/route/index';

export default {
    name: 'chatMain',
    components: {MessageBox, RightBar, LeftBar},
    props: {
        showLeftBar: {
            type: Boolean,
            default: () => true
        },
        showRightBar: {
            type: Boolean,
            default: () => true
        }
    },
    data() {
        return {
            imageLists: ['u0.jpg', 'u1.jpg', 'u2.jpg', 'u3.jpeg'],
            title: '在线客服',
            visible: true,
            bgStyle: {},
            receiver: {}
        };
    },
    created() {
        this.bgStyle = {
            'background': 'url(' + require(`../../assets/chat/${this.imageLists[Math.random() * this.imageLists.length | 0]}`) + ')',
            'background-repeat': 'no-repeat',
            'height': (window.innerHeight) + 'px'
        };
        if (!this.Permission) {
            router.push({ path: '/login'});
        }
    },
    computed: {
        /** todo:登录用户信息  **/
        userInfo() {
            return {...this.$store.state.login.userInfo};
        },
        /** todo:webSocketServer  **/
        webSocketServer() {
            return new WebSocket(this.userInfo.websocket);
        },
        /** todo:所有用户  **/
        clientUsers() {
            return this.$store.state.chat.clientUsers;
        },
        /** todo:通讯用户  **/
        chatUsers() {
            return this.$store.state.chat.chatUsers;
        },
        /** todo:客户端公告  **/
        clientLog() {
            return this.$store.state.chat.clientLog;
        },
        /** todo:消息列表 **/
        messageLists() {
            return this.$store.state.chat.messageLists;
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.Permission) {
                router.push({ path: '/login'});
            }
            this.getConnection(this.webSocketServer);
        });
    },
    methods: {
        /**
         * todo：webSocketServer链接
         * @param webSocketServer
         */
        async getConnection(webSocketServer) {
            const __this = this;
            /* todo:用户登录 */
            webSocketServer.onopen = async function () {
                const jsonStr = {
                    type: 'login',
                    from_client_id: __this.userInfo.uuid,
                    client_name: __this.userInfo.username,
                    room_id: __this.userInfo.room_id,
                    client_img: __this.userInfo.avatar_url,
                    uuid: __this.userInfo.uuid
                };
                await __this.pushClientLog('正在登入系统。。。', jsonStr.client_name);
                webSocketServer.send(JSON.stringify(jsonStr));
            };
            /* todo:消息往来 */
            webSocketServer.onmessage = async function (response) {
                const message = JSON.parse(response.data);
                switch (message.type) {
                    case 'ping':
                        webSocketServer.send('{"type":"pong"}');
                        break;
                    case 'login':
                        await __this.$store.dispatch('chat/addClientUsers', {clientUsers: (message || {}).client_lists || []});
                        await __this.pushClientLog('登入系统成功', message.from_client_name);
                        break;
                    case 'say':
                        await __this.receiveMessage(message);
                        await __this.$store.dispatch('chat/addClientUsers', {clientUsers: (message || {}).client_lists || []});
                        await __this.pushClientLog('接收消息成功', message.to_client_name);
                        break;
                    case 'logout':
                        await __this.pushClientLog('登出系统成功', message.from_client_name);
                        break;

                }
            };
            /* todo:消息发送失败 */
            webSocketServer.onmessageerror = function () {
                __this.pushClientLog('消息发送失败');
            };
            /* todo:链接关闭 */
            webSocketServer.onclose = function () {
                __this.pushClientLog('链接断开尝试重新连接');
                __this.connect(webSocketServer);
            };
            /* todo:链接异常 */
            webSocketServer.onerror = function () {
                __this.pushClientLog('链接异常');
            };
        },
        /**
         * todo:获取接收者信息
         * @param user
         */
        getReceiver(user) {
            this.receiver = user;
        },
        /**
         * todo:发送消息
         * @param message
         */
        sendMessage(message) {
            if (this.receiver.client_name) {
                let jsonStr = {
                    type: 'say',
                    to_client_id: this.receiver.uuid,
                    to_client_name: this.receiver.client_name,
                    from_client_name: this.userInfo.username,
                    from_client_id: this.userInfo.uuid,
                    content: message,
                    client_img: this.userInfo.avatar_url,
                    room_id: this.receiver.to_client_name === 'all' ? this.receiver.room_id : '',
                    uuid: this.receiver.uuid,
                    time: func.setTime(Date.parse(new Date()))
                };
                this.webSocketServer.send(JSON.stringify(jsonStr));
                this.$refs['messageBox'].$refs['message'].innerHTML = '';
                this.$store.dispatch('chat/addMessageLists', {message: jsonStr, uuid: this.userInfo.uuid});
                this.pushClientLog('发送消息成功', this.userInfo.username);
                func.scrollToBottom('.messageLists');
            }
        },
        /**
         * TODO:接收消息
         * @param message
         */
        async receiveMessage(message) {
            for (let index in this.clientUsers) {
                if (index === message.from_client_id) {
                    this.$store.dispatch('chat/addChatUsers', this.clientUsers[index]);
                    this.receiver = this.clientUsers[index];
                }
            }
            await this.$store.dispatch('chat/addMessageLists', {message: message, uuid: this.userInfo.uuid});
            func.scrollToBottom('.messageLists');
            this.pushMessage(message.content);
        },
        /**
         * todo:控制台信息
         * @param message
         * @param username
         */
        async pushClientLog(message, username = '通知') {
            let clientLog = {time: func.setTime(Date.parse(new Date()), 'ch'), message: message, username: username};
            await this.$store.dispatch('chat/addClientLog', clientLog);
        },
        /**
         * todo:推送弹框消息
         * @param message
         */
        pushMessage(message) {
            Push.create('你有未读消息', {body: message, requireInteraction: true, icon: 'https://www.fanglonger.com/favicon.ico', timeout: 60000});
        }
    }
};
</script>
<style lang="less">
#main {
    width: 100%;
    .main-bar {
        min-width: 545px !important;
    }
    .left-bar, .right-bar {
        .el-card__body {
            padding: 0 !important;
        }
        padding: 0 !important;
        min-width: 280px !important;
    }
}
</style>
