<template>
  <BaseLayout :loading="loading" :pagination="pagination">
    <template #header>
      <el-form-item>
        <el-input v-model="pagination.username" clearable placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" plain type="primary" @click="searchUsers">检索</el-button>
      </el-form-item>
    </template>
    <template #body>
      <UsersLists ref="usersLists" :users-lists="usersLists" @updatedUsers="updatedUsers"></UsersLists>
    </template>
    <template #dialog>
      <UsersDialog
        :form="form"
        :re-form="reForm"
        :syncVisible="syncVisible"
        :users-attr="usersAttr"
        @getUsersLists="getUsersLists">
      </UsersDialog>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout';
import UsersLists from '@/components/users/user/Lists';
import UsersDialog from '@/components/users/user/Dialog';

export default {
  name: 'Users',
  components: { UsersDialog, UsersLists, BaseLayout },
  data() {
    return {
      loading: true,
      pagination: { page: 1, limit: 15, total: 0, show_page: true, refresh: false, username: '' },
      syncVisible: false,
      oAuthLoginVisible: false,
      reForm: 'created',
      form: {},
      usersAttr: {}
    };
  },
  computed: {
    usersLists() {
      return this.$store.state.users.usersLists;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getUsersLists(this.pagination);
    });
  },
  methods: {
    /**
     * 用户搜索
     * @return {Promise<boolean>}
     */
    async searchUsers() {
      this.pagination.page = 1;
      this.pagination.refresh = true;
      await this.getUsersLists(this.pagination);
    },
    /**
     * 获取管理员列表
     * @param pagination
     * @return {Promise<void>}
     */
    async getUsersLists(pagination) {
      this.loading = true;
      this.syncVisible = false;
      this.pagination.page = pagination.page;
      await this.$store.dispatch('users/getUsersLists', pagination).then(() => {
        this.loading = false;
        this.pagination.total = this.$store.state.users.total;
      });
    },
    /**
     * 页面转换
     * @param page
     */
    async currentPageChange(page) {
      this.pagination.page = page;
      await this.getUsersLists(this.pagination);
    },
    /**
     * 修改管理员
     * @param form
     * @return {Promise<void>}
     */
    async updatedUsers(form) {
      await this.$store.dispatch('role/getRoleLists', { page: 1, limit: 20, refresh: false });
      this.form = JSON.parse(JSON.stringify(form));
      this.reForm = 'updated';
      this.syncVisible = true;
      this.usersAttr = { roleLists: this.$store.state.role.roleLists };
    }
  }
};
</script>

<style scoped>

</style>
