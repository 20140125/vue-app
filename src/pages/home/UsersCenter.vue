<template>
  <HomeLayout :back-button="true" :bottom-bar="false" header-title="个人信息">
    <template #body>
      <div class="grid">
        <div class="grid-item grid-item__image">
          <div class="info">头像</div>
          <div class="icon">
            <el-avatar :src="Permission.avatar_url"></el-avatar>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">名字</div>
          <div class="icon">
            <span v-html="Permission.username"></span>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">账号</div>
          <div class="icon">
            <span v-html="Permission.uuid"></span>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">邮箱</div>
          <div class="icon">
            <span v-html="Permission.email"></span>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">IP地址</div>
          <div class="icon">
            <span v-html="Permission.ip_address"></span>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">地区</div>
          <div class="icon">
            <span v-html="Permission.city"></span>
          </div>
        </div>
        <div class="grid-item" @click="getUserCenter">
          <div class="info">更多信息</div>
          <div class="icon">
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
  mounted() {
    this.$nextTick(() => {
      if (!this.Permission) {
        this.$router.push({ path: '/home/users' });
      }
    });
  },
  methods: {
    /**
     * todo:获取个人中心信息
     */
    getUserCenter() {
      this.$router.push({ path: '/home/users/more' });
    }
  }
};
</script>

<style scoped>

</style>
