<template>
  <el-button
    :icon="attr['icon'][model.status]"
    circle
    plain
    :type="attr['type'][model.status]"
    @click="changeStatus"
    size="medium">
  </el-button>
</template>

<script>
export default {
  name: 'StatusRadio',
  props: {
    /* 更新地址 */
    url: {
      type: String,
      default: () => ''
    },
    /* 待更新的记录 */
    statusModel: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      model: JSON.parse(JSON.stringify(this.statusModel)),
      attr: {
        icon: { 1: 'el-icon-check', 2: 'el-icon-close' },
        type: { 1: 'success', 2: 'danger' }
      }
    };
  },
  watch: {
    statusModel() {
      this.model = JSON.parse(JSON.stringify(this.statusModel));
    }
  },
  methods: {
    /**
     * todo:状态修改
     */
    async changeStatus() {
      this.$confirm('确认修改当前状态', {
        showClose: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.model.status = this.model.status === 1 ? 2 : 1;
        let payload = { url: this.url, model: { id: this.model.id, status: this.model.status, act: 'status' } };
        this.$store.dispatch('UPDATE_ACTIONS', payload).then(() => {
          /* 更新成功 */
          setTimeout(() => {
            this.$emit('closeDialog');
          }, 500);
        });
      }).catch(() => {
        this.$message.info('取消修改');
      });
    }
  }
};
</script>

<style scoped>

</style>
