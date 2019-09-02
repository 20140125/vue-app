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
                </el-footer>
            </el-container>
        </el-container>

        <el-dialog :visible.sync="noticeVisible" :title="title" :center="center">
            <el-alert v-for="(item,index) in notice" :key="index" type="success" :description="item.info" show-icon
                      @close="readNotice(item)"
                      close-text="Close"
                      style="margin-bottom: 20px">

            </el-alert>
        </el-dialog>
    </el-container>
</template>

<script>
    import { mapGetters,mapActions } from 'vuex'
    import apiLists from '../../api/api'
    import func from '../../api/func'
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
                online:0
            }
        },
        computed:{
            ...mapGetters(['tabs','token','username','activeAuthName','contentVisible','menuLists','socketServer']),
        },
        methods:{
            ...mapActions(['addTabs','deleteTabs','addCurrTabs','logoutSystem','getAuthMenu']),
            /**
             * @todo：设置tabs
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
             * @todo：路由追加
             * @param tab
             */
            goto:function(tab){
                this.$router.push({path:tab.name});
            },
            /**
             * @todo：删除tabs
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
             * @todo：用户基础设置
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
            readNotice:function(noticeObj) {
                noticeObj.see = 1;
                noticeObj.created_at = func.set_time(noticeObj.created_at*1000)
                apiLists.PushRead(noticeObj).then(response=>{
                    if (response && response.data.code === 200) {

                    }
                })
            },
            /**
             * @todo：设置导航栏
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
            }
        },
        created(){
            this.activeName = this.activeAuthName;
            this.asideHeight = {
                'min-height':(window.innerHeight - 60)+'px'
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getAuthMenu(this.username);
                this.socketServer.on('connect', ()=>{
                    // 连接后登录
                    this.socketServer.emit('login', this.md5(this.username));
                });
                // 服务端（http）推送站内通知信息
                this.socketServer.on('new_msg', (msg)=>{
                    this.$notify({ title: '系统通知', message: msg, position: 'top-right', type:'success', duration:0 });
                });
                //用户通知
                this.socketServer.on('notice',(response)=>{
                    this.noticeLength = response.length;
                    this.notice = response;
                });
                //在线人数
                this.socketServer.on('online',(response)=>{
                    this.online = response;
                })
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
</style>
