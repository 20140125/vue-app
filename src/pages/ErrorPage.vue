<template>
  <el-result
    icon="error"
    title="Error Tip"
    sub-title="Please follow the instructions">
    <template #extra>
      <el-button type="primary">Back</el-button>
    </template>
  </el-result>
</template>

<script>
export default {
  name: 'ErrorPage',
  computed: {
    error() {
      return this.$store.state.error || {};
    }
  }
};
</script>

<style scoped>

</style>
