<template>
  <BaseLayout>
    <template #body>
      <SpiderIndex :spiderConfig="spiderConfig"></SpiderIndex>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout';
import SpiderIndex from '@/components/spider/Lists';

export default {
  name: 'Spider',
  components: { SpiderIndex, BaseLayout },
  computed: {
    spiderConfig() {
      return this.$store.state.spider.spiderConfig;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.$store.dispatch('spider/getSpiderConfiguration');
    });
  }
};
</script>

<style scoped>

</style>
