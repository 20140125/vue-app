<template>
    <el-container>
        <el-header>
            <el-menu :default-active="activeIndex" mode="horizontal" background-color="#393d49" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" :style="headerStyle">
                <el-menu-item index="1" @click="hideMenu"> <i :class="menuClass" style="color: #fff;font-size: 25px"> </i></el-menu-item>
                <el-submenu index="2" style="float: right">
                    <template slot="title">
                        <el-avatar :src="avatarUrl" :alt="username" :size="35"/>
                        <span v-html="username" style="margin-left: 10px"></span>
                    </template>
                    <el-menu-item index="2-1"><i class="el-icon-user-solid"> </i> 个人中心</el-menu-item>
                    <el-menu-item index="2-2"><i class="el-icon-upload2"> </i> 退出系统</el-menu-item>
                </el-submenu>
                <el-menu-item index="3" style="float: right">
                    <el-dropdown trigger="hover" @command="readNotice">
                        <i class="el-icon-message-solid" style="color: #fff;font-size: 22px"> </i>
                        <el-badge :value="noticeLength" style="margin-top: -30px;margin-left: -18px" v-if="noticeLength"/>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>站内通知</el-dropdown-item>
                            <el-dropdown-item :command="item" divided v-for="(item,index) in notice" :key="index" :disabled="item.disabled">
                                <el-badge is-dot v-if="!item.disabled"></el-badge>【{{item.title}}】 {{item.info}}
                            </el-dropdown-item>
                            <el-dropdown-item command="more" style="text-align: center;color: #66b1ff">查看更多</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-menu-item>
                <el-menu-item index="4"  style="float: right">
                    <a href="https://gitee.com/f_longer/vue-app" target="_blank">
                        <img src="https://gitee.com/f_longer/longer/widgets/widget_5.svg?color=C71D24" alt="gitee"/>
                    </a>
                </el-menu-item>
            </el-menu>
        </el-header>
        <el-container>
            <el-aside :width="asideWidth" :style="asideHeight">
                <el-menu unique-opened  background-color="#393d49" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse">
                    <el-submenu v-for="(menu,index) in menuLists" :key="index" :index="menu.id.toString()">
                        <template slot="title">
                            <i class="el-icon-menu" v-if="menu.id!==2"> </i>
                            <span v-html="menu.name"></span>
                        </template>
                        <el-menu-item :index="child.id.toString()"  v-for="(child,index) in menu.__child" @click="setAttr(child)" :key="index">
                           <template slot="title">
                               <span v-html="child.name"></span>
                           </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container direction="vertical">
                <el-main>
                    <el-tabs type="border-card" closable  v-model="activeName" @tab-click="goto" @tab-remove="remove">
                        <el-tab-pane v-for="item in tabs" :label="item.label" :key="item.name" :name="item.name"></el-tab-pane>
                        <el-card shadow="always">
                            <router-view/>
                        </el-card>
                    </el-tabs>
                </el-main>
                <el-footer>
                    ©fl140125@gmail.com 在线人数：{{online}}
                </el-footer>
                <i class="msg-icon" @click="getMsgDialog">
                    <i :class="chatMsgClass" style="margin:13px 15px;">
                        <el-badge is-dot v-if="msg_dot" type="danger" class="msg-count"></el-badge>
                    </i>
                </i>
            </el-container>
        </el-container>
        <!---chat message-->
        <el-dialog :title="chatTitle" :center="center" :show-close="closeModel" :close-on-press-escape="closeModel" :visible.sync="chatVisible">
            <el-row :gutter="24">
                <el-col :span="6" class="user-list">
                    <el-menu background-color="#393D49" text-color="#fff" active-text-color="#ffd04b">
                        <el-menu-item @click="sendUser(user,index)" v-for="(user,index) in client_list" :key="index" :index="index">
                            <el-avatar :size="50" :src="user.client_img" style="cursor: pointer"></el-avatar>
                            <span slot="title" style="margin-left: 20px">{{user.client_name}}</span>
                        </el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :offset="1" :span="17" class="contact-list">
                    <div id="msg">
                        <div v-for="(message,index) in messageLists" :key="index" style="margin: 20px">
                            <div class="msg-img">
                                <el-avatar :size="50" :src="message.avatar_url" style="cursor: pointer"></el-avatar>
                                <span style="margin-left: 15px">{{message.from_client_name}}   {{message.time}}</span>
                            </div>
                            <div class="msg-list" v-html="message.content"></div>
                        </div>
                    </div>
                    <div class="input-msg">
                        <emotion @clickEmotion="getEmotion" v-show="showEmotion" :height="300"></emotion>
                        <div style="float: left">
                            <el-tooltip effect="dark" content="发送表情" placement="top-start">
                                <i  @click="showEmotion = !showEmotion" class="el-icon-picture-outline-round icon"></i>
                            </el-tooltip>
                            <el-upload :action="cgi.uploadUrl"
                                       :data="fileData"
                                       :headers="headers"
                                       :show-file-list="false"
                                       :on-success="uploadSuccess"
                                       :before-upload="beforeUpload" style="float: left">
                                <el-tooltip effect="dark" content="发送文件和图片" placement="top-start">
                                    <i class="el-icon-picture-outline icon"></i>
                                </el-tooltip>
                            </el-upload>
                        </div>
                        <el-input type="textarea" ref="message" id="content" @focus="showEmotion = false" v-model="inputMsg" resize="none" rows="4"></el-input>
                    </div>
                    <div class="input-button" style="text-align: right">
                        <el-button type="primary" plain size="medium" @click="sendMsg">发 送</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
        <!---chat message-->
    </el-container>
