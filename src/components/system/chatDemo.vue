<template>
    <!---chat message-->
    <el-dialog :title="chatTitle" @close="chatVisible = false" top="3vh" width="80%"
               :center="center" :show-close="closeModel"
               :close-on-press-escape="closeModel"
               :close-on-click-modal="closeModel"
               :visible.sync="chatVisible">
        <el-row :gutter="24">
            <el-col :span="6" class="user-list">
                <div class="aside">
                    <el-menu background-color="#393d49" text-color="#fff" active-text-color="#ffd04b">
                        <el-menu-item @click="sendUser(user,index)" v-for="(user,index) in client_list" :key="index" :index="index.toString()">
                            <el-avatar :size="50" :src="user.client_img" style="cursor: pointer"/>
                            <span slot="title" style="margin-left: 20px" v-html="user.client_name"/>
                            <!--未读消息数-->
                            <el-badge v-if="user.total" type="danger" :value="user.total" style="top: 10px;right: 15px"/>
                            <!--在线-->
                            <el-badge v-else-if="user.online" type="success" is-dot style="top: 12px;right: 10px"/>
                            <!--离线-->
                            <el-badge v-else-if="!user.online" type="info" is-dot style="top: 12px;right: 10px"/>
                        </el-menu-item>
                    </el-menu>
                </div>
            </el-col>
            <el-col :offset="1" :span="17">
                <el-card shadow="always">
                    <div id="msg">
                        <div v-for="(message,index) in messageLists" :key="index">
                            <div class="msg-img">
                                <el-avatar :size="50" :src="message.avatar_url" style="cursor: pointer"/>
                                <i>{{message.from_client_name}}   {{message.time}}</i>
                            </div>
                            <div class="msg-list" v-html="unescape(message.content)"></div>
                        </div>
                    </div>
                    <div class="input-msg">
                        <emotion @clickEmotion="getEmotion" v-show="showEmotion" :height="300"/>
                        <div>
                            <el-tooltip effect="dark" content="房间名称" placement="top-start">
                                <el-menu :default-active="room_id" mode="horizontal" style="margin-bottom: 10px;border: none">
                                    <el-menu-item @click="setRoomID(room)" v-for="(room,index) in oauthConfig" :key="index" :index="room.id.toString()">
                                        {{room.value}}
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
                                    <i class="el-icon-picture-outline icon"/>
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
        </el-row>
    </el-dialog>
    <!---chat message-->
</template>

