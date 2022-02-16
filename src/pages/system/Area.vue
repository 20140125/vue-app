<template>
  <BaseLayout :loading="loading">
    <template #header></template>
    <template #body>
      <AreaLists
        :areaLists="areaLists"
        @loadMORE="loadMORE"
        @getAreaWeather="getAreaWeather"
        @searchAreaLists="searchAreaLists">
      </AreaLists>
    </template>
    <template #dialog>
      <AreaDialog :sync-visible="syncVisible" :form="form" @getAreaLists="getAreaLists"></AreaDialog>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../../components/BaseLayout';
import AreaLists from '../../components/system/area/Lists';
import AreaDialog from '../../components/system/area/Dialog';

export default {
  name: 'Area',
  components: { AreaDialog, AreaLists, BaseLayout },
  data() {
    return {
      loading: true,
      syncVisible: false,
      areaLists: [],
      form: {}
    };
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getAreaLists();
    });
  },
  methods: {
    /**
     * todo:获取城市列表
     * @param parent_id
     */
    async getAreaLists(parent_id = 1) {
      this.loading = true;
      this.syncVisible = false;
      await this.$store.dispatch('area/getAreaLists', { parent_id: parent_id }).then(() => {
        this.areaLists = this.$store.state.area.areaLists;
        this.loading = false;
      });
    },
    /**
     * todo:加载更多
     * @param tree
     * @param treeNode
     * @param resolve
     * @return {Promise<void>}
     */
    async loadMORE(tree, treeNode, resolve) {
      await this.$store.dispatch('area/getChildrenLists', { parent_id: tree.id }).then(() => {
        resolve(this.$store.state.area.childrenLists);
        this.loading = false;
      });
    },

    /**
     * todo:搜索天气信息
     * @param search
     */
    searchAreaLists(search) {
      this.areaLists = [];
      this.$store.state.area.areaLists.forEach(item => {
        if (item.id === parseInt(search, 10) || item.name.indexOf(search) > -1) {
          this.areaLists.push(item);
        }
      });
    },
    /**
     * todo:查看天气详情
     * @param form
     */
    getAreaWeather(form) {
      this.form = { ...form };
      this.syncVisible = true;
    }
  }
};
</script>

<style scoped>

</style>
