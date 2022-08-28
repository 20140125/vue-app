<template>
  <HomeLayout header-title="个人中心">
    <template #body>
      <div class="grid">
        <div class="grid-item">
          <el-avatar :size="80" :src="(Permission || {}).avatar_url || ''"></el-avatar>
          <div class="info">{{ (Permission || {}).username || '' }}</div>
        </div>
        <div
          v-for="(item, index) in accountSetting"
          :key="index"
          class="grid-item"
          @click="handleClick(item)">
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
        setTimeout(() => {
          this.$store.commit('UPDATE_MUTATIONS', { errorInfo: { code: '20003', message: 'Please Login System' } });
        }, 500);
      }
    });
  },
  methods: {
    handleClick(item) {
      this.$router.push({ path: item.path });
    }
  }
};
</script>
