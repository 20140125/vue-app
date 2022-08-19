<template>
  <BaseLayout :loading="loading">
    <template #body>
      <el-result>
        <template #icon>
          <i :class="error.code !== '200' ? 'el-icon-lock' : 'el-icon-unlock'" style="font-size: 100px"></i>
        </template>
        <template #title>
          <i style="font-size: 30px; font-family: consolas, sans-serif" v-html="error.code"></i>
        </template>
        <template #subTitle>
          <i style="font-size: 40px; font-family: consolas, sans-serif" v-html="error.message"></i>
        </template>
        <template #extra>
          <span style="color: #409EFF">{{ timeout }}秒后自动跳转</span>
        </template>
      </el-result>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../components/BaseLayout';
import { removeTabs } from '@/utils/func';

export default {
  name: 'Result',
  components: { BaseLayout },
  data() {
    return {
      loading: false,
      timeout: 3
    };
  },
  computed: {
    error() {
      return this.$store.state.error || { code: '20000', message: 'successfully' };
    }
  },
  mounted() {
    this.$nextTick(async () => {
      const timer = setInterval(async () => {
        this.timeout -= 1;
        if (!this.timeout) {
          await removeTabs(this.$store.state.home.tabModel.value).then(() => {
            clearInterval(timer);
          });
        }
      }, 1000);
    });
  }
};
</script>

<style scoped>

</style>
