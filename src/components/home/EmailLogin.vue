<template>
  <div class="email-login">
    <div class="email-login__list">
      <div class="email-login__title">邮箱登录</div>
      <Mail @loginSYS="loginSYS" :show-cancel-button="true" @cancelLogin="cancelLogin"></Mail>
    </div>
  </div>
</template>

<script>
import Mail from '@/components/login/Mail';
export default {
  name: 'EmailLogin',
  components: { Mail },
  methods: {
    /**
     * todo:用戶登錄
     * @param form
     * @return {Promise<void>}
     */
    async loginSYS(form) {
      await this.$store.dispatch('login/loginSYS', form);
    },
    /**
     * todo:取消登录
     */
    cancelLogin() {
      this.$emit('cancelLogin');
    }
  }
};
</script>

<style scoped>

</style>
