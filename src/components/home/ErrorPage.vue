<template>
  <el-result style="height: 85vh">
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
      <el-button type="primary" @click="setLogin">授权登录</el-button>
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
  },
  methods: {
    /**
     * 设置登录
     */
    setLogin() {
      this.$store.commit('UPDATE_MUTATIONS', { errorInfo: { code: '20003', message: 'Please Login System'} });
    }
  }
};
</script>

<style scoped>

</style>
