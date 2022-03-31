<template>
  <BaseLayout :loading="loading">
    <template #body>
      <PluginLists :pluginList="pluginList" @updatePlugin="updatePlugin"></PluginLists>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../../components/BaseLayout';
import PluginLists from '../../components/system/plugin/Lists';
import URLS from '../../api/urls';
export default {
  name: 'Plugin',
  components: { PluginLists, BaseLayout },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    pluginList() {
      return this.$store.state.login.oauthConfig;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getPlugin();
    });
  },
  methods: {
    /**
     * todo:获取插件列表
     * @returns {Promise<void>}
     */
    async getPlugin() {
      this.loading = true;
      await this.$store.dispatch('login/getOauthConfig', { name: 'Oauth', refresh: true }).then(() => {
        this.loading = false;
      });
    },
    /**
     * todo:插件卸载、安装
     * @param scope
     * @returns {Promise<void>}
     */
    async updatePlugin(scope) {
      await this.$store.dispatch('UPDATE_ACTIONS', { url: URLS.config.plugin, model: { status: scope.status === 1 ? 2 : 1, id: scope.id, pid: scope.pid } }).then(async () => {
        await this.getPlugin();
      });
    }
  }
};
</script>

<style scoped>

</style>
