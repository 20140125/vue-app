<template>
  <el-tabs v-model="tabModel.value" closable lazy type="border-card" @tab-click="goto" @tab-remove="removeTabs">
    <el-tab-pane
      v-for="item in authTabs"
      :key="item.value"
      :label="item.label"
      :name="item.value"
      :tab="item">
    </el-tab-pane>
    <el-card shadow="always">
      <router-view></router-view>
    </el-card>
  </el-tabs>
</template>

<script>
import { removeTabs } from '@/utils/func';

export default {
  name: 'Content',
  computed: {
    authTabs() {
      return this.$store.state.home.tabs;
    },
    tabModel() {
      return {...this.$store.state.home.tabModel};
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.$store.dispatch('home/addTabs', { label: this.$route.meta.title, value: this.$route.path });
    });
  },
  methods: {
    /**
     * todo:页面跳转
     * @return {Promise<void>}
     */
    async goto(value) {
      await this.$router.push({ path: value.props.name });
    },
    /**
     * todo:删除标签
     * @param item
     * @return {Promise<void>}
     */
    removeTabs(item) {
      removeTabs(item);
    }
  }
};
</script>
