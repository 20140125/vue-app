<template>
  <el-skeleton :loading="loading" :rows="5" animated>
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in timeLine"
        :key="index"
        :timestamp="item.timestamp"
        :type="item.type"
        placement="top">
        <el-card shadow="always">{{ item.content }}</el-card>
      </el-timeline-item>
    </el-timeline>
  </el-skeleton>
</template>

<script>
export default {
  name: 'Timeline',
  data() {
    return {
      loading: true
    };
  },
  computed: {
    timeLine() {
      return this.$store.state.home.timeline;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      if (this.$store.state.baseLayout.token || window.localStorage.getItem('token')) {
        await this.$store.dispatch('home/getTimeLine', { page: 1, limit: 11 }).then(() => {
          this.loading = false;
        });
      }
    });
  }
};
</script>

<style scoped>

</style>
