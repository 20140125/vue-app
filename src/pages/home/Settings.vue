<template>
  <HomeLayout :back-button="true" :bottom-bar="false" header-title="系统设置">
    <template #body>
      <div class="grid">
        <div
          v-for="(item, index) in systemSetting"
          :key="index"
          :class="item.class" @click="loading">
          <div class="info">{{ item.label }}</div>
          <div class="icon">
            <i class="el-icon-arrow-right icon"></i>
          </div>
        </div>
      </div>
    </template>
  </HomeLayout>
</template>

<script>
import HomeLayout from '@/components/HomeLayout';

export default {
  name: 'Settings',
  components: { HomeLayout },
  computed: {
    systemSetting() {
      return this.$store.state.index.systemSetting;
    }
  },
  methods: {
    loading() {
      const loading = this.$loading({
        lock: true,
        text: '敬请期待。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(225, 225, 224, 0.8)'
      });
      setTimeout(() => {
        loading.close();
      }, 500);
    }
  }
};
</script>

<style scoped>

</style>
