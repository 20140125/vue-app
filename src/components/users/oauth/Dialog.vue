<template>
  <div id="users">
    <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
      title="邮箱绑定">
      <el-form :ref="reForm" :model="localForm" :rules="rules" label-position="left" label-width="100px">
        <el-form-item class="is-required" label="账户昵称：">
          <el-input v-model.trim="localForm.username" readonly></el-input>
        </el-form-item>
        <el-form-item label="邮箱账号：" prop="email">
          <el-input v-model.trim="localForm.email" clearable placeholder="请输入邮箱账号"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="code">
          <el-input v-model.number="localForm.code" :readonly="!localForm.email" maxlength="8" placeholder="请输入邮箱验证码">
            <template #append>
              <el-tooltip class="item" content="请确定已经输入正确的邮箱账号" effect="dark" placement="top-start">
                <el-button :disabled="disabled" @click="getMailCode">{{ codeValue }}</el-button>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>
        <SubmitButton
          :form="submitForm"
          :reForm="reForm"
          @closeDialog="$emit('getOAuthLists', { page: 1, limit: 15, refresh: true, total: 0 })">
        </SubmitButton>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SubmitButton from '@/components/common/SubmitForm';
import { toggle } from '@/components/mixins/toggle';
import { oauth } from '@/api/urls';

export default {
  name: 'OAuthDialog',
  components: { SubmitButton },
  mixins: [toggle],
  props: ['form', 'reForm'],
  data() {
    return {
      localForm: this.form,
      codeValue: '获取验证码',
      mailLogin: this.$store.state.login.mailLogin,
      rules: {
        email: [{ required: true, message: '请输入邮箱账号', trigger: 'blur', type: 'email' }],
        code: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur', type: 'number' }]
      },
      submitForm: {},
      disabled: false
    };
  },
  watch: {
    form() {
      this.localForm = this.form;
      this.$nextTick(() => {
        setTimeout(() => {
          this.submitForm = {
            model: { email: this.localForm.email, code: this.localForm.code, id: this.localForm.id },
            $refs: this.$refs,
            url: oauth.update
          };
        }, 1000);
      });
    }
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
      this.times = 60;
    }, 1000);
  },
  methods: {
    /**
     * 获取邮箱验证码
     */
    async getMailCode() {
      await this.$refs[this.reForm].validateField(['email'], async(valid) => {
        if (valid) {
          this.disabled = false;
          return false;
        }
        if (this.mailLogin) {
          this.disabled = true;
          this.codeValue = this.times-- + 'S重新获取';
          return false;
        }
        await this.$store.dispatch('login/sendMail', { email: this.localForm.email });
      });
    }
  }
};
</script>

<style lang="less">
#users {
  .avatar-url {
    display: flex;
    align-items: center;
    position: relative;

    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .el-input-group__append {
    background-color: #409EFF;
    color: #FFFFFF;
  }
}
</style>
