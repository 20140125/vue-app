<template>
  <div class="oauth-login" v-if="showShadow">
    <div class="oauth-login__list">
      <div class="oauth-login__title" @click="closeShadow">授权登录</div>
      <div class="oauth-login__item" v-for="(item, index) in (oAuthConfig || {}).children" :key="index">
        <el-button size="mini" type="primary" @click="loginSYS(item)" style="min-width: 100px">
          {{ item.name.toUpperCase() }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OauthLogin',
  props: {
    showOAuth: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      showShadow: false
    };
  },
  watch: {
    async showOAuth() {
      if (this.showOAuth) {
        await this.$confirm(this.$store.state.errorInfo.message, this.$store.state.errorInfo.code, { type: 'success', showClose: false }).then(() => {
          this.$message({
            message:'单击授权登录按钮可关闭浮层',
            type: 'success',
            offset: 350,
            dangerouslyUseHTMLString: true,
            duration: 1000
          });
          this.showShadow = true;
        }).catch(() => {
          this.showShadow = false;
        });
      }
    }
  },
  computed: {
    oAuthConfig() {
      return this.$store.state.login.oauthConfig;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getOAuthConfig();
    });
  },
  methods: {
    /**
     * todo:关闭浮层
     */
    closeShadow() {
      this.showShadow = false;
      this.$store.commit('UPDATE_MUTATIONS', { errorInfo: { code: '20000', message: 'Cancelled Login System' } });
    },
    /**
     * todo:获取系统配置
     * @returns {Promise<void>}
     */
    async getOAuthConfig() {
      await this.$store.dispatch('login/getOauthConfig', { name: 'Oauth', refresh: false });
    },
    /**
     * todo:授权登录
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