<script>
    import { mapGetters,mapActions } from 'vuex'
    import apiLists from '../../api/api'
    import $url from '../../api/url'
    import func from '../../api/func'
    import emotion from '../common/emotion/Index'
    export default {
        name: "chatDemo",
        data(){
            return {
                //workerManChat
                cgi:{
                    uploadUrl:process.env.API_ROOT+$url.fileUpload
                },
                chatTitle:'隨心所欲,隨性而行',
                fileData:{},
                headers:{},
                chatVisible:true,
                client_list:[],
                inputMsg:'',
                emotionLists:[],
                showEmotion:false,
                closeModel:false,
                center:true,
                messageLists:[],
                msg_type:'text',
                to_client_name:'all',
                to_client_id:'all',
                chatMsgClass:'el-icon-chat-dot-round',
                msg_dot:false,
                room_id:'1200',
                noticeArr:[],
                uid:'',
            }
        },
        components:{
            emotion
        },
        computed:{
            ...mapGetters(['userInfo','oauthConfig']),
        },
        methods:{
            ...mapActions(['getOauthConfig']),
            /**
             * TODO:字符串标签转换
             * @param html
             */
            unescape:function (html) {
                return html
                    .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">")
                    .replace(/&quot;/g, "\"")
                    .replace(/&amp;nbsp;/g," ")
                    .replace(/&#39;/g, "\'");
            },
            /**
             * TODO:workerMan-chat链接
             * @param ws
             */
            connect:function(ws){
                let __this = this;
                // 连接建立时发送登录信息
                ws.onopen = function(){
                    let str = {
                        type:'login',
                        client_name:__this.userInfo.username,
                        room_id:__this.room_id,
                        client_img:__this.userInfo.avatar_url,
                        uid:__this.userInfo.uuid,
                    };
                    ws.send(JSON.stringify(str))
                };
                ws.onmessage = function(response){
                    let data = JSON.parse(response.data);
                    switch (data['type']) {
                        //心跳
                        case 'ping':
                            ws.send('{"type":"pong"}');
                            break;
                        //登陆
                        case 'login':
                            let unreadArr = [];
                            __this.client_list = data.client_list;
                            //展示单个用户未读消息数
                            for (let i in __this.client_list) {
                                if (__this.userInfo.username === __this.client_list[i]['client_name']) {
                                    unreadArr = __this.client_list[i].unread;
                                }
                            }
                            if (unreadArr.length>0) {
                                for (let i in unreadArr) {
                                    for (let j in __this.client_list) {
                                        if (unreadArr[i]['form'] === __this.client_list[j]['client_name']) {
                                            __this.client_list[j]['total'] = unreadArr[i]['total'];
                                        }
                                    }
                                }
                            }
                            break;
                        //发送消息
                        case 'say':
                            __this.say(data);
                            break;
                        //聊天记录
                        case 'history':
                            __this.messageLists = data.message;
                            console.log(__this.messageLists);
                            break;
                        case 'logout':
                            console.log(data);
                            break;
                    }
                };
                ws.onclose = function() {
                    console.log("连接关闭，定时重连");
                    __this.connect(ws);
                };
                ws.onerror = function() {
                    console.log("出现错误");
                };
            },
            /**
             * TODO:弹出框展示
             */
            getMsgDialog:function(){
                this.chatVisible = !this.chatVisible;
                if (!this.chatVisible) {
                    this.chatMsgClass = 'el-icon-chat-dot-round';
                } else {
                    this.chatMsgClass = 'el-icon-close';
                    //获取聊天记录
                    let str = {
                        type:'history',
                        from_client_name:this.userInfo.username,
                        to_client_name:this.to_client_name,
                        room_id:this.to_client_name === 'all' ? this.room_id : '',
                        uid:this.userInfo.uuid,
                    };
                    this.userInfo.websocketServer.send(JSON.stringify(str));
                    this.getOauthConfig('RoomLists');
                    this.scrollToBottom();
                    this.msg_dot = false;
                }
            },
            /**
             * TODO:设置群聊房间号
             * @param room
             */
            setRoomID:function(room) {
                this.showEmotion = false;
                this.room_id = room.id.toString();
                this.chatTitle = room.value;
                //加入房间
                let login = {
                    type:'login',
                    client_name:this.userInfo.username,
                    room_id:this.room_id,
                    client_img:this.userInfo.avatar_url,
                    uid:this.userInfo.uuid,
                };
                this.userInfo.websocketServer.send(JSON.stringify(login))
                //获取聊天记录
                let str = {
                    type:'history',
                    from_client_name:this.userInfo.username,
                    to_client_name:'all',
                    room_id:this.room_id,
                    uid:this.userInfo.uuid
                };
                this.userInfo.websocketServer.send(JSON.stringify(str));
                this.scrollToBottom();
            },
            /**
             * TODO:设置发送给谁
             * @param user
             * @param client_id
             */
            sendUser:function(user,client_id) {
                this.to_client_name = user.client_name;
                user.total = 0;
                this.to_client_id = client_id === '0' ? 'all' : client_id;
                this.uid = this.to_client_id;
                this.chatTitle = user.client_name === 'all' ? 'ChatRoom' : user.client_name;
                this.avatar_url = this.userInfo.avatar_url;
                //获取聊天记录
                let str = {
                    type:'history',
                    from_client_name:this.userInfo.username,
                    to_client_name:this.to_client_name,
                    room_id:'',
                    uid:this.uid
                };
                this.userInfo.websocketServer.send(JSON.stringify(str));
                this.scrollToBottom();
            },
            /**
             * TODO:获取发送内容
             */
            setMsg:function(){
                this.inputMsg = this.$refs.message.innerHTML;
            },
            /**
             * TODO:发送表情
             * @param emotion
             */
            getEmotion (emotion) {
                this.msg_type = 'text';
                this.inputMsg+= "<img src='"+emotion.icon+"' width='50px' height='50px' alt='"+emotion.emoji+"' title='"+emotion.title+"'>"
                this.$refs.message.innerHTML = this.inputMsg;
            },
            /**
             * TODO：图片上传成功
             * @param response
             */
            uploadSuccess:function(response){
                if (response && response.code === 200){
                    switch (this.msg_type) {
                        case 'img':
                            this.inputMsg+= "<img src='"+response.item.src+"' width='100px' height='100px' alt=''>";
                            break;
                        case 'video':
                            this.inputMsg+= "<video src='"+response.item.src+"' width='200px' height='200px' controls='controls'>";
                            break;
                    }
                    this.$refs.message.innerHTML = this.inputMsg;
                    return ;
                }
                this.$message({type:'warning',message:response.msg});
            },
            /**
             * TODO：图片上传前
             * @param file
             */
            beforeUpload:function(file){
                let ext = file.name.split('.')[1];
                switch (ext.toLocaleLowerCase()) {
                    case 'jpg':
                    case 'gif':
                    case 'png':
                    case 'jpeg':
                        this.msg_type = 'img';
                        if (file.size>2*1024*1024){
                            this.$message({type:'warning',message:'upload image size error'});
                        }
                        break;
                    case 'mp4':
                        this.msg_type = 'video';
                        if (file.size>5*1024*1024){
                            this.$message({type:'warning',message:'upload video size error'});
                        }
                        break;
                    default:
                        this.$message({type:'warning',message:'Unsupported file format'});
                        break;
                }
            },
            /**
             * TODO:发送消息
             * @param data from_client_id from_client_name content time msg_type to_client_name to_client_id
             */
            say:function(data){
                let str = {
                    type:'history',
                    from_client_name:data['from_client_name'],
                    to_client_name:data['to_client_name'],
                    room_id:data['room_id'],
                    uid:data['uid'],
                };
                //获取历史记录信息
                this.userInfo.websocketServer.send(JSON.stringify(str));
                this.messageLists.push(data);
                if (this.username!==data['from_client_name']){
                    if (data['to_client_id']!=='all') {
                        this.chatTitle = data['from_client_name'];
                        this.to_client_name = data['from_client_name'];
                        this.to_client_id = data['from_client_id'];
                    }
                    this.msg_dot = true;
                }
                if (this.chatVisible && this.username===data['from_client_name']) {
                    if (data['to_client_id']!=='all') {
                        this.chatTitle = data['to_client_name'];
                        this.to_client_name = data['to_client_name'];
                        this.to_client_id = data['to_client_id'];
                    }
                    this.scrollToBottom();
                }
            },
            /**
             * TODO:消息发送
             */
            sendMsg:function(){
                this.showEmotion = false;
                this.inputMsg= this.$refs.message !== undefined ? this.$refs.message.innerHTML : '';
                if (this.inputMsg.trim() !== '') {
                    //发送消息
                    let str = {
                        type:'say',
                        to_client_id:this.to_client_id,
                        to_client_name:this.to_client_name,
                        from_client_name:this.userInfo.username,
                        msg_type:this.msg_type,
                        content:this.inputMsg,
                        avatar_url:this.userInfo.avatar_url,
                        room_id:this.to_client_name === 'all' ? this.room_id : '',
                        uid:this.uid,
                    };
                    this.userInfo.websocketServer.send(JSON.stringify(str));
                    //获取历史记录信息
                    let history = {
                        type:'history',
                        from_client_name:this.userInfo.username,
                        to_client_name:this.to_client_name,
                        room_id:this.to_client_name === 'all' ? this.room_id : '',
                        uid:this.uid,
                    };
                    this.userInfo.websocketServer.send(JSON.stringify(history));
                    this.messageLists.push(str);
                    this.scrollToBottom();
                    this.$refs.message.innerHTML = '';
                    this.inputMsg = '';
                    return ;
                }
                if (this.chatVisible) {
                    this.$refs.message.focus();
                    this.$message({type:'info',message:'Please enter message'})
                }
            },
            /**
             * TODO:滚动条滚动到底部
             */
            scrollToBottom: function () {
                this.$nextTick(() => {
                    let div = document.getElementById('msg');
                    try {
                        div.scrollTop = div.scrollHeight
                    } catch (e) {
                        this.$message.error(JSON.stringify(e));
                    }
                })
            }
        },
        /**
         * todo：生命周期
         */
        created(){
            //图片上传参数
            this.avatar_url = this.avatarUrl;
            this.fileData.token = this.token;
            this.fileData.rand = false;
            this.headers.Authorization = `${func.set_password(func.set_random(32),func.set_random(12))}${this.token}${func.set_password(func.set_random(32),func.set_random(12))}`
            //客服系统初始化
            this.connect(this.userInfo.websocketServer);
            this.getOauthConfig('RoomLists');
            let __this = this;
            //键盘事件
            document.onkeydown = function (e) {
                if (e.code === 'Enter' && e.shiftKey) {
                    e.preventDefault();
                    __this.sendMsg();
                    return false;
                }
            }
        },
        /**
         * todo：生命周期
         */
        watch:{
            chatVisible:function () {
                if (!this.chatVisible) {
                    this.chatMsgClass = 'el-icon-chat-dot-round';
                }
            },
            inputMsg:function () {
                this.inputMsg = this.$refs.message.innerHTML;
            }
        },
    }
