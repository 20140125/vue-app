<template>
  <BaseLayout :loading="loading" :pagination="pagination">
    <template #header>
      <el-form-item>
        <el-button
          v-if="Permission.auth.indexOf(savePermission) > -1"
          icon="el-icon-plus"
          plain
          size="mini"
          type="primary"
          @click='permissionApply'>
          权限申请
        </el-button>
      </el-form-item>
    </template>
    <template #body>
      <PermissionLists
        :permission-lists="permissionLists"
        @getPermissionApply="getPermissionApply"
        @permissionUpdate="permissionUpdate">
      </PermissionLists>
    </template>
    <template #dialog>
      <PermissionDialog
        :form="form"
        :permissionAttr="permissionAttr"
        :reForm="reForm"
        :syncVisible="syncVisible"
        @getPermissionApply="getPermissionApply"
        @getUserAuth="getUserAuth">
      </PermissionDialog>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../../components/BaseLayout';
import PermissionLists from '../../components/permission/apply/Lists';
import PermissionDialog from '../../components/permission/apply/Dialog';
import URLS from '../../api/urls';

export default {
  name: 'Apply',
  components: { PermissionDialog, PermissionLists, BaseLayout },
  data() {
    return {
      loading: true,
      pagination: { page: 1, limit: 15, total: 0, show_page: true, refresh: false },
      syncVisible: false,
      reForm: 'created',
      form: {},
      permissionAttr: { userLists: [], authList: [], checkedKeys: [] },
      savePermission: URLS.permission.save
    };
  },
  computed: {
    permissionLists() {
      return this.$store.state.apply.permissionLists;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getPermissionApply(this.pagination);
    });
  },
  methods: {
    /**
     * 获取站内通知
     * @param pagination
     * @return {Promise<void>}
     */
    async getPermissionApply(pagination) {
      this.syncVisible = false;
      this.pagination.page = pagination.page;
      await this.$store.dispatch('apply/getPermissionApply', pagination);
      this.loading = false;
      this.pagination.total = this.$store.state.apply.total;
    },
    /**
     * 页面转换
     * @param page
     */
    async currentPageChange(page) {
      this.pagination.page = page;
      await this.getPermissionApply(this.pagination);
    },
    /**
     * 获取用户权限
     * @param user_id
     * @return {Promise<void>}
     */
    async getUserAuth(user_id) {
      await this.$store.dispatch('apply/getUserAuth', { user_id: user_id, refresh: true });
      this.permissionAttr = {
        userLists: this.$store.state.users.cacheUsers,
        authLists: this.$store.state.apply.authLists,
        checkedKeys: this.getDefaultCheckedKeys(this.$store.state.apply.authLists, [])
      };
    },
    /**
     * 获取默认权限
     * @param authLists
     * @param checkedKeys
     * @returns {*}
     */
    getDefaultCheckedKeys(authLists, checkedKeys) {
      authLists.forEach((item) => {
        if (!item.disable) {
          checkedKeys.push(item.id);
          this.form.href.push(item.api);
        }
        this.getDefaultCheckedKeys(item.__children, checkedKeys);
      });
      return checkedKeys;
    },
    /**
     * 申请权限
     * @return {Promise<void>}
     */
    async permissionApply() {
      this.syncVisible = true;
      /* 获取用户列表 */
      await this.$store.dispatch('users/getCacheUserLists', {});
      this.permissionAttr = { userLists: this.$store.state.users.cacheUsers, authList: [], checkedKeys: [] };
      this.form = { user_id: '', href: [], expires: '', desc: '' };
      this.reForm = 'created';
    },
    /**
     * 申请权限续期
     * @param form
     * @return {Promise<void>}
     */
    async permissionUpdate(form) {
      await this.$store.dispatch('UPDATE_ACTIONS', { url: URLS.permission.update, model: { id: form.id, status: form.status } });
      await this.getPermissionApply({ page: 1, limit: 15, show_page: true, refresh: true });
    }
  }
};
</script>

<style scoped>

</style>
