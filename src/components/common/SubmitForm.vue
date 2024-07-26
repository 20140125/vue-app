<template>
  <el-main style="text-align: center">
    <el-button plain size="medium" type="primary" @click="saveForm">{{ confirmButton || '确定' }}</el-button>
    <el-button plain size="medium" type="default" @click="$emit('closeDialog')">{{ cancelButton || '取消' }}</el-button>
  </el-main>
</template>

<script>
export default {
  name: 'SubmitButton',
  props: ['confirmButton', 'cancelButton', 'form', 'reForm'],
  methods: {
    /**
     * 数据保存
     */
    async saveForm() {
      await this.form.$refs[this.reForm].validate(valid => {
        if (!valid) {
          return false;
        }
        this.$store.dispatch('UPDATE_ACTIONS', this.form).then(() => {
          /* 更新成功 */
          setTimeout(() => {
            this.$emit('closeDialog');
          }, 500);
        });
      });
    }
  }
};
</script>

<style scoped>

</style>
