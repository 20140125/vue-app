<template>
  <el-main style="text-align: center">
    <el-button type="primary" size="medium" plain @click="saveForm">{{ confirmButton || '确定' }}</el-button>
    <el-button type="default" size="medium" @click="$emit('closeDialog')" plain>{{ cancelButton || '取消' }}</el-button>
  </el-main>
</template>

<script>
export default {
  name: 'SubmitButton',
  props: ['confirmButton', 'cancelButton', 'form', 'reForm'],
  methods: {
    /**
     * todo:数据保存
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
