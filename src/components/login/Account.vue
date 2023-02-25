<template>
  <el-main id="account">
    <el-form ref="password" :model="form" :rules="rules" label-position="left">
      <el-form-item prop="email">
        <el-input v-model="form.email" clearable placeholder="请输入邮箱账号" >
          <template #prepend><i class="el-icon-user"></i></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model.trim="form.password" clearable placeholder="请输入密码"  type="password">
          <template #prepend><i class="el-icon-key"></i></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="verify_code">
        <el-input
          v-model.trim="form.verify_code"
          clearable
          maxlength="6"
          placeholder="请输入验证码">
          <template #prepend>
            <i class="el-icon-postcard"></i>
          </template>
          <template #append>
            <Identify :identify-code="accountAttr.verifyCode" @click="refreshCode"></Identify>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-footer style="text-align: center;height: 30px !important">
      <el-button plain type="primary" @click="loginSYS('password')">登录系统</el-button>
    </el-footer>
  </el-main>
</template>

<script>
import Identify from '../login/Identify';

export default {
  name: 'Account',
  components: { Identify },
  props: {
    accountAttr: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      form: { password: '', email: '', verify_code: '', loginType: 'password' },
      rules: {
        email: [{ required: true, message: '请输入邮箱账号', trigger: 'blur', type: 'email' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        verify_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    /**
     * 刷新验证码
     */
    async refreshCode() {
      let accountLoginError = 0;
      await this.$refs['password'].validateField(['email', 'password'], async(valid) => {
        if (valid) {
          accountLoginError += 1;
        }
      });
      if (accountLoginError === 0) {
        this.$emit('refreshCode');
      }
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
#account {
  .el-input-group__append {
    padding-top: 1px !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    border: none !important;
  }
}
</style>
