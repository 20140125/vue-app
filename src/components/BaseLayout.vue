<template>
  <div
    v-water-mark="{ text: username, textColor: 'rgba(0, 0, 0, .2)', font: '25px consolas, sans-serif', row: 130, col: 850 }">
    <el-skeleton :loading="loading" :rows="5" animated>
      <el-form :inline="true" class="form">
        <slot name="header"></slot>
      </el-form>
      <!--主题信息-->
      <el-main>
        <slot name="body"></slot>
        <div v-if="baseLayoutPagination.show_page" class="pagination">
          <el-pagination
            :current-page="baseLayoutPagination.page"
            :page-size="baseLayoutPagination.limit"
            :total="baseLayoutPagination.total"
            layout="total, prev, pager, next"
            @current-change="currentChange">
          </el-pagination>
        </div>
      </el-main>
      <!--弹框信息-->
      <slot name="dialog"></slot>
    </el-skeleton>
  </div>
</template>

<script>
import URLS from '../api/urls';
import { setTime } from '@/utils/func';

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
      this.baseLayoutPagination = this.pagination;
    }
  },
  data() {
    return {
      baseLayoutPagination: this.pagination || { limit: 10, page: 1, total: 0, show_page: false },
      username: `${this.$store.state.baseLayout.username}【${(this.Permission || {}).local || URLS.baseURL}】${(this.Permission || {}).now_time || setTime(new Date())}`
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
