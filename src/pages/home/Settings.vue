<template>
  <HomeLayout :back-button="true" :bottom-bar="false" header-title="系统设置">
    <template #body>
      <div class="grid">
        <div
          v-for="(item, index) in systemSetting"
          :key="index"
          :class="item.class"
          @click="getSetting(item)">
          <div class="info">{{ item.label }}</div>
          <div class="icon">
            <i class="el-icon-arrow-right icon"></i>
          </div>
        </div>
      </div>
      <el-collapse-transition v-if="emailLogin">
        <EmailLogin @cancelLogin="closeLoading"></EmailLogin>
      </el-collapse-transition>
    </template>
  </HomeLayout>
</template>

<script>
import HomeLayout from '@/components/HomeLayout';
import EmailLogin from '@/components/home/EmailLogin';

export default {
  name: 'Settings',
  components: { EmailLogin, HomeLayout },
  data() {
    return {
      emailLogin: false
    };
  },
  computed: {
    systemSetting() {
      return this.$store.state.index.systemSetting;
    }
  },
  methods: {
    /**
     * todo:获取配置
     * @param item
     */
    getSetting(item) {
      this.closeLoading(item);
    },
    /**
     * todo:关闭弹框
     * @param item
     */
    closeLoading(item = '') {
      const loading = this.$loading({
        lock: true,
        spinner: 'el-icon-loading',
        background: 'rgba(225, 225, 224, 0.8)'
      });
      setTimeout(() => {
        loading.close();
        this.emailLogin = item ? item.value === 'email-login' : false;
      }, 500);
    }
  }
};
</script>

<style scoped>

</style>
