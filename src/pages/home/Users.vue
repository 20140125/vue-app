<template>
  <HomeLayout header-title="个人中心">
    <template #body>
      <div class="grid">
        <div class="grid-item">
          <el-avatar :src="Permission.avatar_url" :size="100"></el-avatar>
          <div class="username">{{ Permission.username }}</div>
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
  created() {
    console.log(this.Permission)
  }
};
</script>