</script>
<style scoped>
    .el-main{
        margin-bottom: 60px;
    }
    .user-list{
        box-shadow: 0 2px 12px #ffffff, 0 0 6px #F5F5F5;
        min-height:715px;
        background-color:#ffffff;
        border-radius:10px;
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
        max-height: 715px;
        overflow: hidden;
        overflow-y: auto;
        padding: 0 !important;
    }
    .user-list .aside {
        background-color:#393d49;
        border-radius:10px;
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
    }
    .contact-list{
        box-shadow: 0 1px 0 #ffffff, 0 1px 2px #545c64;
        min-height:600px;
        border: 1px solid #F5F5F5;
        border-radius:10px;
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
    }
    #msg{
        max-height: 380px;
        min-height: 380px;
        margin:10px 0 20px 0;
        overflow: hidden;
        overflow-y: auto;
        border: 1px solid #eee;
        border-radius: 10px;
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
    }
    #msg .msg-list{
        box-shadow: 0 1px 0 #ffffff, 0 1px 2px #505860;
        line-height: 28px;
        min-height: 20px;
        margin: 0 15px 15px 15px;
        font-family: "Source Code Pro", monospace;
        font-size: 15px;
        padding:15px;
        border-radius: 10px;
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
        background:-webkit-gradient(linear, left top, left bottom, from(#eaeaea), to(#ffffff));
        　background:-moz-linear-gradient(top, #eaeaea, #ffffff);
        　　　　background:-o-linear-gradient(top, #eaeaea, #ffffff);
        　　　　background:linear-gradient(top, #eaeaea, #ffffff);
        position:relative;
    }
    #msg .msg-list:after {
        content:'';
        position:absolute;
        bottom:100%;
        left:15px;
        width:0;
        height:0;
        border-width:10px;
        border-style:solid;
        border-color:transparent;
        margin-bottom:-4px;
        border-bottom-width:16px;
        border-bottom-color:currentColor;
        color:#eaeaea;
    }
    #msg .msg-img{
        margin: 15px;
    }
    #content{
        border: 1px solid #eee;
        height: 95px;
        border-radius: 10px;
        padding:10px;
        overflow: scroll;
        overflow-x: hidden;
    }
    .input-msg{
        min-height: 100px;
        margin-bottom: 10px;
    }
    .input-msg .icon{
        font-size: 25px;
        margin:0 10px 10px 0;
        color: #000;
        cursor: pointer;
    }
    .msg-icon{
        font-size: 50px;
        color:#ffffff;
        position:fixed;
        right:10px;
        bottom:10%;
        width: 80px;
        height: 80px;
        background: #0066ff;
        border-radius: 40px;
        -moz-border-radius:40px;
        -webkit-border-radius:40px;
        z-index: 20004;
    }
    .msg-count{
        position:absolute;
        right:9px;
        bottom:54%;
    }
</style>
