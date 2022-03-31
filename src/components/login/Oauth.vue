<template>
  <div style="margin: 20px 0">
    <template v-for="(item, index) in (oAuthConfig || {}).children" :key="index">
      <el-button
        v-if="item.status === 1"
        plain
        type="primary"
        @click="toLogin(item)">
        {{ item.name.toUpperCase() }}
      </el-button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Oauth',
  props: ['oauthLogin'],
  data() {
    return {};
  },
  computed: {
    oAuthConfig() {
      return this.$store.state.login.oauthConfig;
    }
  },
  watch: {
    async oauthLogin() {
      if (this.oauthLogin) {
        await this.$store.dispatch('login/getOauthConfig', { name: 'Oauth', login: 'before', refresh: false });
      }
    }
  },
  methods: {
    /**
     * todo:授权登录
     * @param item
     */
    toLogin(item) {
      window.open(item.value, '_self');
    }
  }
};
</script>

<style scoped>

</style>
