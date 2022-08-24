<template>
  <el-result>
    <template #icon>
      <i :class="error.code !== '20000' ? 'el-icon-lock' : 'el-icon-unlock'" style="font-size: 100px"></i>
    </template>
    <template #title>
      <i style="font-size: 30px; font-family: consolas, sans-serif" v-html="error.code"></i>
    </template>
    <template #subTitle>
      <i style="font-size: 27px; font-family: consolas, sans-serif" v-html="error.message.replace(/^./, w => w.toUpperCase())"></i>
    </template>
    <template #extra>
      <span style="color: #409EFF"></span>
    </template>
  </el-result>
</template>

<script>
export default {
  name: 'ErrorPage',
  computed: {
    error() {
      return this.$store.state.errorInfo;
    }
  }
};
</script>

<style scoped>

</style>
