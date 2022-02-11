<template>
  <div>
    <el-dialog v-model="visible" :title="reForm === 'created' ? '添加权限' : '修改权限'" :show-close="false"
               :close-on-click-modal="false" :close-on-press-escape="false" center>
      <el-form :model="localForm" :ref="reForm" label-position="left" label-width="100px" :rules="rules">
        <el-form-item label="权限名称：" prop="name">
          <el-input placeholder="请输入权限名称" v-model.trim="localForm.name"></el-input>
        </el-form-item>
        <el-form-item label="权限地址：" prop="href">
          <el-input placeholder="请输入权限名称(/admin/auth/index)" v-model.trim="localForm.href"
                    :readonly="reForm === 'updated'"></el-input>
        </el-form-item>
        <el-form-item label="权限上级：" prop="pid">
          <el-select placeholder="请选择权限上级" filterable v-model.number="localForm.pid">
            <el-option label="默认权限" :value="0" v-if="localForm.pid === 0" selected></el-option>
            <el-option v-for="(item, index) in authLists" :disabled="item.id === localForm.id" :key="index"
                       :label="setAuthName(item)" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限状态：" class="is-required">
          <el-switch v-model.number="localForm.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1"
                     :inactive-value="2"></el-switch>
        </el-form-item>
        <SubmitButton :form="submitForm" :reForm="reForm" @closeDialog="$emit('getAuthLists', true)"></SubmitButton>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SubmitButton from '@/components/common/SubmitForm';
import URLS from '@/api/urls';
import { toggle } from '@/components/mixins/toggle';

export default {
  name: 'AuthDialog',
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
    authLists: {
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
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        href: [{ required: true, message: '请输入权限链接', trigger: 'blur' }],
        pid: [{ required: true, message: '请选择上级权限', trigger: 'blur', type: 'number' }]
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
            url: this.reForm === 'created' ? URLS.auth.save : URLS.auth.update
          };
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
