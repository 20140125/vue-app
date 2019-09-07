<template>
    <el-container>
        <el-header>
            <el-menu :default-active="activeIndex"
                     mode="horizontal"
                     background-color="#393d49"
                     text-color="#fff"
                     @select="handleSelect"
                     active-text-color="#ffd04b" :style="headerStyle">
                <el-menu-item index="1" @click="hideMenu"> <i :class="menuClass"></i></el-menu-item>
                <el-submenu index="2" style="float: right">
                    <template slot="title" v-if="noticeLength"><el-badge is-dot type="success">{{username}}</el-badge></template>
                    <template slot="title" v-else>{{username}}</template>
                    <el-menu-item index="2-1">账号资料</el-menu-item>
                    <el-menu-item index="2-2">基础设置</el-menu-item>
                    <el-menu-item index="2-3" v-if="noticeLength">
                        <el-badge :max="10" :value="noticeLength" type="success">站内通知</el-badge>
                    </el-menu-item>
                    <el-menu-item index="2-3" v-else>站内通知</el-menu-item>
                    <el-menu-item index="2-4">退出系统</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-header>
        <el-container>
            <el-aside :width="asideWidth" :style="asideHeight">
                <el-menu unique-opened background-color="#393d49" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse">
                    <el-submenu v-for="(menu,index) in menuLists" :key="index" :index="menu.id.toString()">
                        <template slot="title">
                            <i class="el-icon-menu" v-if="menu.id!==2"> </i>
                            <span v-html="menu.name"></span>
                        </template>
                        <el-menu-item :index="child.id.toString()"  v-for="(child,index) in menu.__child" @click="setAttr(child)" :key="index">
                            <router-link :to="child.href" v-html="child.name" style="color: #fff;"></router-link>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container>
                <el-main>
                    <el-tabs type="border-card" closable  v-model="activeName" @tab-click="goto" @tab-remove="remove" style="text-align: left!important;" v-show="contentVisible">
                        <el-tab-pane v-for="item in tabs" :label="item.label" :key="item.name" :name="item.name"></el-tab-pane>
                        <el-card shadow="always">
                            <router-view/>
                        </el-card>
                    </el-tabs>
                </el-main>
                <el-footer>
                    ©fl140125@gmail.com 在线人数：{{online}}
                    <i class="msg-icon" @click="getMsgDialog">
                        <i :class="chatMsgClass" style="margin-top: 12px">
                            <el-badge is-dot v-if="msg_dot" type="danger" class="msg-count"></el-badge>
                        </i>
                    </i>
                </el-footer>
                <!---chat message-->
                <el-dialog :title="chatTitle"
                           :center="center"
                           :show-close="closeModel"
                           :close-on-click-modal="closeModel"
                           :visible.sync="chatVisible">
                    <el-row :gutter="24">
                        <el-col :span="6" class="user-list">
                            <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                                <el-menu-item @click="sendUser(user,index)" v-for="(user,index) in client_list" :key="index" :index="index">
                                    <el-avatar :size="50" :src="user.client_img"></el-avatar>
                                    <span slot="title" style="margin-left: 20px">{{user.client_name}}</span>
                                </el-menu-item>
                            </el-menu>
                        </el-col>
                        <el-col :offset="1" :span="17" class="contact-list">
                            <div id="msg">
                                <div style="margin: 20px">
                                    <div v-for="(message,index) in messageLists" :key="index">
                                        <div class="msg-img">
                                            <el-avatar :size="50" :src="message.avatar_url"></el-avatar>
                                            <span>{{message.from_client_name}}   {{message.time}}</span>
                                        </div>
                                        <div class="msg-list" v-html="message.content"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="input-msg">
                                <emotion @emotion="getEmotion" v-show="showEmotion" :height="200"></emotion>
                                <div style="float: left">
                                    <i style="font-size: 25px;margin-bottom: 10px;color: #000"  @click="showEmotion = !showEmotion" class="el-icon-picture-outline-round"></i>
                                    <el-upload :action="cgi.uploadUrl"
                                               :data="fileData"
                                               :headers="headers"
                                               :show-file-list="false"
                                               :on-success="uploadSuccess"
                                               :before-upload="beforeUpload" style="float: left">
                                        <i style="font-size: 25px;margin:0 10px;color: #000"  class="el-icon-picture"></i>
                                    </el-upload>
                                </div>
                                <el-input type="textarea" @focus="showEmotion = false" v-model="inputMsg" resize="none" rows="4"></el-input>
                            </div>
                            <div class="input-button" style="text-align: right">
                                <el-button type="primary" plain size="medium" @click="sendMsg">发 送</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-dialog>
                <!---chat message-->

                <!---notice message-->
                <el-dialog :visible.sync="noticeVisible" :title="title" :center="center">
                    <el-alert v-for="(item,index) in notice" :key="index" type="success" :description="item.info" show-icon
                              @close="readNotice(item)"
                              close-text="Close"
                              style="margin-bottom: 20px">
                    </el-alert>
                </el-dialog>
                <!---notice message-->
            </el-container>
        </el-container>
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
        data(){
            return {
                isCollapse:false,
                activeName:null,
                activeIndex:'1',
                menuClass:'el-icon-s-unfold',
                asideWidth:"200px",
                asideHeight:{
                    'min-height':(window.innerHeight - 60)+'px'
                },
                headerStyle:{
                    'margin-left':'200px',
                },
                noticeLength:0,
                notice:[],
                noticeVisible:false,
                title:'站内通知',
                center:true,
                online:0,

                //workerManChat
                cgi:{
                    uploadUrl:process.env.API_ROOT+$url.fileUpload
                },
                bgStyle:{
                    'background':'url('+require('../../assets/u0.jpg')+')',
                    'background-repeat':'no-repeat',
                },
                chatTitle:'ChatRoom',
                fileData:{},
                headers:{},
                chatVisible:false,
                client_list:{},
                inputMsg:'',
                content:'',
                showEmotion:false,
                closeModel:false,
                messageLists:[],
                msg_type:'text',
                to_client_name:'',
                to_client_id:'all',
                avatar_url:'',
                chatMsgClass:'el-icon-chat-dot-round',
                msg_dot:false,
                emotionLists:['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极']
            }
        },
        components:{
            emotion
        },
        computed:{
            ...mapGetters(['tabs','token','username','activeAuthName','contentVisible','menuLists','socketServer','avatarUrl','websocketServer']),
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
                    case '2-3':
                        this.noticeVisible = true;
                        break;
                    case '2-4':
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
                let params = {};
                params.see = parseInt(noticeObj.see)+1;
                params.id = noticeObj.id;
                apiLists.PushRead(params).then(response=>{
                    if (response && response.data.code === 200) {
                        this.$message({type:'success',message:response.data.msg});
                    }
                })
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
                    let send_data = '{"type":"login","client_name":"'+__this.username+'","room_id":1,"client_img":"'+__this.avatarUrl+'","uid":"'+__this.md5(__this.username)+'"}';
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
                        case 'msgLists':
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
                this.to_client_id = client_id;
                this.chatTitle = user.client_name;
                this.avatar_url = this.avatarUrl;
                //获取聊天记录
                let __this = this;
                this.websocketServer.send('{"type":"msgLists","from_client_name":"'+__this.username+'","to_client_name":"'+this.to_client_name+'"}');
            },
            /**
             * TODO:获取表情
             * @param i
             */
            getEmotion (i) {
                // 将匹配结果替换表情图片
                let word = i.replace(/\#|\;/gi,'');
                this.msg_type = 'icon';
                this.inputMsg+= `,[${word}],`
            },
            /**
             * TODO:设置文本内容
             */
            setContent:function(content,msg_type){
                let __this = this,msg='';
                switch (msg_type) {
                    case 'icon':
                        let inputMsg = content.split(',');
                        for (let i in inputMsg) {
                            if (inputMsg[i]!=='' && (inputMsg[i].indexOf('[')>=0 && inputMsg[i].indexOf(']')>=0)) {
                                let index = __this.emotionLists.indexOf(inputMsg[i].replace('[','').replace(']',''));
                                msg+= `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" alt="${inputMsg[i]}">`
                            } else {
                                msg+=inputMsg[i];
                            }
                        }
                        break;
                    case 'text':
                        msg = content;
                        break;
                    case 'img':
                        msg = '<img src="'+content+'" width="100px" height="100px" alt=""/>';
                        break;
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
                let type = file.type;
                let typeArr = ['image/jpg','image/gif','image/png','image/jpeg'];
                if (!typeArr.includes(type)){
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
                this.messageLists.push(msg);
                if (this.username!==data['from_client_name']){
                    if (data['to_client_id']!=='all') {
                        this.chatTitle = data['from_client_name'];
                        this.to_client_id = data['from_client_id'];
                    }
                    this.to_client_id = 'all';
                    this.msg_dot = true;
                }
                if (this.chatVisible && this.username===data['from_client_name']) {
                    if (data['to_client_id']!=='all') {
                        this.chatTitle = data['to_client_name'];
                        this.to_client_id = data['to_client_id'];
                    }
                    this.to_client_id = 'all';
                    this.scrollToBottom();
                }
            },
            /**
             * TODO:消息发送
             */
            sendMsg:function(){
                this.showEmotion = false;
                this.websocketServer.send('{"type":"say","to_client_id":"'+this.to_client_id+'","to_client_name":"'+this.to_client_name+'","msg_type":"'+this.msg_type+'","content":"'+this.inputMsg+'","avatar_url":"'+this.avatar_url+'"}');
                this.inputMsg = '';
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
                    this.$notify({ title: '系统通知', message: msg, position: 'top-right', type:'success', duration:0 });
                });
                //用户站内通知
                this.socketServer.on('notice',(response)=>{
                    this.noticeLength = response.length;
                    this.notice = response;
                });
                //在线人数
                this.socketServer.on('online',(response)=>{
                    this.online = response;
                });
            },
            scrollToBottom: function () {
                this.$nextTick(() => {
                    let div = document.getElementById('msg');
                    div.scrollTop = div.scrollHeight
                })
            },
        },
        created(){
            this.activeName = this.activeAuthName;
            this.asideHeight = {
                'min-height':(window.innerHeight - 76)+'px'
            };
            this.avatar_url = this.avatarUrl;
            this.fileData.token = this.token;
            this.fileData.rand = true;
            this.headers.Authorization = `${func.set_password(func.set_random(32),func.set_random(12))}-${this.token}-${func.set_password(func.set_random(32),func.set_random(12))}`
            this.connect(this.websocketServer);
        },
        mounted() {
            this.$nextTick(function () {
                this.getAuthMenu(this.username);
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
    }
    .el-aside {
        background-color: #393d49;
        color: #333;
        line-height: 200px;
    }
    .user-list{
        box-shadow: 0 2px 4px #2b2f01, 0 0 6px #545c64;
        min-height:600px;
        background-color:#545c64;
        max-height: 600px;
        overflow: hidden;
        overflow-y: auto;
        padding: 0 !important;
    }
    .contact-list{
        box-shadow: 0 2px 12px 0 #545c64;
        min-height:600px;
    }
    #msg{
        max-height: 380px;
        min-height: 380px;
        margin-bottom: 20px;
        margin-top: 10px;
        overflow: hidden;
        overflow-y: auto;
        border: 2px solid #eee;
        border-radius: 10px;
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
        box-shadow: 0 2px 4px #ffffff, 0 0 6px #545c64;
    }
    #msg .msg-list{
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        line-height: 28px;
        min-height: 20px;
        padding:12px 15px;
        margin-bottom: 15px;
        border-radius: 15px;
        -moz-border-radius:15px;
        -webkit-border-radius:15px;
        background:-webkit-gradient(linear, left top, left bottom, from(#F7BC0A), to(#f9db1e));
        　background:-moz-linear-gradient(top, #F7BC0A, #f9db1e);
        　　　　background:-o-linear-gradient(top, #F7BC0A, #f9db1e);
        　　　　background:linear-gradient(top, #F7BC0A, #f9db1e);
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
        background-color: #F7BC0A;
        border: 1px #F7BC0A;
        border-style: none none solid solid ;
    }
    .input-msg{
        min-height: 100px;
        margin-bottom: 10px;
    }
    .msg-img{
        margin-bottom: 15px;
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
    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
        width:10px;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar-track {
        -webkit-box-shadow:inset 0 0 6px rgba(255,0,0,0.4);
        border-radius:10px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius:10px;
        background:rgba(0,0,0,0.1);
        -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.5);
    }
    ::-webkit-scrollbar-thumb:window-inactive {
        background:rgba(255,0,0,0.4);
    }

</style>
