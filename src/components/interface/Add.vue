<template>
  <div>
    <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
      title="编辑接口">
      <el-form :ref="reForm" :model="localForm" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model.trim="localForm.name" placeholder="请输入接口分类名称"></el-input>
        </el-form-item>
        <el-form-item label="上级分类：" prop="pid">
          <el-select v-model.number="localForm.pid" placeholder="上级分类">
            <el-option v-if="localForm.pid === 0" :value="0" label="分类名称" selected></el-option>
            <el-option
              v-for="(item,index) in categoryLists"
              :key="index"
              :label="setCategoryName(item)"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <SubmitButton :form="submitForm" :reForm="reForm" @closeDialog="$emit('getInterfaceCategory')"></SubmitButton>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { toggle } from '@/components/mixins/toggle';
import SubmitButton from '@/components/common/SubmitForm';
import URLS from '@/api/urls';

export default {
  name: 'AddCategory',
  components: { SubmitButton },
  props: ['categoryLists', 'form', 'reForm'],
  data() {
    return {
      localForm: this.form,
      submitForm: {},
      rules: {
        name: [{ required: true, message: '请输入接口分类名称', trigger: 'blur' }],
        pid: [{ required: true, message: '请选择上级分类名称', trigger: 'change' }]
      }
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
            url: this.reForm === 'created' ? URLS.interfaceCategory.save : URLS.interfaceCategory.update
          };
        }, 1000);
      });
    }
  },
  methods: {
    /**
     * 设置接口名称
     * @param item
     * @return {string}
     */
    setCategoryName(item) {
      return Array(item.level + 1).join('　　') + item.name;
    }
  }
};
</script>

<style scoped>

</style>