</template>

<script>
    import { mapGetters,mapActions } from 'vuex'
    import apiLists from '../../api/api'
    import $url from '../../api/url'
    import func from '../../api/func'
    import emotion from '../common/emotion/Index'
    export default {
        name: "baseModule",
        inject:['reload'],
        data(){
            return {
                isCollapse:false,
                activeName:null,
                activeIndex:'1',
                menuClass:'el-icon-s-unfold',
                asideWidth:"200px",
                asideHeight:{},
                headerStyle:{
                    'margin-left':'200px',
                },
                noticeLength:0,
                notice:[],
                online:0,

                //workerManChat
                cgi:{
                    uploadUrl:process.env.API_ROOT+$url.fileUpload
                },
                chatTitle:'ChatRoom',
                fileData:{},
                headers:{},
                chatVisible:false,
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
                avatar_url:'',
                chatMsgClass:'el-icon-chat-dot-round',
                msg_dot:false,
                room_id:'1',
            }
        },
        components:{
            emotion
        },
        computed:{
            ...mapGetters(['tabs','token','username','activeAuthName','menuLists','socketServer','avatarUrl','websocketServer']),
        },
        methods:{
            ...mapActions(['addTabs','deleteTabs','addCurrTabs','logoutSystem','getAuthMenu']),
            /**
             * TODO：设置tabs
             * @param item
             */
            setAttr:function(item){
                let params = {label:item.name,name:item.href};
                this.activeName = params.name;
                this.addCurrTabs(params);
                this.addTabs(params);
                this.asideHeight = {
                    'min-height':(window.innerHeight - 60)+'px'
                };
                this.$router.push({path:params.name});
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
                    this.websocketServer.send('{"type":"history","from_client_name":"'+this.username+'","to_client_name":"'+this.to_client_name+'"}');
                    this.msg_dot = false;
                }
            },
            /**
             * TODO：路由追加
             * @param tab
             */
            goto:function(tab){
                this.$router.push({path:tab.name});
            },
            /**
             * TODO：删除tabs
             * @param tabName
             */
            remove:function(tabName){
                this.tabs.forEach((tab, index) => {
                    if (tab.name === tabName) {
                        let nextTab = this.tabs[index + 1] || this.tabs[index - 1];
                        if (nextTab) {
                            this.deleteTabs(tabName);
                            this.activeName = nextTab.name;
                            this.$router.push({path:this.activeName});
                            this.addCurrTabs(nextTab);
                        }
                    }
                });
            },
            /**
             * TODO：用户基础设置
             * @param key
             * @param keyPath
             */
            handleSelect(key, keyPath) {
                switch (key) {
                    case '2-1':
                        let userParams = {label:'个人中心',name:'/admin/user/center'};
                        this.activeName = userParams.name;
                        this.addCurrTabs(userParams);
                        this.addTabs(userParams);
                        this.$router.push({path:userParams.name});
                        break;
                    case '2-2':
                        this.logoutSystem(this.token);
                        break;
                    default:
                        break;
                }
            },
            /**
             * TODO:站内通知读取
             * @param noticeObj
             */
            readNotice:function(noticeObj) {
                if (noticeObj === 'more') {
                    let pushParams = {label:'站内通知',name:'/admin/push/index'};
                    this.activeName = pushParams.name;
                    this.addCurrTabs(pushParams);
                    this.addTabs(pushParams);
                    this.$router.push({path:pushParams.name});
                    return false;
                }
                let params = {};
                params.see = parseInt(noticeObj.see)+1;
                params.id = noticeObj.id;
                params.type = noticeObj.type
                apiLists.PushRead(params).then()
            },
            /**
             * TODO：设置导航栏
             */
            hideMenu:function(){
                this.isCollapse =  !this.isCollapse;
                if (!this.isCollapse){
                    this.menuClass ='el-icon-s-unfold';
                    this.asideWidth = "200px";
                    this.headerStyle = {'margin-left':'200px'};
                } else {
                    this.menuClass = 'el-icon-s-fold';
                    this.asideWidth = "65px";
                    this.headerStyle = {'margin-left':'65px'};
                }
            },
            /**
             * TODO:workerMan-chat链接
             * @param ws
             */
            connect:function(ws){
                let __this = this;
                ws.onopen = function(){
                    let send_data = '{"type":"login","client_name":"'+__this.username+'","room_id":"'+__this.room_id+'","client_img":"'+__this.avatarUrl+'","uid":"'+__this.md5(__this.username)+'"}';
                    ws.send(send_data)
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
                            __this.client_list = {};
                            if(data['client_list']) {
                                __this.client_list = data['client_list'];
                            } else {
                                __this.client_list[data['client_id']] = data['client_name'];
                            }
                            break;
                      //发送消息
                        case 'say':
                            __this.say(data);
                            break;
                      //聊天记录
                        case 'history':
                            for (let i in data.message) {
                                data.message[i]['content'] = __this.setContent(data.message[i]['content'],data.message[i]['msg_type'])
                            }
                            __this.messageLists = data.message;
                            break;
                        case 'logout':
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
             * TODO:设置发送给谁
             * @param user
             * @param client_id
             */
            sendUser:function(user,client_id) {
                this.to_client_name = user.client_name;
                this.to_client_id = client_id === '0' ? 'all' : client_id;
                this.chatTitle = user.client_name === 'all' ? 'ChatRoom' : user.client_name;
                this.avatar_url = this.avatarUrl;
                //获取聊天记录
                this.websocketServer.send('{"type":"history","from_client_name":"'+this.username+'","to_client_name":"'+this.to_client_name+'"}');
            },
            /**
             * TODO:发送表情
             * @param emotion
             */
            getEmotion (emotion) {
                this.msg_type = 'icon';
                this.websocketServer.send('{"type":"say","to_client_id":"'+this.to_client_id+'","to_client_name":"'+this.to_client_name+'","msg_type":"'+this.msg_type+'","content":"'+emotion.icon+'","avatar_url":"'+this.avatar_url+'"}');
            },
            /**
             * TODO:设置文本内容
             */
            setContent:function(content,msg_type){
                let msg='';
                switch (msg_type) {
                    case 'icon': msg = '<img src="'+content+'" alt=""/>';break;
                    case 'text': msg = content;break;
                    case 'img' : msg = '<img src="'+content+'" width="100px" height="100px" alt=""/>';break;
                }
                return msg;
            },
            /**
             * TODO：图片上传成功
             * @param response
             */
            uploadSuccess:function(response){
                if (response && response.code === 200){
                    this.msg_type = 'img';
                    this.websocketServer.send('{"type":"say","to_client_id":"'+this.to_client_id+'","to_client_name":"'+this.to_client_name+'","msg_type":"'+this.msg_type+'","content":"'+response.item.src+'","avatar_url":"'+this.avatar_url+'"}');
                    return ;
                }
                this.$message({type:'warning',message:response.msg});
            },
            /**
             * TODO：图片上传前
             * @param file
             */
            beforeUpload:function(file){
                let typeArr = ['image/jpg','image/gif','image/png','image/jpeg'];
                if (!typeArr.includes(file.type)){
                    this.$message({type:'warning',message:'upload image format error'});
                    return false;
                }
                if (file.size>2*1024*1024){
                    this.$message({type:'warning',message:'upload image size error'});
                    return false;
                }
                return true;
            },
            /**
             * TODO:发送消息
             * @param data from_client_id from_client_name content time msg_type to_client_name to_client_id
             */
            say:function(data){
                let content = this.setContent(data['content'],data['msg_type']);
                let msg = {
                    "from_client_name":data['from_client_name'],
                    "time":data['time'],
                    "content":content,
                    "msg_type":data['msg_type'],
                    "avatar_url":data['avatar_url']
                };
                this.websocketServer.send('{"type":"history","from_client_name":"'+data['from_client_name']+'","to_client_name":"'+data['to_client_name']+'"}');
                this.messageLists.push(msg);
                if (this.username!==data['from_client_name']){
                    if (data['to_client_id']!=='all') {
                        this.chatTitle = data['from_client_name'];
                        this.to_client_id = data['from_client_id'];
                    }
                    this.msg_dot = true;
                }
                if (this.chatVisible && this.username===data['from_client_name']) {
                    if (data['to_client_id']!=='all') {
                        this.chatTitle = data['to_client_name'];
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
                if (this.inputMsg !== '') {
                    this.websocketServer.send('{"type":"say","to_client_id":"'+this.to_client_id+'","to_client_name":"'+this.to_client_name+'","msg_type":"'+this.msg_type+'","content":"'+this.inputMsg+'","avatar_url":"'+this.avatar_url+'"}');
                    this.inputMsg = '';
                    return ;
                }
                if (this.chatVisible) {
                    this.$refs.message.focus();
                    this.$message({type:'info',message:'Please enter message'})
                }
            },
            /**
             * TODO：站内消息推送
             */
            webPush:function () {
                //站内消息推送
                this.socketServer.on('connect', ()=>{
                    // 连接后登录
                    this.socketServer.emit('login', this.md5(this.username));
                });
                // 服务端（http）推送站内通知信息
                this.socketServer.on('new_msg', (msg)=>{
                    this.$notify({ title: '站内通知', message: msg, position: 'top-right', type:'success', duration:0 });
                });
                //用户站内通知
                this.socketServer.on('notice',(response)=>{
                    let j = 1;
                    this.noticeLength = 0;
                    for (let i in response) {
                        response[i].disabled = true
                        if (response[i].status !== 'successfully' && response[i].see === 0) {
                            response[i].disabled = false
                            this.noticeLength = j++;
                        }
                    }
                    this.notice = response;
                });
                //在线人数
                this.socketServer.on('online',(response)=>{
                    this.online = response;
                });
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
                    }
                })
            }
        },
        created(){
            this.activeName = this.activeAuthName;
            this.asideHeight = {
                'min-height':(window.innerHeight - 60)+'px'
            };
            //图片上传参数
            this.avatar_url = this.avatarUrl;
            this.fileData.token = this.token;
            this.fileData.rand = true;
            this.headers.Authorization = `${func.set_password(func.set_random(32),func.set_random(12))}${this.token}${func.set_password(func.set_random(32),func.set_random(12))}`
            //客服系统初始化
            this.connect(this.websocketServer);
            let __this = this;
            //键盘事件
            document.onkeydown = function (e) {
                if (e.code === 'Enter') {
                    e.preventDefault();
                    __this.sendMsg();
                    return false;
                }
            }
        },
        mounted() {
            this.$nextTick(function () {
                let params = {label:this.$route.meta.title,name:this.$route.path};
                this.activeName = params.name;
                this.addCurrTabs(params);
                this.addTabs(params)
                this.getAuthMenu();
                this.webPush();
            });
        }
    }
