<template>
    <el-menu :default-active="activeIndex" mode="horizontal" background-color="#393d49" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" :style="headerAttr.headerStyle">
        <el-menu-item index="1" @click="hideMenu">
            <i :class="headerAttr.menuClass" style="color: #fff;font-size: 25px"></i>
        </el-menu-item>
        <el-menu-item index="5" @click="showCity = !showCity">
            <template #title><i class="el-icon-location"></i>{{userInfo.city}}</template>
        </el-menu-item>
        <el-submenu index="2" style="float: right">
            <template #title>
                <el-avatar :src="userInfo.avatar_url" :alt="userInfo.username" :size="35"></el-avatar>
                <span v-html="userInfo.username" style="margin-left: 10px"></span>
            </template>
            <el-menu-item index="2-1"><i class="el-icon-user-solid"></i>个人中心</el-menu-item>
            <el-menu-item index="2-2"><i class="el-icon-upload2"></i>退出系统</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" style="float: right">
            <el-dropdown trigger="hover" @command="readNotice" :hide-on-click="false" :show-timeout="100">
                <i class="el-icon-message-solid" style="color: #fff;font-size: 22px"></i>
                <el-badge :value="noticeLength" style="margin-top: -30px;margin-left: -18px" v-if="noticeLength"></el-badge>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item style="text-align: center;color: #66b1ff">站内通知</el-dropdown-item>
                        <el-dropdown-item :command="item" divided v-for="(item,index) in notice" :key="index" :disabled="item.disabled">
                            <el-badge is-dot v-if="!item.disabled"></el-badge>【{{item.title}}】 {{item.info}}
                        </el-dropdown-item>
                        <el-dropdown-item command="more" style="text-align: center;color: #66b1ff">查看更多</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </el-menu-item>
        <el-menu-item index="4"  style="float: right">
            <a href="https://gitee.com/f_longer/vue-app" target="_blank">
                <el-image src="https://gitee.com/f_longer/longer/widgets/widget_5.svg?color=C71D24" alt="gitee"></el-image>
            </a>
        </el-menu-item>
        <el-menu-item index="6" style="float: right">
            <el-link href="/" style="color: #fff;font-size: 25px" class="el-icon-s-home"></el-link>
        </el-menu-item>
    </el-menu>
</template>

<script>
export default {
    name: 'Header',
    data () {
        return {
            activeIndex: '1',
            noticeLength: 0,
            headerAttr: {
                menuClass: 'el-icon-s-unfold',
                asideWidth: '200px',
                headerStyle: { 'margin-left': '200px' },
                mainStyle: { margin: '60px 0 60px 60px' }
            },
            notice: []
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.login.userInfo
        }
    },
    methods: {
        handleSelect() {

        },
        /**
         * todo:隐藏导航栏
         */
        hideMenu() {
            this.isCollapse = !this.isCollapse
            if (this.isCollapse) {
                this.headerAttr = {
                    menuClass: 'el-icon-s-fold',
                    asideStyle: { width: '65px', 'min-height': (window.innerHeight - 60) + 'px' },
                    headerStyle: { 'margin-left': '65px' },
                    mainStyle: { margin: '60px 0 60px 60px', 'line-height': '35px' }
                }
            } else {
                this.headerAttr =  {
                    menuClass: 'el-icon-s-unfold',
                    asideStyle: { width: '200px', 'min-height': (window.innerHeight - 60) + 'px' },
                    headerStyle: {'margin-left': '200px'},
                    mainStyle: { margin: '60px 0 60px 200px', 'line-height': '35px' }
                }
            }
            this.$emit('setLayout', this.headerAttr, this.isCollapse)
        },
        readNotice() {},
    }
}
</script>

<style scoped>

</style>
