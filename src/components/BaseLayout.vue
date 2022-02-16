<template>
  <el-skeleton :rows="5" animated :loading="loading">
    <el-form :inline="true" class="form">
      <slot name="header"></slot>
    </el-form>
    <!--主题信息-->
    <el-main>
      <slot name="body"></slot>
      <div class="pagination" v-if="T_pagination.show_page">
        <el-pagination
          @current-change="currentChange"
          :page-size="T_pagination.limit"
          layout="total, prev, pager, next"
          :total="T_pagination.total"
          :current-page="T_pagination.page">
        </el-pagination>
      </div>
    </el-main>
    <!--弹框信息-->
    <slot name="dialog"></slot>
  </el-skeleton>
</template>

<script>
export default {
  name: 'BaseLayout',
  props: {
    /* loading 加载 */
    loading: {
      type: Boolean,
      default: () => false
    },
    /* 数据分页 */
    pagination: {
      type: Object,
      default: () => {
      }
    }
  },
  watch: {
    pagination: function () {
      this.T_pagination = this.pagination;
    }
  },
  data() {
    return {
      T_pagination: this.pagination || { limit: 10, page: 1, total: 0, show_page: false }
    };
  },
  methods: {
    /**
     * todo:页码切换
     * @param page
     * @private
     */
    currentChange: function (page) {
      this.$parent.currentPageChange(page);
    }
  }
};
</script>

<style lang="less">
.form {
  margin: 10px 0 -30px 20px !important;
}

.pagination {
  margin-top: 20px
}
</style>
