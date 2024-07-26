<template>
  <div id="users">
    <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="reForm === 'created' ? '添加管理员' : '修改管理员'"
      center>
      <el-form :ref="reForm" :model="localForm" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model.trim="localForm.username"></el-input>
        </el-form-item>
        <el-form-item class="avatar-url" label="用户头像：" prop="avatar_url">
          <CommonUpload
            :avatar-image="{ username: localForm.username, avatar_url: localForm.avatar_url, size: 100 }"
            :file-size="100"
            :img-height="0"
            :img-width="0"
            :upload-controls="{ button_type: 'avatar', show_file_list: false, show_tips: false }"
            :uploadSuccess="uploadSuccess">
          </CommonUpload>
        </el-form-item>
        <el-form-item label="登录密码：" prop="password">
          <el-input v-model.trim="localForm.password" placeholder="请输入登录密码" show-password type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱账号：" prop="email">
          <el-input v-model.trim="localForm.email" placeholder="请输入邮箱账号"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone_number">
          <el-input v-model.number="localForm.phone_number" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户角色：" prop="role_id">
          <el-select v-model.number="localForm.role_id" filterable placeholder="请选择用户角色">
            <el-option
              v-for="(role,index) in usersAttr['roleLists']"
              :key="index"
              :label="role.role_name"
              :value="role.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="is-required" label="允许登录：">
          <el-switch
            v-model.number="localForm.status"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <SubmitButton
          :form="submitForm"
          :reForm="reForm"
          @closeDialog="$emit('getUsersLists', { page: 1, limit: 15, refresh: true, total: 0 })">
        </SubmitButton>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SubmitButton from '@/components/common/SubmitForm';
import CommonUpload from '@/components/common/CommonUpload';
import { toggle } from '@/components/mixins/toggle';
import { users } from '@/api/urls';

export default {
  name: 'UsersDialog',
  components: { CommonUpload, SubmitButton },
  mixins: [toggle],
  props: ['form', 'reForm', 'usersAttr'],
  data() {
    return {
      localForm: this.form,
      submitForm: {},
      rules: {
        username: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
        avatar_url: [{ required: true, message: '请上传用户头像', trigger: 'change' }],
        email: [{ required: true, message: '请输入邮箱账号', trigger: 'blur', type: 'email' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
        phone_number: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        role_id: [{ required: true, message: '请选择用户角色', trigger: 'change' }]
      }
    };
  },
  watch: {
    form() {
      this.localForm = this.form;
      this.$nextTick(() => {
        setTimeout(() => {
          this.submitForm = {
            model: this.localForm,
            $refs: this.$refs,
            url: users.update
          };
        }, 1000);
      });
    }
  },
  methods: {
    /**
     * 图片上传成功
     * @param response
     */
    uploadSuccess(response) {
      this.localForm.avatar_url = response?.item?.lists?.src || '';
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
}
</style>