</script>
<style scoped>
    .el-header {
        background-color: #393d49;
        color: #333;
        text-align: center;
        line-height: 60px;
    }
    .el-footer {
        background-color: #cccccc;
        color: #333;
        text-align: center;
        line-height: 60px;
        /*固定底部布局*/
        position: fixed;
        width: 100%;
        height: 100%;
        bottom: 0;
        z-index:2
    }
    .el-aside {
        background-color: #393d49;
        color: #333;
        line-height: 200px;
    }
    .el-main{
        margin-bottom: 60px;
    }
    .user-list{
        box-shadow: 0 2px 12px #ffffff, 0 0 6px #F5F5F5;
        min-height:600px;
        background-color:#393D49;
        border-radius:10px;
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
        max-height: 600px;
        overflow: hidden;
        overflow-y: auto;
        padding: 0 !important;
    }
    .contact-list{
        box-shadow: 0 2px 12px #ffffff, 0 1px 6px #545c64;
        min-height:600px;
        border: 1px solid #F5F5F5;
        border-radius:10px;
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
    }
    #msg{
        max-height: 380px;
        min-height: 380px;
        margin-bottom: 20px;
        margin-top: 10px;
        overflow: hidden;
        overflow-y: auto;
        border: 1px solid #eee;
        border-radius: 10px;
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
        background-color: rgb(255,255,255);
    }
    #msg .msg-list{
        box-shadow: 0 2px 12px #ffffff, 0 1px 6px #505860;
        line-height: 28px;
        min-height: 20px;
        font-family: "Source Code Pro", monospace;
        font-size: 14px;
        padding:15px;
        margin-bottom: 15px;
        border-radius: 10px;
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
        background:-webkit-gradient(linear, left top, left bottom, from(#cccccc), to(#ffffff));
        　background:-moz-linear-gradient(top, #cccccc, #ffffff);
        　　　　background:-o-linear-gradient(top, #cccccc, #ffffff);
        　　　　background:linear-gradient(top, #cccccc, #ffffff);
        position:relative;
    }
    #msg .msg-list:after {
        content: '';
        width: 10px;
        height: 10px;
        position: absolute;
        top: -5px;
        right: 552px;
        transform: rotate(45deg);
        background-color: #cccccc;
        border: 1px #cccccc;
        border-style: none none solid solid ;
    }
    #msg .msg-img{
        margin-bottom: 15px;
    }
    #msg .history{
        text-align: center;
        margin-top: 20px;
        cursor: pointer
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
