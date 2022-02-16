<template>
  <BaseLayout :loading="loading" :pagination="pagination">
    <template #header>
      <el-form-item>
        <el-input placeholder="请输入用户名" v-model="pagination.username" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchOauth" plain type="primary">检索</el-button>
      </el-form-item>
    </template>
    <template #body>
      <OAuthLists :oAuthLists="oAuthLists" ref="oAuthLists" @bindEmail="bindEmail"></OAuthLists>
    </template>
    <template #dialog>
      <OAuthDialog
        :sync-visible="syncVisible"
        :re-form="reForm"
        :form="form"
        @getOAuthLists="getOAuthLists">
      </OAuthDialog>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../../components/BaseLayout';
import OAuthLists from '../../components/users/oauth/Lists';
import OAuthDialog from '../../components/users/oauth/Dialog';

export default {
  name: 'OAuth',
  components: { OAuthDialog, OAuthLists, BaseLayout },
  data() {
    return {
      loading: true,
      pagination: { page: 1, limit: 15, total: 0, show_page: true, refresh: false, username: '' },
      syncVisible: false,
      reForm: 'created',
      form: {}
    };
  },
  computed: {
    oAuthLists() {
      return this.$store.state.oauth.oAuthLists;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getOAuthLists(this.pagination);
    });
  },
  methods: {
    /**
     * todo:用户搜索
     * @return {Promise<boolean>}
     */
    async searchOauth() {
      this.pagination.page = 1;
      this.pagination.refresh = true;
      await this.getOAuthLists(this.pagination);
    },
    /**
     * todo:获取授权用户列表
     * @param pagination
     * @return {Promise<void>}
     */
    async getOAuthLists(pagination) {
      this.loading = true;
      this.syncVisible = false;
      await this.$store.dispatch('oauth/getOAuthLists', pagination).then(() => {
        this.loading = false;
        this.pagination.total = this.$store.state.oauth.total;
      });
    },
    /**
     * todo:页面转换
     * @param page
     */
    async currentPageChange(page) {
      this.pagination.page = page;
      await this.getOAuthLists(this.pagination);
    },
    /**
     * todo:邮箱账号绑定
     * @param form
     */
    bindEmail(form) {
      this.form = { ...form };
      this.syncVisible = true;
    }
  }
};
</script>

<style scoped>

</style>
