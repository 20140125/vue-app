<template>
  <el-main id="mail">
    <el-form ref="mail" :model="form" :rules="rules">
      <el-form-item prop="email">
        <el-input v-model.trim="form.email" clearable placeholder="请输入邮箱账号">
          <template #prepend>
            <i class="el-icon-s-custom"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="verify_code">
        <el-input
          v-model.number="form.verify_code"
          :readonly="!form.email"
          clearable
          maxlength="8"
          placeholder="请输入邮箱验证码">
          <template #append>
            <el-button
              :disabled="disabled"
              type="primary"
              @click="getMailCode">
              {{ codeValue }}
            </el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-footer style="text-align: center;height: 30px !important">
      <el-button plain type="primary" @click="loginSYS('mail')">登录系统</el-button>
      <el-button plain @click="$emit('cancelLogin')" v-if="showCancelButton">取消</el-button>
    </el-footer>
  </el-main>
</template>

<script>
export default {
  name: 'Mail',
  props: {
    showCancelButton: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      form: { email: '', verify_code: '', loginType: 'mail' },
      codeValue: '获取验证码',
      mailLogin: this.$store.state.login.mailLogin,
      rules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur', type: 'email' }],
        verify_code: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]
      },
      disabled: false
    };
  },
  created() {
    /**
     * 邮箱验证码定时器
     * @return {Promise<void>}
     */
    setInterval(() => {
      if (this.times >= 0 && this.mailLogin) {
        this.getMailCode();
        return false;
      }
      this.codeValue = '获取验证码';
      this.disabled = false;
      this.times = 60;
    }, 1000);
  },
  methods: {
    /**
     * 获取邮箱验证码
     */
    async getMailCode() {
      await this.$refs['mail'].validateField(['email'], async(valid) => {
          if (valid) {
            return false;
          }
          if (this.mailLogin) {
            this.codeValue = this.times-- + 'S重新获取';
            this.disabled = true;
            return false;
          }
          await this.$store.dispatch('login/sendMail', { email: this.form.email }).then(() => {
            this.$message.success('验证码发送成功');
          });
      });
    },
    /**
     * 登录系统
     * @param formName
     */
    loginSYS(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.$emit('loginSYS', this.form);
      });
    }
  }
};
</script>

<style lang="less">
#mail {
  .el-input-group__append {
    background-color: #409EFF;
    color: #FFFFFF;
  }
}
</style>
