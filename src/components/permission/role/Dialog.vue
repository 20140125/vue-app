<template>
  <div>
    <el-dialog v-model="visible" :title="reForm === 'created' ? '添加角色' : '修改角色'" :show-close="false"
               :close-on-click-modal="false" :close-on-press-escape="false" center>
      <el-form :model="localForm" :ref="reForm" label-position="left" label-width="100px" :rules="rules">
        <el-form-item label="角色名称：" prop="role_name">
          <el-input placeholder="请输入角色名称" v-model.trim="localForm.role_name"></el-input>
        </el-form-item>
        <el-form-item label="权限列表：" prop="auth_ids">
          <el-transfer
            :titles="['所有', '拥有']"
            :data="authMode.authLists"
            style="text-align: left; display: inline-block"
            v-model="authMode.defaultChecked"
            @change="handleChange"
            filterable>
          </el-transfer>
        </el-form-item>
        <SubmitButton :form="submitForm" :reForm="reForm"
                      @closeDialog="$emit('getRoleLists', { page: 1, limit: 15, refresh: true, total: 0 })"></SubmitButton>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SubmitButton from '@/components/common/SubmitForm';
import URLS from '@/api/urls';
import { toggle } from '@/components/mixins/toggle';

export default {
  name: 'RoleDialog',
  components: { SubmitButton },
  props: ['form', 'reForm', 'authAttr'],
  data() {
    return {
      localForm: { ...this.form },
      submitForm: {},
      rules: {
        role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        auth_ids: [{ required: true, message: '请选择权限', trigger: 'change', type: 'array' }]
      },
      authMode: { ...this.authAttr }
    };
  },
  mixins: [toggle],
  watch: {
    form() {
      this.localForm = this.form;
      this.$nextTick(() => {
        setTimeout(() => {
          this.submitForm = {
            model: this.localForm,
            $refs: this.$refs,
            url: this.reForm === 'created' ? URLS.role.save : URLS.role.update
          };
        }, 1000);
      });
    },
    authAttr() {
      this.authMode = { ...this.authAttr };
    }
  },
  methods: {
    /**
     * todo:修改值
     * @param value      当前值
     * @param direction  数据移动的方向（'left' / 'right'）
     * @param movedKeys  发生移动的数据 key 数组
     */
    handleChange(value, direction, movedKeys) {
      switch (direction) {
        /* 删除 */
        case 'left':
          movedKeys.forEach((item) => {
            this.authMode.defaultChecked.splice(this.authMode.defaultChecked.indexOf(parseInt(item)), 1);
          });
          break;
        /* 添加 */
        case 'right':
          movedKeys.forEach((item) => {
            this.authMode.defaultChecked.push(parseInt(item));
          });
          break;
      }
      this.localForm.auth_ids = [...new Set(this.authMode.defaultChecked)];
    }
  }
};
</script>

<style scoped>

</style>
