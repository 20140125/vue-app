<template>
  <div>
    <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
      title="权限申请">
      <el-form :ref="reForm" :model="localForm" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="申请人：" prop="user_id">
          <el-select
            v-model.number="localForm.user_id"
            clearable filterable
            @change="$emit('getUserAuth', localForm.user_id)">
            <el-option
              v-for="(item,index) in permissionAttr.userLists"
              :key="index"
              :label="item.username"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请地址：" prop="href">
          <el-tree
            :data="permissionAttr.authLists"
            :props="props"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            :default-checked-keys="permissionAttr.checkedKeys"
            highlight-current>
          </el-tree>
        </el-form-item>
        <el-form-item label="过期时间：" prop="expires">
          <el-date-picker
            v-model="localForm.expires"
            :editable="false"
            clearable
            size="large"
            placeholder="选择过期时间"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请理由：" prop="desc">
          <el-input
            v-model.trim="localForm.desc"
            :autosize="{ minRows: 4}"
            maxlength="200"
            placeholder="请输入申请理由"
            resize="none"
            show-word-limit
            type="textarea">
          </el-input>
        </el-form-item>
        <SubmitButton
          :form="submitForm"
          :reForm="reForm"
          @closeDialog="$emit('getPermissionApply', { page: 1, limit: 15, show_page: true, refresh: true })">
        </SubmitButton>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SubmitButton from '../../common/SubmitForm';
import URLS from '../../../api/urls';
import { toggle } from '../../mixins/toggle';

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
      },
      // todo:树形插件属性
      props: {
        children: '__children',
        label: 'name',
        value: 'api',
        disabled: 'disable'
      }
    };
  },
  watch: {
    form() {
      this.localForm = this.form;
      this.$nextTick(() => {
        setTimeout(async () => {
          this.submitForm = {
            model: this.localForm,
            $refs: this.$refs,
            url: this.reForm === 'created' ? URLS.permission.save : URLS.permission.update
          };
          this.localForm.user_id = this.$store.state.login.userInfo.id;
          await this.$parent.$parent.$parent.getUserAuth(this.localForm.user_id);
        }, 1000);
      });
    }
  }
};
</script>

<style scoped>

</style>
