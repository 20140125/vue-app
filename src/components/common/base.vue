<template>
    <el-container>
        <!--header-->
        <el-header id="header">
            <el-menu :default-active="activeIndex" mode="horizontal" background-color="#393d49" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" :style="headerStyle">
                <el-menu-item index="1" @click="hideMenu"><i :class="menuClass" style="color: #fff;font-size: 25px"/></el-menu-item>
                <el-menu-item index="5" @click="showCity = !showCity"><template slot="title"><i class="el-icon-location"/>{{userInfo.city}}</template></el-menu-item>
                <el-submenu index="2" style="float: right">
                    <template slot="title">
                        <el-avatar :src="userInfo.avatar_url" :alt="userInfo.username" :size="35"/>
                        <span v-html="userInfo.username" style="margin-left: 10px"></span>
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
                        <el-tab-pane v-for="item in tabs" :tab="item" :label="item.label" :key="item.name" :name="item.name"/>
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
                    </i>
                </i>
            </el-container>
        </el-container>
        <!---chatRoom Start-->
        <chat-room :chat-visible="chatVisible" :dialog-width="dialogWidth" @setMsgCount="setMsgCount"/>
        <!---chatRoom End-->
        <el-dialog :visible.sync="showCity" :width="dialogWidth" :title="'【'+userInfo.city+'】天气预告'" center>
            <VueJson :json-data="weather.forecast"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import { mapGetters,mapActions} from 'vuex'
    import apiLists from '../../api/api'
    import func from '../../api/func'
    import VueJson from "./jsonView/json";
    import chatRoom from "../chat-room/Main";
    export default {
        name: "baseModule",
        data(){
            return {
                isCollapse:false,
                activeName:'/admin/index',
                showCity:false,
                chatVisible:false,
                activeIndex:'1',
                menuClass:'el-icon-s-unfold',
                asideWidth:"200px",
                asideHeight:{},
                headerStyle:{'margin-left':'200px'},
                noticeLength:0,
                notice:[],
                online:0,
                chat:{},
                chatMsgClass:'el-icon-chat-dot-round',
                noticeArr:[],
                mainStyle:{margin:'60px 0 60px 200px'},
                innerWidth:window.innerWidth,
                chatDialogWidth:'65%'
            }
        },
        components:{
            VueJson,
            chatRoom
        },
        computed:{
            ...mapGetters(['tabs','menuLists','userInfo','weather','dialogWidth','currTabs']),
        },
        methods:{
            ...mapActions(['addTabs','deleteTabs','addCurrTabs','logoutSystem','getAuthMenu','addDialogWidth']),
            /**
             * todo:设置未读消息数
             * @param msgCount
             */
            setMsgCount:function (msgCount) {
                this.chat.msgCount = msgCount;
            },
            /**
             * TODO：设置tabs
             * @param item
             */
            setAttr:function(item){
                let params = {label:item.name,name:item.href};
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
                            this.$router.push({path:nextTab.name});
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
             * TODO:弹出框展示
             */
            getMsgDialog:function(){
                this.chatVisible = !this.chatVisible;
                if (!this.chatVisible) {
                    this.chatMsgClass = 'el-icon-chat-dot-round';
                } else {
                    this.chatMsgClass = 'el-icon-close';
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
             * todo:设置弹框大小
             */
            setDialogWidth:function () {
                if (this.innerWidth<768) {
                    this.addDialogWidth('100%')
                } else if (this.innerWidth>=768 && this.innerWidth<992) {
                    this.addDialogWidth('85%')
                } else if (this.innerWidth>=992 && this.innerWidth<1200) {
                    this.addDialogWidth('70%')
                } else if (this.innerWidth>=1200 && this.innerWidth<1920) {
                    this.addDialogWidth('65%')
                } else if (this.innerWidth>=1920) {
                    this.addDialogWidth('50%');
                    this.isCollapse = false;
                    this.menuClass ='el-icon-s-unfold';
                    this.asideWidth = "200px";
                    this.headerStyle = {'margin-left':'200px'};
                    this. mainStyle = {margin:'60px 0 60px 200px'}
                    this.chatDialogWidth = '65%'
                }
            },
        },
        /**
         * TODO:Vue生命周期
         */
        created(){
            //初始化聊天系统参数
            this.chat = {
                msgCount:0,
                total:0,
                online:0
            };
            this.asideHeight = {
                'min-height':(window.innerHeight - 60)+'px'
            };
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
            weather:function () {
                if (this.weather) {
                    this.noticeArr.push({time:func.get_timestamp(),message:this.weather['info'] ? JSON.stringify(this.weather['info']) : JSON.stringify(['welcome'])})
                }
            },
            currTabs:function () {
                this.activeName = this.currTabs.name
            }

        },
        /**
         * TODO:Vue生命周期
         */
        mounted() {
            this.$nextTick(function () {
                let params = {label:this.$route.meta.title,name:this.$route.path};
                if (params.label !== '欢迎页' || func.str_count(params.name,'/') !== 3) {
                    this.addCurrTabs(params);
                    this.addTabs(params);
                }
                //导航栏
                this.getAuthMenu();
                //消息推送
                this.webPush();
                //侧边栏隐藏
                this.isCollapse = true;
                this.menuClass = 'el-icon-s-fold';
                this.asideWidth = "65px";
                this.headerStyle = {'margin-left':'65px'};
                this. mainStyle = {margin:'60px 0 60px 60px'}
                this.setDialogWidth();
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
.msg-icon{
    font-size: 50px;
    color:#ffffff;
    position:fixed;
    cursor: pointer;
    right:10px;
    bottom:10%;
    width: 80px;
    height: 80px;
    background: #409EFF;
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
