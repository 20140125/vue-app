<template>
  <div id="header">
    <el-menu
      :active-text-color="activeColor"
      :default-active="activeIndex"
      :style="headerAttr.headerStyle"
      background-color="#393d49"
      mode="horizontal"
      text-color="#fff"
      @select="handleSelect">
      <el-menu-item index="1">
        <i :class="headerAttr.menuClass" style="color: #fff;font-size: 25px"></i>
      </el-menu-item>
      <el-menu-item index="2">
        <template #title>
          <i class="el-icon-location" style="color: #fff;font-size: 25px"></i>{{ Permission.city }}
        </template>
      </el-menu-item>
      <el-submenu class="el-menu_item_right" index="5">
        <template #title>
          <el-avatar
            :alt="Permission.username"
            :size="40"
            :src="Permission.avatar_url"
            referrerpolicy="no-referrer">
          </el-avatar>
          <span style="margin-left: 10px" v-html="Permission.username"></span>
        </template>
        <el-menu-item index="5-1"><i class="el-icon-user-solid" style="color: #fff"></i>会员中心</el-menu-item>
        <el-menu-item index="5-2"><i class="el-icon-upload2" style="color: #fff"></i>退出系统</el-menu-item>
      </el-submenu>
      <el-menu-item class="el-menu_item_right" index="4">
        <el-dropdown :hide-on-click="false" :show-timeout="100" trigger="hover" @command="readNotice">
          <el-badge :value="unread || ''">
            <i class="el-icon-message-solid" style="color: #fff;font-size: 25px"></i>
          </el-badge>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :style="`color: ${activeColor} !important`" class="web-notice" disabled>
                系统通知
              </el-dropdown-item>
              <el-dropdown-item
                v-for="(item,index) in notice" :key="index" :command="item"
                :disabled="item.disabled"
                divided>
                <el-badge v-if="!item.disabled" is-dot></el-badge>
                【{{ item.title }}】 {{ item.info }}
              </el-dropdown-item>
              <el-dropdown-item :style="`color: ${activeColor} !important`" class="web-notice" command="more">
                查看更多
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-menu-item>
      <el-menu-item class="el-menu_item_right" index="3">
        <template #title>
          <i class="el-icon-s-home" style="color: #fff;font-size: 25px"></i>
        </template>
      </el-menu-item>
    </el-menu>

    <!--天气预告-->
    <AreaDialog
      :form="{ name: Permission.city, forecast: Permission.forecast }"
      :show-submit-button="false"
      :sync-visible="visible" @closeDialog="closeDialog">
    </AreaDialog>
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
     * 站内通知
     * @return {any}
     */
    notice() {
      return JSON.parse(JSON.stringify(this.$store.state.home.notice));
    },
    /**
     * 未读消息数
     * @return {any}
     */
    unread() {
      return this.$store.state.home.unread;
    }
  },
  methods: {
    /**
     * 导航栏操作
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
          await this.routerPush({ label: '欢迎页', value: '/admin/index' });
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
     * 关闭天气预告弹框
     */
    closeDialog() {
      this.visible = false;
    },
    /**
     * 隐藏导航栏
     */
    hideMenu() {
      this.isCollapse = !this.isCollapse;
      this.headerAttr = this.isCollapse ? {
        menuClass: 'el-icon-s-fold',
        headerStyle: { 'margin-left': '65px' }
      } : { menuClass: 'el-icon-s-unfold', headerStyle: { 'margin-left': '220px' } };
      this.$emit('setLayout', this.isCollapse);
    },
    /**
     * 路由跳转
     * @param params
     * @return {Promise<void>}
     */
    async routerPush(params) {
      await this.$store.dispatch('home/addTabs', params).then(() => this.$router.push({ path: params.value }));
    },
    /**
     * 登出系统
     * @param message
     * @return {Promise<void>}
     */
    async logoutSYS(message) {
      await this.$store.dispatch('login/logoutSYS', { remember_token: this.$store.state.token }).then(() => this.$message.success(message));
    },
    /**
     * 系统通知
     * @param item
     * @return {Promise<void>}
     */
    async readNotice(item) {
      item === 'more' ? await this.routerPush({
        label: '系统通知',
        value: '/admin/push/index'
      }) : await this.clearPush(item);
    },
    /**
     * 阅读通知
     * @param item
     * @return {Promise<void>}
     */
    async clearPush(item) {
      item.disabled = true;
      item.see = 1;
      await this.$store.dispatch('UPDATE_ACTIONS', { url: URLS.push.update, model: item });
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

.el-menu.el-menu--horizontal {
  border-bottom: none !important;
}

.el-menu--horizontal > .el-menu-item.is-active,
.el-menu--horizontal > .el-submenu.is-active .el-submenu__title,
.el-menu--horizontal .el-menu .el-menu-item.is-active,
.el-menu--horizontal .el-menu .el-submenu.is-active > .el-submenu__title {
  color: white !important;
}

#header {
  .el-menu_item_right {
    float: right;
  }
}
</style>
