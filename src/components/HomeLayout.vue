<template>
  <el-card shadow="always" v-water-mark="{ text: text, textColor: 'rgba(0, 0, 0, .2)', font: '20px consolas, sans-serif', row: 100, col: 500 }">
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
    <!-- 授权登录 -->
    <OauthLogin :showOAuth="error.code !== '20000'"></OauthLogin>
  </el-card>
</template>

<script>
import ToUp from '@/components/common/ToUp';
import OauthLogin from '@/components/home/OauthLogin';

export default {
  name: 'HomeLayout',
  components: { ToUp, OauthLogin },
  props: {
    headerTitle: {
      type: String,
      default: () => '魔盒逗图'
    }
  },
  data() {
    return {
      route: this.$route.path,
      text: this.$store.state.baseLayout.username
    };
  },
  computed: {
    menuLists() {
      return this.$store.state.index.menuLists;
    },
    error() {
      return this.$store.state.errorInfo;
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
      }, item.path === '/' ? 0 : 500);
    }
  }
};
</script>

<style lang="less">
@import '../assets/common.less';
</style>
