<template>
  <BaseLayout :loading="loading">
    <template #header>
      <el-form-item>
        <el-button
          v-if="Permission.auth.indexOf(savePermission) > -1"
          icon="el-icon-plus"
          plain
          size="mini"
          type="primary"
          @click="addAuth">
          添加
        </el-button>
      </el-form-item>
    </template>
    <!--权限列表-->
    <template #body>
      <AuthLists
        :auth-tree="authTree"
        @addAuth="addAuth"
        @updateAuth="updateAuth">
      </AuthLists>
    </template>
    <!--权限修改-->
    <template #dialog>
      <AuthDialog
        :auth-lists="authLists"
        :form="form"
        :reForm="reForm"
        :sync-visible="syncVisible"
        @getAuthLists="getAuthLists">
      </AuthDialog>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../../components/BaseLayout';
import AuthLists from '../../components/permission/auth/Lists';
import AuthDialog from '../../components/permission/auth/Dialog';
import URLS from '../../api/urls';

export default {
  name: 'Auth',
  components: { AuthLists, AuthDialog, BaseLayout },
  data() {
    return {
      loading: true,
      form: { name: '', href: '', pid: '', status: 1 },
      syncVisible: false,
      reForm: 'created',
      savePermission: URLS.auth.save
    };
  },
  computed: {
    /* todo：权限列表 */
    authLists() {
      return this.$store.state.auth.authLists || [];
    },
    /* todo：权限树列表 */
    authTree() {
      return this.$store.state.auth.authTree || [];
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getAuthLists();
    });
  },
  methods: {
    /**
     * todo:获取权限列表
     * @param refresh
     * @return {Promise<void>}
     */
    async getAuthLists(refresh = false) {
      this.syncVisible = false;
      this.loading = true;
      await this.$store.dispatch('auth/getAuthLists', { refresh: refresh }).then(() => {
        this.loading = false;
      });
    },
    /**
     * todo:新增权限
     * @param form
     */
    addAuth(form = {}) {
      this.form = { name: '', href: '', status: 1, pid: form.id || 0, path: '' };
      this.reForm = 'created';
      this.syncVisible = true;
    },
    /**
     * todo:修改权限
     * @param form
     */
    updateAuth(form) {
      this.form = { ...form };
      this.reForm = 'updated';
      this.syncVisible = true;
    }
  }
};
</script>

<style scoped>

</style>
