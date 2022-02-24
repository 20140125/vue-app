<template>
  <BaseLayout :loading="loading">
    <template #body>
      <el-result>
        <template #icon>
          <i :class="error.code !== '200' ? 'el-icon-lock' : 'el-icon-unlock'" style="font-size: 100px"></i>
        </template>
        <template #title>
          <i v-html="error.code" style="font-size: 30px; font-family: consolas, sans-serif"></i>
        </template>
        <template #subTitle>
          <i v-html="error.message" style="font-size: 40px; font-family: consolas, sans-serif"></i>
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
import func from "../utils/func";

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
      return this.$store.state.error || { code: '20000', message: 'Successfully' };
    }
  },
  mounted() {
    this.$nextTick(async () => {
      const timer = setInterval(() => {
        this.timeout -= 1;
        if (!this.timeout) {
          func.removeTabs(this.$store.state.home.tabModel.value).then(() => {
            clearInterval(timer);
          })
        }
      }, 1000);
    });
  }
};
</script>

<style scoped>

</style>
