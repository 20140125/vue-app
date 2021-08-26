<template>
    <div id="header">
        <el-menu :default-active="activeIndex" mode="horizontal" background-color="#393d49" text-color="#fff" active-text-color="#ff69b4" @select="handleSelect" :style="headerAttr.headerStyle">
            <el-menu-item index="1" @click="hideMenu">
                <i :class="headerAttr.menuClass" style="color: #fff;font-size: 25px"></i>
            </el-menu-item>
            <el-menu-item index="2" @click="visible = !visible">
                <template #title>
                    <i class="el-icon-location"></i>{{ userInfo.city }}
                </template>
            </el-menu-item>
            <el-submenu index="5" class="el-menu_item_right">
                <template #title>
                    <el-avatar :src="userInfo.avatar_url" :alt="userInfo.username" :size="40"></el-avatar>
                    <span v-html="userInfo.username" style="margin-left: 10px"></span>
                </template>
                <el-menu-item index="6-1"><i class="el-icon-user-solid"></i>个人中心</el-menu-item>
                <el-menu-item index="6-2"><i class="el-icon-upload2"></i>退出系统</el-menu-item>
            </el-submenu>
            <el-menu-item index="4" class="el-menu_item_right">
                <el-dropdown trigger="hover" @command="readNotice" :hide-on-click="false" :show-timeout="100">
                    <el-badge :value="notice.length">
                        <i class="el-icon-message-solid"></i>
                    </el-badge>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item class="web-notice">站内通知</el-dropdown-item>
                            <el-dropdown-item :command="item" divided v-for="(item,index) in notice" :key="index" :disabled="item.disabled">
                                <el-badge is-dot v-if="!item.disabled"></el-badge>
                                【{{ item.title }}】 {{ item.info }}
                            </el-dropdown-item>
                            <el-dropdown-item class="web-notice" command="more">查看更多</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-menu-item>
            <el-menu-item index="3" class="el-menu_item_right">
                <template #title>
                    <i class="el-icon-s-home"></i>
                </template>
            </el-menu-item>
        </el-menu>

        <!--天气预告-->
        <AreaDialog :form="{ name: userInfo.city, forecast: userInfo.forecast }" :sync-visible="visible" :show-submit-button="false" @closeDialog="closeDialog"></AreaDialog>
    </div>
</template>

<script>
import AreaDialog from '@/components/system/area/Dialog';

export default {
    name: 'Header',
    components: {AreaDialog},
    props: ['layoutNums'],
    data() {
        return {
            activeIndex: '1',
            visible: false,
            headerAttr: {
                menuClass: 'el-icon-s-unfold',
                headerStyle: {'margin-left': '220px'}
            }
        };
    },
    computed: {
        userInfo() {
            return this.$store.state.login.userInfo;
        },
        notice() {
            return JSON.parse(JSON.stringify(this.$store.state.home.notice));
        }
    },
    methods: {
        handleSelect() {

        },
        /**
         * todo:关闭天气预告弹框
         */
        closeDialog() {
            this.visible = false;
        },
        /**
         * todo:隐藏导航栏
         */
        hideMenu() {
            this.isCollapse = !this.isCollapse;
            this.headerAttr = this.isCollapse ? {menuClass: 'el-icon-s-fold', headerStyle: {'margin-left': '65px'}} : {menuClass: 'el-icon-s-unfold', headerStyle: {'margin-left': '220px'}};
            this.$emit('setLayout', this.isCollapse);
        },
        readNotice() {
        }
    }
};
</script>

<style lang="less">
.el-dropdown-menu {
    .web-notice {
        text-align: center !important;
        color: #ff69b4 !important;
    }
}
#header {
    .el-menu_item_right {
        float: right;
    }
}
</style>
