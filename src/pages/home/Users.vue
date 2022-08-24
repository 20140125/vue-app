<template>
  <HomeLayout header-title="个人中心">
    <template #body>
      <div class="grid">
        <div class="grid-item">
          <el-avatar :src="(Permission || {}).avatar_url || ''" :size="80"></el-avatar>
          <div class="info">{{ (Permission || {}).username || '' }}</div>
        </div>
        <div class="grid-item" v-for="(item, index) in accountSetting" :key="index">
          <i :class="`${item.icon}`"></i>
          <div class="info">{{ item.label }}</div>
          <i class="el-icon-arrow-right icon"></i>
        </div>
      </div>
    </template>
  </HomeLayout>
</template>

<script>
import HomeLayout from '@/components/HomeLayout';

export default {
  name: 'Users',
  components: { HomeLayout },
  computed: {
    accountSetting() {
      return this.$store.state.index.accountSetting;
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.Permission) {
         this.$store.commit('UPDATE_MUTATIONS', { errorInfo: { code: '20003', message: 'Please Login System'} });
      }
    });
  }
};
</script>
