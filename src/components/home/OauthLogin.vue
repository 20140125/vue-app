<template>
  <div class="oauth-login" v-if="error.code === '20003'">
    <div class="oauth-login__list">
      <div class="oauth-login__title" @click="closeShadow">取消授权</div>
      <div class="oauth-login__item" v-for="(item, index) in (oAuthConfig || {}).children" :key="index">
        <el-button size="mini" type="primary" plain @click="loginSYS(item)" style="min-width: 100px">
          {{ item.name.toUpperCase() }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OauthLogin',
  computed: {
    oAuthConfig() {
      return this.$store.state.login.oauthConfig;
    },
    error() {
      return this.$store.state.errorInfo;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getOAuthConfig();
    });
  },
  methods: {
    /**
     * 关闭浮层
     */
    closeShadow() {
      this.$store.commit('UPDATE_MUTATIONS', { errorInfo: this.$store.state.index.error.cancel });
    },
    /**
     * 获取系统配置
     * @returns {Promise<void>}
     */
    async getOAuthConfig() {
      await this.$store.dispatch('login/getOauthConfig', { name: 'Oauth', refresh: false });
    },
    /**
     * 授权登录
     * @param {Object} item
     */
    loginSYS(item) {
      window.location.href = `${item.value}/${Date.parse(new Date())}`;
    }
  }
};
</script>
<style lang="less">
.el-message {
  border-radius: 10px;
}
.el-message-box {
  width: 300px !important;
}
</style>
