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
          @click='addConfig'>
          新增
        </el-button>
      </el-form-item>
    </template>
    <template #body>
      <SystemConfigLists :config-lists="configLists" @updateConfig="updateConfig"></SystemConfigLists>
    </template>
    <template #dialog>
      <SystemConfigDialog
        :form="form"
        :re-form="reForm"
        :sync-visible="syncVisible"
        @getConfigLists="getConfigLists">
      </SystemConfigDialog>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout';
import SystemConfigLists from '@/components/system/config/Lists';
import SystemConfigDialog from '@/components/system/config/Dialog';
import { config } from '@/api/urls';

export default {
  name: 'SystemConfig',
  components: { SystemConfigDialog, SystemConfigLists, BaseLayout },
  computed: {
    configLists() {
      return this.$store.state.config.configLists;
    }
  },
  data() {
    return {
      loading: true,
      pagination: { page: 1, limit: 15, total: 0, show_page: true, refresh: false },
      syncVisible: false,
      reForm: 'created',
      form: {},
      savePermission: config.save
    };
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getConfigLists(this.pagination);
    });
  },
  methods: {
    /**
     * 获取列表
     * @param pagination
     */
    async getConfigLists(pagination) {
      this.pagination.page = pagination.page;
      this.syncVisible = false;
      await this.$store.dispatch('config/getConfigLists', pagination);
      this.pagination.total = this.$store.state.config.total;
      this.loading = false;
    },
    /**
     * 页面转换
     * @param page
     */
    async currentPageChange(page) {
      this.pagination.page = page;
      await this.getConfigLists(this.pagination);
    },
    /**
     * 新增系统配置
     */
    addConfig() {
      this.syncVisible = true;
      this.form = {
        name: '',
        children: [{
          name: '',
          value: '',
          status: 1,
          pid: this.pagination.total + 1,
          id: (this.pagination.total + 1) * 1000
        }],
        status: 1
      };
      this.reForm = 'created';
    },
    /**
     * 修改系统配置
     * @param form
     */
    updateConfig(form) {
      this.syncVisible = true;
      this.form = JSON.parse(JSON.stringify(form));
      this.reForm = 'updated';
    }
  }
};
</script>

<style scoped>

</style>
