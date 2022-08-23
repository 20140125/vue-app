<template>
  <el-card>
    <!-- 网站标题 -->
    <template #header>{{ headerTitle }}</template>
    <!-- 页面内容 -->
    <slot name="body"></slot>
    <!-- 底部导航栏 -->
    <div class="item">
      <div
        v-for="(item, index) in menuLists"
        :key="index"
        class="item-list"
        :class="`${item.path === route ? 'active' : ''}`"
        @click="goto(item)">
        <i :class="item.icon"></i>
        <div class="icon">{{ item.label }}</div>
      </div>
    </div>
    <!--返回顶部-->
    <ToUp></ToUp>
  </el-card>
</template>

<script>
import ToUp from '@/components/common/ToUp';

export default {
  name: 'HomeLayout',
  components: { ToUp },
  props: {
    headerTitle: {
      type: String,
      default: () => '魔盒逗图'
    }
  },
  data() {
    return {
      route: this.$route.path
    }
  },
  computed: {
    menuLists() {
      return this.$store.state.index.menuLists;
    }
  },
  methods: {
    goto(item) {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(225, 225, 224, 0.8)'
      });
      this.$router.push({ path: item.path });
      setTimeout(() => {
        loading.close();
      }, item.path === '/' ? 0 : 500)
    }
  }
};
</script>

<style lang="less">
@import '../assets/common.less';
</style>
