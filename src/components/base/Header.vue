<template>
  <div id="header">
    <el-menu :default-active="activeIndex" mode="horizontal" background-color="#393d49" text-color="#fff" :active-text-color="activeColor" @select="handleSelect" :style="headerAttr.headerStyle">
      <el-menu-item index="1">
        <i :class="headerAttr.menuClass" style="color: #fff;font-size: 25px"></i>
      </el-menu-item>
      <el-menu-item index="2">
        <template #title>
          <i style="color: #fff;font-size: 25px" class="el-icon-location"></i>{{ Permission.city }}
        </template>
      </el-menu-item>
      <el-submenu index="6" class="el-menu_item_right">
        <template #title>
          <span v-html="`主题切换`"></span>
        </template>
        <el-menu-item v-for="(item, index) in themeAttr" :key="index" :index="`6-${index + 1}`" :style="`color: ${item.color}`" @click="setTheme(item)">
          <i :style="`color: ${item.color}`" class="el-icon-s-home"></i>{{ item.text }}
        </el-menu-item>
      </el-submenu>
      <el-submenu index="5" class="el-menu_item_right">
        <template #title>
          <el-avatar :src="Permission.avatar_url" :alt="Permission.username" referrerpolicy="no-referrer" :size="40"></el-avatar>
          <span v-html="Permission.username" style="margin-left: 10px"></span>
        </template>
        <el-menu-item index="5-1"><i class="el-icon-user-solid"></i>会员中心</el-menu-item>
        <el-menu-item index="5-2"><i class="el-icon-upload2"></i>退出系统</el-menu-item>
      </el-submenu>
      <el-menu-item index="4" class="el-menu_item_right">
        <el-dropdown trigger="hover" @command="readNotice" :hide-on-click="false" :show-timeout="100">
          <el-badge :value="unread || ''">
            <i style="color: #fff;font-size: 25px" class="el-icon-message-solid"></i>
          </el-badge>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item class="web-notice" :style="`color: ${activeColor} !important`" disabled>系统通知</el-dropdown-item>
              <el-dropdown-item :command="item" divided v-for="(item,index) in notice" :key="index" :disabled="item.disabled">
                <el-badge is-dot v-if="!item.disabled"></el-badge>
                【{{ item.title }}】 {{ item.info }}
              </el-dropdown-item>
              <el-dropdown-item class="web-notice" :style="`color: ${activeColor} !important`" command="more">查看更多</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-menu-item>
      <el-menu-item index="3" class="el-menu_item_right">
        <template #title>
          <i style="color: #fff;font-size: 25px" class="el-icon-s-home"></i>
        </template>
      </el-menu-item>
    </el-menu>

    <!--天气预告-->
    <AreaDialog :form="{ name: Permission.city, forecast: Permission.forecast }" :sync-visible="visible" :show-submit-button="false" @closeDialog="closeDialog"></AreaDialog>
  </div>
</template>

<script>
import AreaDialog from '@/components/system/area/Dialog';
import URLS from '@/api/urls';

export default {
  name: 'Header',
  components: { AreaDialog },
  props: ['layoutNums'],
  data() {
    return {
      activeIndex: '6-1',
      visible: false,
      headerAttr: {
        menuClass: 'el-icon-s-unfold',
        headerStyle: { 'margin-left': '220px' }
      },
      activeColor: this.$store.getters.activeColor
    };
  },
  computed: {
    /**
     * todo:站内通知
     * @return {any}
     */
    notice() {
      return JSON.parse(JSON.stringify(this.$store.state.home.notice));
    },
    /**
     * todo:未读消息数
     * @return {any}
     */
    unread() {
      return this.$store.state.home.unread;
    },
    /**
     * todo:主题参数
     * @return {any}
     */
    themeAttr() {
      return this.$store.state.themeAttr;
    }
  },
  methods: {
    /**
     * todo:导航栏操作
     * @param index
     * @return {Promise<void>}
     */
    async handleSelect(index) {
      switch (index) {
        case '1':
          this.hideMenu();
          break;
        case '2':
          this.visible = !this.visible;
          break;
        case '3':
          await this.routerPush({ label: '欢迎页', value: '/admin/home/index' });
          break;
        case '5-1':
          await this.routerPush({ label: '会员中心', value: '/admin/userCenter/index' });
          break;
        case '5-2':
          await this.logoutSYS('successfully logout system');
          break;
      }
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
      this.headerAttr = this.isCollapse ? { menuClass: 'el-icon-s-fold', headerStyle: { 'margin-left': '65px' } } : { menuClass: 'el-icon-s-unfold', headerStyle: { 'margin-left': '220px' } };
      this.$emit('setLayout', this.isCollapse);
    },
    /**
     * todo:路由跳转
     * @param params
     * @return {Promise<void>}
     */
    async routerPush(params) {
      await this.$store.dispatch('home/addTabs', params).then(() => this.$router.push({ path: params.value }));
    },
    /**
     * todo：登出系统
     * @param message
     * @return {Promise<void>}
     */
    async logoutSYS(message) {
      await this.$store.dispatch('login/logoutSYS', { remember_token: this.$store.state.token }).then(() => this.$message.success(message));
    },
    /**
     * todo:设置主题
     * @param theme
     * @return {Promise<void>}
     */
    async setTheme(theme) {
      await this.$store.dispatch('UPDATE_THEME', { theme }).then(() => this.activeColor = theme.color);
    },
    /**
     * todo:系统通知
     * @param item
     * @return {Promise<void>}
     */
    async readNotice(item) {
      item === 'more' ? await this.routerPush({ label: '系统通知', value: '/admin/push/index' }) : await this.clearPush(item);
    },
    /**
     * todo:阅读通知
     * @param item
     * @return {Promise<void>}
     */
    async clearPush(item) {
      item.disabled = true;
      item.see = 1;
      await this.$store.dispatch('UPDATE_ACTIONS', { url: URLS.push.update, model: item })
    }
  }
};
</script>

<style lang="less">
.el-dropdown-menu {
  .web-notice {
    text-align: center !important;
    font-weight: bold !important;
  }
}

#header {
  .el-menu_item_right {
    float: right;
  }
}
</style>
