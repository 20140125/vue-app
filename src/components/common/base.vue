<template>
    <el-container>
        <!--header-->
        <el-header id="header">
            <el-menu :default-active="activeIndex" mode="horizontal" background-color="#393d49" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" :style="headerStyle">
                <el-menu-item index="1" @click="hideMenu"> <i :class="menuClass" style="color: #fff;font-size: 25px"> </i></el-menu-item>
                <el-menu-item index="5"><template slot="title"><i class="el-icon-location"></i>{{userInfo.city}}</template></el-menu-item>
                <el-submenu index="2" style="float: right">
                    <template slot="title">
                        <el-avatar :src="userInfo.avatar_url" :alt="userInfo.username" :size="35"/>
                        <span v-html="userInfo.username" style="margin-left: 10px"/>
                    </template>
                    <el-menu-item index="2-1"><i class="el-icon-user-solid"> </i> 个人中心</el-menu-item>
                    <el-menu-item index="2-2"><i class="el-icon-upload2"> </i> 退出系统</el-menu-item>
                </el-submenu>
                <el-menu-item index="3" style="float: right">
                    <el-dropdown trigger="hover" @command="readNotice" :hide-on-click="false" :show-timeout="100">
                        <i class="el-icon-message-solid" style="color: #fff;font-size: 22px"> </i>
                        <el-badge :value="noticeLength" style="margin-top: -30px;margin-left: -18px" v-if="noticeLength"/>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item style="text-align: center;color: #66b1ff">站内通知</el-dropdown-item>
                            <el-dropdown-item :command="item" divided v-for="(item,index) in notice" :key="index" :disabled="item.disabled">
                                <el-badge is-dot v-if="!item.disabled"/>【{{item.title}}】 {{item.info}}
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
        <!--container-->
        <el-container>
            <el-aside :width="asideWidth" :style="asideHeight">
                <el-menu unique-opened  background-color="#393d49" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse">
                    <el-submenu v-for="(menu,index) in menuLists" :key="index" :index="menu.id.toString()">
                        <template slot="title">
                            <i class="el-icon-menu" v-if="menu.id!==2"> </i>
                            <span v-html="menu.name"/>
                        </template>
                        <el-menu-item :index="child.id.toString()"  v-for="(child,index) in menu.__child" @click="setAttr(child)" :key="index">
                            <template slot="title">
                                <i class="el-icon-s-home"> </i>
                                <span v-html="child.name"/>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container direction="vertical">
                <el-main :style="mainStyle">
                    <el-carousel :interval="2000" arrow="never" height="65px" direction="vertical" indicator-position="none" v-if="noticeArr.length>0">
                        <el-carousel-item v-for="(item,index) in noticeArr" :key="index">
                            <el-alert type="success" show-icon :title="item.message" effect="light"
                                      @close="closeNotice(item)"/>
                        </el-carousel-item>
                    </el-carousel>
                    <el-tabs type="border-card" closable lazy v-model="activeName" @tab-click="goto" @tab-remove="remove">
                        <el-tab-pane v-for="item in tabs" :label="item.label" :key="item.name" :name="item.name"/>
                        <el-card shadow="always">
                            <router-view/>
                        </el-card>
                    </el-tabs>
                </el-main>
                <el-footer>
                    <el-link href="mailto:fl140125@gmail.com">fl140125@gmail.com</el-link>
                </el-footer>
                <i class="msg-icon" @click="getMsgDialog">
                    <i :class="chatMsgClass" style="margin:13px 15px;">
                        <el-badge :value="chat.msgCount" v-if="chat.msgCount" type="danger" class="msg-count"/>
                        <el-badge v-if="msg_dot" is-dot type="danger" class="msg-count"/>
                    </i>
                </i>
            </el-container>
        </el-container>
        <!---chat message-->
        <el-dialog :title="chat.chatTitle" @close="chatVisible = false" top="5vh" width="60%"
                   :center="center" :show-close="closeModel"
                   :close-on-press-escape="closeModel" :visible.sync="chatVisible">
            <el-row :gutter="24">
                <el-col :span="6" class="user-list">
                    <div class="aside">
                        <el-menu background-color="#393d49" text-color="#fff" active-text-color="#ffd04b">
                            <el-menu-item @click="sendUser(user,index)" v-for="(user,index) in chat.client_list" :key="index" :index="index.toString()">
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
                <el-col :span="18">
                    <el-card shadow="always">
                        <div id="msg">
                            <div v-for="(message,index) in chat.messageLists" :key="index">
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
                                    <el-menu :default-active="chat.room_id" mode="horizontal" style="margin-bottom: 10px;border: none">
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
        <el-dialog :visible.sync="showCity" title="选择城市" center>
            <city @saveCityNode="saveCityNode"></city>
        </el-dialog>
    </el-container>
