<template>
  <BaseLayout :loading="loading" :pagination="pagination">
    <template #header>
      <el-form-item>
        <el-select v-model="pagination.state" clearable placeholder="请选择推送状态" @change="searchPush">
          <el-option
            v-for="(item, index) in pushState"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model.number="pagination.status" clearable placeholder="实时推送" @change="searchPush">
          <el-option
            v-for="(item, index) in pushStatus"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="pagination.username" clearable placeholder="请输入接收者的名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" plain type="primary" @click="searchPush">检索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="Permission.auth.indexOf(savePermission) > -1"
          icon="el-icon-plus"
          plain
          type="primary"
          @click='addPush'>
          新增
        </el-button>
      </el-form-item>
    </template>
    <template #body>
      <PushLists ref="pushLists" :push-lists="pushLists" @runPusher="runPusher"></PushLists>
    </template>
    <template #dialog>
      <PushDialog
        :form="form"
        :re-form="reForm"
        :sync-visible="syncVisible"
        :user-lists="userLists"
        @getPushLists="getPushLists">
      </PushDialog>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout';
import PushLists from '@/components/system/push/Lists';
import PushDialog from '@/components/system/push/Dialog';
import { setTime } from '@/utils/func';
import { push } from '@/api/urls';

export default {
  name: 'Push',
  components: { PushDialog, PushLists, BaseLayout },
  data() {
    return {
      loading: true,
      pagination: {
        page: 1,
        limit: 15,
        total: 0,
        show_page: true,
        refresh: false,
        username: '',
        state: '',
        status: ''
      },
      pushStatus: [{ label: '是', value: 1 }, { label: '否', value: 2 }],
      pushState: [{ label: 'SUCCESSFULLY', value: 'successfully' }, {
        label: 'OFFLINE',
        value: 'offline'
      }, { label: 'FAILED', value: 'failed' }],
      syncVisible: false,
      reForm: 'created',
      form: {},
      userLists: [],
      savePermission: push.save
    };
  },
  computed: {
    pushLists() {
      return this.$store.state.push.pushLists;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getPushLists(this.pagination);
    });
  },
  methods: {
    /**
     * 获取站内通知
     * @param pagination
     * @return {Promise<void>}
     */
    async getPushLists(pagination) {
      this.loading = true;
      this.syncVisible = false;
      await this.$store.dispatch('push/getPushLists', pagination);
      this.loading = false;
      this.pagination.total = this.$store.state.push.total;
    },
    /**
     * 检索推送
     * @return {Promise<boolean>}
     */
    async searchPush() {
      this.pagination.page = 1;
      this.pagination.refresh = true;
      await this.getPushLists(this.pagination);
    },
    /**
     * 页面转换
     * @param page
     */
    async currentPageChange(page) {
      this.pagination.page = page;
      await this.getPushLists(this.pagination);
    },
    /**
     * 添加站内通知
     * @return {Promise<void>}
     */
    async addPush() {
      this.form = {
        username: '',
        uuid: '',
        title: '',
        info: '',
        status: 1,
        state: 'failed',
        created_at: setTime(Date.parse(new Date()), 'en')
      };
      this.reForm = 'created';
      this.syncVisible = true;
      await this.$store.dispatch('users/getCacheUserLists', {});
      this.userLists = this.$store.state.users.cacheUsers;
    },
    /**
     * 执行站内通知
     * @param form
     * @return {Promise<void>}
     */
    async runPusher(form) {
      this.form = JSON.parse(JSON.stringify(form));
      this.reForm = 'updated';
      this.syncVisible = true;
      await this.$store.dispatch('users/getCacheUserLists', {});
      this.userLists = this.$store.state.users.cacheUsers;
    }
  }
};
</script>

<style scoped>

</style>
