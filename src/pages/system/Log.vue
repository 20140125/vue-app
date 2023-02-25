<template>
  <BaseLayout :loading="loading" :pagination="pagination">
    <template #header></template>
    <template #body>
      <SystemLogLists
        :system-log-lists="systemLogLists"
        @removeLog="removeLog">
      </SystemLogLists>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../../components/BaseLayout';
import SystemLogLists from '../../components/system/log/Lists';
import URLS from '../../api/urls';

export default {
  name: 'SystemLog',
  components: { SystemLogLists, BaseLayout },
  computed: {
    systemLogLists() {
      return this.$store.state.log.systemLogLists;
    }
  },
  data() {
    return {
      loading: true,
      pagination: { page: 1, limit: 15, total: 0, show_page: true, refresh: false },
      syncVisible: false
    };
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getSystemLogLists(this.pagination);
    });
  },
  methods: {
    /**
     * 获取日志列表
     * @param pagination
     * @returns {Promise<void>}
     */
    async getSystemLogLists(pagination) {
      this.syncVisible = false;
      this.loading = true;
      await this.$store.dispatch('log/getSystemLogLists', pagination);
      this.pagination.total = this.$store.state.log.total;
      this.loading = false;
    },
    /**
     * 页面转换
     * @param page
     */
    async currentPageChange(page) {
      this.pagination.page = page;
      await this.getSystemLogLists(this.pagination);
    },
    /**
     * 删除日志
     * @param scope
     * @returns {Promise<void>}
     */
    async removeLog(scope) {
      await this.$confirm('此操作将永远删除该日志，是否继续？', `删除日志【${scope.id}】`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('UPDATE_ACTIONS', { url: URLS.log.delete, model: { id: scope.id } });
        this.pagination.refresh = true;
        await this.getSystemLogLists(this.pagination);
      }).catch(() => {
        this.$message({ type: 'info', message: 'cancel remove！' });
      });
    }
  }
};
</script>

<style scoped>

</style>
