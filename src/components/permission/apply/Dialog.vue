<template>
  <div>
    <el-dialog v-model="visible" title="权限申请" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" center>
      <el-form :model="localForm" :ref="reForm" label-position="left" label-width="100px" :rules="rules">
        <el-form-item label="申请人：" prop="user_id">
          <el-select filterable v-model.number="localForm.user_id" clearable @change="$emit('getUserAuth', localForm.user_id)">
            <el-option v-for="(item,index) in permissionAttr.userLists" :label="item.username" :key="index" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请地址：" prop="href">
          <el-select filterable v-model="localForm.href" :disabled="reForm === 'update'">
            <el-option v-for="(item,index) in permissionAttr.authLists" :label="setAuthName(item)" clearable :key="index" :value="item.api" :disabled="item.disable"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间：" prop="expires">
          <el-date-picker v-model="localForm.expires" clearable :editable="false" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择申请时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="申请理由：" prop="desc">
          <el-input v-model.trim="localForm.desc" maxlength="200" placeholder="请输入申请理由" show-word-limit resize="none" :autosize="{ minRows: 4}" type="textarea"></el-input>
        </el-form-item>
        <SubmitButton :form="submitForm" :reForm="reForm" @closeDialog="$emit('getPermissionApply', { page: 1, limit: 15, show_page: true, refresh: true })"></SubmitButton>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SubmitButton from '@/components/common/SubmitForm';
import URLS from '@/api/urls';
import { toggle } from '@/components/mixins/toggle';

export default {
  name: 'PermissionDialog',
  components: { SubmitButton },
  props: {
    reForm: {
      type: String,
      default: () => 'created'
    },
    form: {
      type: Object,
      default: () => {
      }
    },
    permissionAttr: {
      type: Object,
      default: () => {
      }
    }
  },
  mixins: [toggle],
  data() {
    return {
      localForm: this.form,
      submitForm: {},
      rules: {
        user_id: [{ required: true, message: '请选择申请人', trigger: 'blur' }],
        href: [{ required: true, message: '请选择申请地址', trigger: 'blur' }],
        expires: [{ required: true, message: '请选择申请时间', trigger: 'change', type: 'date' }],
        desc: [{ required: true, message: '请输入申请理由', trigger: 'blur' }]
      }
    };
  },
  watch: {
    form() {
      this.localForm = this.form;
      this.$nextTick(() => {
        setTimeout(() => {
          this.submitForm = { model: this.localForm, $refs: this.$refs, url: this.reForm === 'created' ? URLS.permission.save : URLS.permission.update };
          this.localForm.user_id = this.$store.state.login.userInfo.id;
          this.$parent.$parent.$parent.getUserAuth(this.localForm.user_id);
        }, 1000);
      });
    }
  },
  methods: {
    /**
     * todo：设置权限名称
     * @param item
     * @return {String}
     */
    setAuthName(item) {
      return Array(item.level + 1).join('　　') + item.name;
    }
  }
};
</script>

<style scoped>

</style>
