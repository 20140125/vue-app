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
        <div v-if="T_pagination.show_page" class="pagination">
          <el-pagination
            :current-page="T_pagination.page"
            :page-size="T_pagination.limit"
            :total="T_pagination.total"
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
import urls from '../api/urls';
import func from '../utils/func';

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
      T_pagination: this.pagination || { limit: 10, page: 1, total: 0, show_page: false },
      username: `${this.$store.state.username}【${urls.baseURL}】${func.setTime(Date.parse(new Date()))}`
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
