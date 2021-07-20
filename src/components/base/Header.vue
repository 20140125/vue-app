<template>
    <div>
        <el-menu :default-active="activeIndex" mode="horizontal" background-color="#393d49" text-color="#fff" active-text-color="#ff69b4" @select="handleSelect" :style="headerAttr.headerStyle">
            <el-menu-item index="1" @click="hideMenu">
                <i :class="headerAttr.menuClass" style="color: #fff;font-size: 25px"></i>
            </el-menu-item>
            <el-menu-item index="5" @click="visible = !visible">
                <template #title><i class="el-icon-location"></i>{{userInfo.city}}</template>
            </el-menu-item>
            <el-submenu index="2" style="float: right">
                <template #title>
                    <el-avatar :src="userInfo.avatar_url" :alt="userInfo.username" :size="40"></el-avatar>
                    <span v-html="userInfo.username" style="margin-left: 10px"></span>
                </template>
                <el-menu-item index="2-1"><i class="el-icon-user-solid"></i>个人中心</el-menu-item>
                <el-menu-item index="2-2"><i class="el-icon-upload2"></i>退出系统</el-menu-item>
            </el-submenu>
            <el-menu-item index="3" style="float: right">
                <el-dropdown trigger="hover" @command="readNotice" :hide-on-click="false" :show-timeout="100">
                    <i class="el-icon-message-solid" style="color: #fff;font-size: 22px"></i>
                    <el-badge :value="notice.length" style="margin-top: -20px;margin-left: -10px" v-if="notice.length > 0"></el-badge>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item style="text-align: center;color: #ff69b4">站内通知</el-dropdown-item>
                            <el-dropdown-item :command="item" divided v-for="(item,index) in notice" :key="index" :disabled="item.disabled">
                                <el-badge is-dot v-if="!item.disabled"></el-badge>【{{item.title}}】 {{item.info}}
                            </el-dropdown-item>
                            <el-dropdown-item command="more" style="text-align: center;color: #ff69b4">查看更多</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-menu-item>
            <el-menu-item index="4"  style="float: right">
                <el-link href="https://gitee.com/f_longer/vue-app" target="_blank">
                    <el-avatar src="https://gitee.com/f_longer/longer/widgets/widget_2.svg?color=C71D24" alt="gitee" :size="40"></el-avatar>
                </el-link>
            </el-menu-item>
            <el-menu-item index="6" style="float: right">
                <el-link href="/" style="color: #fff;font-size: 25px" class="el-icon-s-home"></el-link>
            </el-menu-item>
        </el-menu>

        <!--天气预告-->
        <AreaDialog :form="{ name: userInfo.city, forecast: userInfo.forecast }" :sync-visible="visible" :show-submit-button="false" @closeDialog="closeDialog"></AreaDialog>
    </div>
</template>

<script>
import AreaDialog from '@/components/system/area/Dialog'
export default {
    name: 'Header',
    components: { AreaDialog },
    data () {
        return {
            activeIndex: '1',
            visible: false,
            headerAttr: {
                menuClass: 'el-icon-s-unfold',
                headerStyle: { 'margin-left': '220px' },
                mainStyle: { margin: '60px 0 60px 60px' }
            }
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.login.userInfo
        },
        notice() {
            return JSON.parse(JSON.stringify(this.$store.state.home.notice))
        }
    },
    methods: {
        handleSelect() {

        },
        /**
         * todo:关闭天气预告弹框
         */
        closeDialog() {
            this.visible = false
        },
        /**
         * todo:隐藏导航栏
         */
        hideMenu() {
            this.isCollapse = !this.isCollapse
            this.headerAttr = this.isCollapse ? { menuClass: 'el-icon-s-fold', headerStyle: { 'margin-left': '65px' } } : { menuClass: 'el-icon-s-unfold', headerStyle: { 'margin-left': '220px' } }
            this.$emit('setLayout', this.isCollapse)
        },
        readNotice() {},
    }
}
</script>

<style scoped>

</style>
