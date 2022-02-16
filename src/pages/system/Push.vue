<template>
  <BaseLayout :loading="loading" :pagination="pagination">
    <template #header>
      <el-form-item>
        <el-select v-model="pagination.state" placeholder="请选择推送状态" @change="searchPush" clearable>
          <el-option v-for="(item, index) in pushState" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model.number="pagination.status" placeholder="实时推送" @change="searchPush" clearable>
          <el-option v-for="(item, index) in pushStatus" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="请输入接收者的名称" v-model="pagination.username" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchPush" plain type="primary">检索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="Permission.auth.indexOf(savePermission) > -1" type="primary" plain @click='addPush'
                   icon="el-icon-plus">新增
        </el-button>
      </el-form-item>
    </template>
    <template #body>
      <PushLists :push-lists="pushLists" @runPusher="runPusher" ref="pushLists"></PushLists>
    </template>
    <template #dialog>
      <PushDialog :sync-visible="syncVisible" :re-form="reForm" :form="form" :user-lists="userLists"
                  @getPushLists="getPushLists"></PushDialog>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout';
import PushLists from '@/components/system/push/Lists';
import PushDialog from '@/components/system/push/Dialog';
import func from '@/utils/func';
import URLS from '@/api/urls';

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
      savePermission: URLS.push.save
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
     * todo:获取站内通知
     * @param pagination
     * @return {Promise<void>}
     */
    async getPushLists(pagination) {
      this.loading = true;
      this.syncVisible = false;
      await this.$store.dispatch('push/getPushLists', pagination).then(() => {
        this.loading = false;
        this.pagination.total = this.$store.state.push.total;
      });
    },
    /**
     * TODO:检索推送
     * @return {Promise<boolean>}
     */
    async searchPush() {
      this.pagination.page = 1;
      this.pagination.refresh = true;
      await this.getPushLists(this.pagination);
    },
    /**
     * todo:页面转换
     * @param page
     */
    async currentPageChange(page) {
      this.pagination.page = page;
      await this.getPushLists(this.pagination);
    },
    /**
     * todo:添加站内通知
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
        created_at: func.setTime(Date.parse(new Date()), 'en')
      };
      this.reForm = 'created';
      this.syncVisible = true;
      await this.$store.dispatch('users/getCacheUserLists', {}).then(() => {
        this.userLists = this.$store.state.users.cacheUsers;
      });
    },
    /**
     * todo:执行站内通知
     * @param form
     * @return {Promise<void>}
     */
    async runPusher(form) {
      this.form = JSON.parse(JSON.stringify(form));
      this.reForm = 'updated';
      this.syncVisible = true;
      await this.$store.dispatch('users/getCacheUserLists', {}).then(() => {
        this.userLists = this.$store.state.users.cacheUsers;
      });
    }
  }
};
</script>

<style scoped>

</style>
