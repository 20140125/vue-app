<template>
  <BaseLayout :loading="loading" :pagination="pagination">
    <template #header>
      <el-form-item>
        <el-input placeholder="请输入用户名" v-model="pagination.username" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchUsers" plain type="primary">检索</el-button>
      </el-form-item>
    </template>
    <template #body>
      <UsersLists :users-lists="usersLists" @updatedUsers="updatedUsers" ref="usersLists"></UsersLists>
    </template>
    <template #dialog>
      <UsersDialog :sync-visible="syncVisible" :users-attr="usersAttr" :re-form="reForm" :form="form" @getUsersLists="getUsersLists"></UsersDialog>
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
    this.$nextTick(async() => {
      await this.getUsersLists(this.pagination);
    });
  },
  methods: {
    /**
     * todo:用户搜索
     * @return {Promise<boolean>}
     */
    async searchUsers() {
      this.pagination.page = 1;
      this.pagination.refresh = true;
      await this.getUsersLists(this.pagination);
    },
    /**
     * todo:获取管理员列表
     * @param pagination
     * @return {Promise<void>}
     */
    async getUsersLists(pagination) {
      this.loading = true;
      this.syncVisible = false;
      await this.$store.dispatch('users/getUsersLists', pagination).then(() => {
        this.loading = false;
        this.pagination.total = this.$store.state.users.total;
      });
    },
    /**
     * todo:页面转换
     * @param page
     */
    async currentPageChange(page) {
      this.pagination.page = page;
      await this.getUsersLists(this.pagination);
    },
    /**
     * todo:修改管理员
     * @param form
     * @return {Promise<void>}
     */
    async updatedUsers(form) {
      this.$store.dispatch('role/getRoleLists', { page: 1, limit: 20, refresh: false }).then(() => {
        this.form = JSON.parse(JSON.stringify(form));
        this.reForm = 'updated';
        this.syncVisible = true;
        this.usersAttr = { roleLists: this.$store.state.role.roleLists };
      });
    }
  }
};
</script>

<style scoped>

</style>
