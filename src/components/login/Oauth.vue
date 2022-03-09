<template>
  <div style="margin: 20px 0">
    <el-button
      v-for="(item, index) in (oAuthConfig || {}).children"
      :key="index"
      plain
      type="primary"
      @click="toLogin(item)">
      {{ item.name.toUpperCase() }}
    </el-button>
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
        await this.$store.dispatch('login/getOauthConfig', { name: 'Oauth', login: 'before' });
      }
    }
  },
  methods: {
    toLogin(item) {
      window.open(item.value, '_self');
    }
  }
};
</script>

<style scoped>

</style>
