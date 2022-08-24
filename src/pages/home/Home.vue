<template>
  <HomeLayout>
    <template #body>
      <!--站内通知-->
      <WebPush
        :closable="false"
        :interval="3000"
        :show-weather="false"
        alert-type="success"
        effect="dark">
      </WebPush>
      <!--列表页-->
      <Lists :load-more="loadMore" style="padding-bottom: 80px;"></Lists>
    </template>
  </HomeLayout>
</template>

<script>
import WebPush from '@/components/base/WebPush';
import HomeLayout from '@/components/HomeLayout';
import Lists from '@/components/home/Lists';

export default {
  name: 'HomeIndex',
  components: { Lists, HomeLayout, WebPush },
  data() {
    return {
      pagination: { page: 1, limit: 20, source: 'h5', type: 'index' },
      loadMore: []
    };
  },
  computed: {
    /* 图片列表 */
    imageLists() {
      return this.$store.state.index.imageLists.index.lists;
    },
    /* 总记录数 */
    total() {
      return this.$store.state.index.imageLists.index.total;
    }
  },
  /* 卸载节点 */
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getImageLists(this.pagination);
    });
  },
  methods: {
    /**
     * todo:获取图片列表
     * @param pagination
     * @returns {Promise<*>}
     */
    async getImageLists(pagination) {
      const loading = this.$loading({
        lock: true,
        text: '玩命加载中。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(225, 225, 224, 0.8)'
      });
      await this.$store.dispatch('index/getImageLists', pagination);
      this.loadMore = this.loadMore.concat(this.imageLists);
      loading.close();
    },
    /**
     * todo:下滑加载数据
     * @returns {Promise<void>}
     */
    async handleScroll() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      if (scrollTop >= (scrollHeight - 1000 - (10 * this.pagination.page)) && this.imageLists.length < this.total) {
        this.pagination.page = this.pagination.page + 1;
        await this.getImageLists(this.pagination);
      }
    }
  }
};
</script>