</template>

<script>
    import { mapGetters,mapActions } from 'vuex'
    import apiLists from '../../api/api'
    import $url from '../../api/url'
    import func from '../../api/func'
    import emotion from '../common/emotion/Index'
    import City from "./city/city";
    export default {
        name: "baseModule",
        inject:['reload'],
        data(){
            return {
                isCollapse:false,
                activeName:null,
                showCity:false,
                activeIndex:'1',
                menuClass:'el-icon-s-unfold',
                asideWidth:"200px",
                asideHeight:{},
                headerStyle:{'margin-left':'200px'},
                noticeLength:0,
                notice:[],
                online:0,
                //workerManChat
                cgi:{uploadUrl:process.env.API_ROOT+$url.fileUpload.replace('/','')},
                fileData:{},
                headers:{},
                chatVisible:false,
                inputMsg:'',
                emotionLists:[],
                showEmotion:false,
                closeModel:false,
                center:true,
                chat:{},
                chatMsgClass:'el-icon-chat-dot-round',
                noticeArr:[],
                mainStyle:{margin:'60px 0 60px 200px'},
                msg_dot:false
            }
        },
        components:{
            City,
            emotion
        },
        computed:{
            ...mapGetters(['tabs','activeAuthName','menuLists','oauthConfig','userInfo','weather']),
        },
        methods:{
            ...mapActions(['addTabs','deleteTabs','addCurrTabs','logoutSystem','getAuthMenu','getOauthConfig','saveWeather','saveUserInfo']),
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
                apiLists.PushRead(params)
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
                    this. mainStyle = {margin:'60px 0 60px 200px'}
                } else {
                    this.menuClass = 'el-icon-s-fold';
                    this.asideWidth = "65px";
                    this.headerStyle = {'margin-left':'65px'};
                    this. mainStyle = {margin:'60px 0 60px 60px'}
                }
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
                        from_client_id:__this.userInfo.uuid,
                        client_name:__this.userInfo.username,
                        room_id:__this.chat.room_id,
                        client_img:__this.userInfo.avatar_url,
                        uid:__this.userInfo.uuid,
                        adcode:__this.userInfo.adcode
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
                            __this.saveWeather(data.weather);
                            __this.chat.client_list = data.client_list;
                            __this.setUsersLists();
                            console.log(data);
                            break;
                        //发送消息
                        case 'say':
                            __this.say(data);
                            console.log(data);
                            break;
                        //聊天记录
                        case 'history':
                            __this.chat.messageLists = data.message;
                            if (data.client_list.length>0) {
                                __this.chat.client_list = data.client_list;
                                __this.setUsersLists();
                            }
                            console.log(data);
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
             * todo:设置未读消息数
             */
            setUsersLists:function () {
                //展示单个用户未读消息数
                let unreadMessage = [];
                for (let i in this.chat.client_list) {
                    if (this.userInfo.username === this.chat.client_list[i]['client_name']) {
                        unreadMessage = this.chat.client_list[i]['unread'];
                        this.chat.msgCount = this.chat.client_list[i]['unreadCount']
                    }
                }
                if (unreadMessage.length>0) {
                    for (let i in unreadMessage) {
                        for (let j in this.chat.client_list) {
                            if (unreadMessage[i]['form'] === j) {
                                this.chat.client_list[j]['total'] = parseInt(unreadMessage[i]['total']);
                            }
                        }
                    }
                }
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
                        from_client_id:this.chat.from_client_id,
                        to_client_name:this.chat.to_client_name,
                        to_client_id:this.chat.to_client_id,
                        room_id:this.chat.to_client_name === 'all' ? this.chat.room_id : '',
                        uid:this.userInfo.uuid,
                        source:'dialog',
                    };
                    this.chat.msgCount = 0;
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
                if (this.chat.room_id !== room.id.toString()) {
                    this.showEmotion = false;
                    this.chat.room_id = room.id.toString();
                    this.chat.chatTitle = room.value;
                    //加入房间
                    let login = {
                        type:'login',
                        from_client_id:this.userInfo.uuid,
                        client_name:this.userInfo.username,
                        room_id:this.chat.room_id,
                        client_img:this.userInfo.avatar_url,
                        uid:this.userInfo.uuid,
                        adcode:this.userInfo.adcode
                    };
                    this.userInfo.websocketServer.send(JSON.stringify(login))
                }
                //群聊时，接收方为所有用户
                this.chat.to_client_id = 'all';
                this.chat.to_client_name = 'all'
                //获取聊天记录
                let str = {
                    type:'history',
                    from_client_name:this.userInfo.username,
                    from_client_id:this.chat.from_client_id,
                    to_client_name:this.chat.to_client_name,
                    to_client_id:this.chat.to_client_id,
                    room_id:this.chat.to_client_name === 'all' ? this.chat.room_id : '',
                    uid:this.userInfo.uuid,
                    source:'room',
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
                this.chat.to_client_name = user.client_name;
                this.chat.to_client_id = client_id === '0' ? 'all' : client_id;
                this.chat.from_client_id = user.uid;
                this.chat.uid = this.chat.to_client_id;
                this.chat.chatTitle = user.client_name;
                this.chat.room_id = '';
                //获取聊天记录
                let str = {
                    type:'history',
                    from_client_name:this.userInfo.username,
                    from_client_id:this.userInfo.uuid,
                    to_client_name:this.chat.to_client_name,
                    to_client_id:this.chat.to_client_id,
                    room_id:this.chat.to_client_name === 'all' ? this.chat.room_id : '',
                    uid:this.userInfo.uuid,
                    source:'user',
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
            getEmotion:function (emotion) {
                this.chat.msg_type = 'text';
                this.inputMsg+= "<img src='"+emotion.icon+"' width='50px' height='50px' alt='"+emotion.emoji+"' title='"+emotion.title+"'>"
                this.$refs.message.innerHTML = this.inputMsg;
            },
            /**
             * TODO：图片上传成功
             * @param response
             */
            uploadSuccess:function(response){
                if (response && response.code === 200){
                    switch (this.chat.msg_type) {
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
                        this.chat.msg_type = 'img';
                        if (file.size>2*1024*1024){
                            this.$message({type:'warning',message:'upload image size error'});
                        }
                        break;
                    case 'mp4':
                        this.chat.msg_type = 'video';
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
             * @param data
             */
            say:function(data){
                this.chat.messageLists.push(data);
                this.scrollToBottom();
                if (this.userInfo.username!==data['from_client_name']){
                    if (data['to_client_id']!=='all') {
                        this.chat.chatTitle = data['from_client_name'];
                        this.chat.to_client_name = data['from_client_name'];
                        this.chat.to_client_id = data['from_client_id'];
                    }
                    if (!this.chatVisible) {
                        this.msg_dot = true;
                    }
                }
                if (this.chatVisible && this.userInfo.username===data['from_client_name']) {
                    if (data['to_client_id']!=='all') {
                        this.chat.chatTitle = data['to_client_name'];
                        this.chat.to_client_name = data['to_client_name'];
                        this.chat.to_client_id = data['to_client_id'];
                    }
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
                        to_client_id:this.chat.to_client_id,
                        to_client_name:this.chat.to_client_name,
                        from_client_name:this.userInfo.username,
                        from_client_id:this.userInfo.uuid,
                        msg_type:this.chat.msg_type,
                        content:this.inputMsg,
                        avatar_url:this.userInfo.avatar_url,
                        room_id:this.chat.to_client_name === 'all' ? this.chat.room_id : '',
                        uid:this.chat.uid,
                        time:func.set_time(func.get_timestamp()*1000)
                    };
                    this.userInfo.websocketServer.send(JSON.stringify(str));
                    this.chat.messageLists.push(str);
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
             * TODO：站内消息推送
             */
            webPush:function () {
                //站内消息推送
                this.userInfo.socketServer.on('connect', ()=>{
                    // 连接后登录
                    this.userInfo.socketServer.emit('login', this.userInfo.uuid);
                });
                // 服务端（http）推送站内通知信息
                this.userInfo.socketServer.on('new_msg', (msg)=>{
                    this.noticeArr.push({time:func.get_timestamp(),message:msg})
                });
                //用户站内通知
                this.userInfo.socketServer.on('notice',(response)=>{
                    let j = 1;
                    this.noticeLength = 0;
                    for (let i in response) {
                        response[i].disabled = true;
                        if (response[i].status !== 'successfully' && response[i].see === 0) {
                            response[i].disabled = false
                            this.noticeLength = j++;
                        }
                    }
                    this.notice = response;
                });
                //在线人数
                this.userInfo.socketServer.on('online',(response)=>{
                    this.online = response;
                });
            },
            /**
             * TODO:移除通知
             * @param item
             */
            closeNotice:function(item){
                for (let i in this.noticeArr) {
                    if (this.noticeArr[i].time === item.time) {
                        this.noticeArr.splice(i,1);
                    }
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
            },
            /**
             * todo:保存城市天气
             * @param node
             */
            saveCityNode:function (node) {
                if (node.length === 1) {
                    let weather = {info:JSON.parse(node[0]['data']['info']),forecast:JSON.parse(node[0]['data']['info'])};
                    apiLists.GetCityName({adcode:node[0]['data']['code']}).then(response=> {
                        if (response && response.data.code === 200) {
                            this.userInfo.city = response.data.item.city;
                            this.saveUserInfo(this.userInfo);
                            this.noticeArr = [];
                            this.saveWeather(JSON.stringify(weather))
                        }
                    })
                }
            }
        },
        /**
         * TODO:Vue生命周期
         */
        created(){
            //初始化聊天系统参数
            this.chat = {
                to_client_name:'all',
                to_client_id:'all',
                from_client_id: this.userInfo.uuid,
                from_client_name:this.userInfo.username,
                uid:this.userInfo.uuid,
                room_id:'1200',
                msgCount:0,
                client_list:[],
                chatTitle:'隨心所欲,隨性而行',
                messageLists:[],
                msg_type:'text',
            };
            //客服系统初始化
            this.connect(this.userInfo.websocketServer);

            this.activeName = this.activeAuthName;
            this.asideHeight = {
                'min-height':(window.innerHeight - 60)+'px'
            };
            //图片上传参数
            this.fileData.token = this.userInfo.token;
            this.fileData.rand = false;
            this.headers.Authorization = `${func.set_password(func.set_random(32),func.set_random(12))}${this.userInfo.token}${func.set_password(func.set_random(32),func.set_random(12))}`
            //键盘事件
            let __this = this;
            document.onkeydown = function (e) {
                if (e.code === 'Enter' && e.shiftKey) {
                    e.preventDefault();
                    __this.sendMsg();
                    return false;
                }
            }
        },
        /**
         * TODO:Vue生命周期
         */
        watch:{
            chatVisible:function () {
                if (!this.chatVisible) {
                    this.chatMsgClass = 'el-icon-chat-dot-round';
                }
            },
            inputMsg:function () {
                this.inputMsg = this.$refs.message.innerHTML;
            },
            weather:function () {
                if (this.weather) {
                    this.noticeArr.push({time:func.get_timestamp(),message:this.weather['info'] ? JSON.stringify(this.weather['info']) : 'Welcome'})
                }
            },
        },
        /**
         * TODO:Vue生命周期
         */
        mounted() {
            this.$nextTick(function () {
                let params = {label:this.$route.meta.title,name:this.$route.path};
                if (params.label !== '欢迎页' || func.str_count(params.name,'/') !== 3) {
                    this.activeName = params.name;
                    this.addCurrTabs(params);
                    this.addTabs(params);
                }
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
        height: 64px;
        position: fixed;
        width: 100%;
        z-index: 4
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
        position: fixed;
        z-index: 3;
        margin-top: 60px;
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
