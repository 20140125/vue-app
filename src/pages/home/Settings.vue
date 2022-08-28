<template>
  <HomeLayout header-title="系统设置" :show-bottom-bar="false">
    <template #body>
      <div class="grid">
        <div class="grid-item grid-item__image">
          <div class="info">头像</div>
          <div class="icon">
            <el-avatar :src="Permission.avatar_url" :size="60"></el-avatar>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">居住地址</div>
          <div class="icon">
            <span v-html="setLocal(userSetting.ip_address || [])"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">所在地</div>
          <div class="icon">
            <span v-html="setLocal(userSetting.local || [])"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">个性签名</div>
          <div class="icon">
            <span v-html="userSetting.desc"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">个人标签</div>
          <div class="icon">
            <span v-html="userSetting.tags"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">系统通知</div>
          <div class="icon">
            <span v-html="userSetting.notice_status ? '是' : '否'"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">切换账号</div>
          <div class="icon" @click="changeAccount">
            <span v-html="Permission.username"></span>
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
  name: 'Settings',
  components: { HomeLayout },
  computed: {
    userSetting() {
      return this.$store.state.users.userCenter;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      if (!this.Permission) {
        setTimeout(() => {
          this.$store.commit('UPDATE_MUTATIONS', { errorInfo: { code: '20003', message: 'Please Login System' } });
        }, 500);
        return false;
      }
      await this.getUserSettings();
    });
  },
  methods: {
    /**
     * todo:获取用户设置
     * @returns {Promise<void>}
     */
    async getUserSettings() {
      await this.$store.dispatch('users/getUserCenter', {});
    },
    /**
     * todo:设置文本
     * @param value
     * @returns {string}
     */
    setLocal(value) {
      return value.join('').replace('中华人民共和国', '');
    },
    changeAccount() {
      console.log('account change');
    }
  }
};
</script>

<style scoped>

</style>
