<template>
  <HomeLayout header-title="个人信息" :show-bottom-bar="false">
    <template #body>
      <div class="grid">
        <div class="grid-item grid-item__image">
          <div class="info">头像</div>
          <div class="icon">
            <el-avatar :src="Permission.avatar_url" :size="60"></el-avatar>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">名字</div>
          <div class="icon">
            <span v-html="Permission.username"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">账号</div>
          <div class="icon">
            <span v-html="Permission.uuid"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">邮箱</div>
          <div class="icon">
            <span v-html="Permission.email"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">地区</div>
          <div class="icon">
            <span v-html="Permission.city"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">IP地址</div>
          <div class="icon">
            <span v-html="Permission.ip_address"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </template>
  </HomeLayout>
</template>

<script>
import HomeLayout from '@/components/HomeLayout';
export default {
  name: 'UsersCenter',
  components: { HomeLayout },
  created() {
    console.log(this.Permission);
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.Permission) {
        setTimeout(() => {
          this.$store.commit('UPDATE_MUTATIONS', { errorInfo: { code: '20003', message: 'Please Login System' } });
        }, 500);
      }
    });
  }
};
</script>

<style scoped>

</style>
