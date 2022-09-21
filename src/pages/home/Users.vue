<template>
  <HomeLayout header-title="个人中心">
    <template #body>
      <div class="grid">
        <div class="grid-item">
          <el-avatar :size="80" :src="Permission.avatar_url || ''"></el-avatar>
          <div class="info">{{ Permission.username || '' }}</div>
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
          this.$store.commit('UPDATE_MUTATIONS', { errorInfo: this.$store.state.index.error.login });
        }, 500);
      }
    });
  },
  methods: {
    /**
     * todo:页面跳转
     * @param item
     */
    async handleClick(item) {
      if (this.Permission) {
        item.path ? await this.$router.push({ path: item.path }) : (item.value === 'logout' ? this.logoutSYS() : '');
      }
    },
    /**
     * todo:登出系统
     */
    logoutSYS() {
      this.$confirm('登出系统', { showClose: false, type: 'success' }).then(async () => {
        await this.$store.dispatch('login/logoutSYS', { remember_token: this.$store.state.token });
        await this.$router.push({ path: '/home/users' });
      }).catch(() => {
        console.log('cancel logoutSYS');
      });
    }
  }
};
</script>
