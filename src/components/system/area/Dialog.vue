<template>
  <div>
    <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="localForm.name"
      center>
      <el-form ref="area" :model="localForm">
        <el-form-item>
          <JsonView :items="localForm.forecast"></JsonView>
        </el-form-item>
      </el-form>
      <SubmitButton
        v-if="showSubmitButton && Permission.auth.indexOf(savePermission) > -1"
        :form="submitForm"
        reForm="area"
        @closeDialog="$emit('getAreaLists', { parent_id: 1, refresh: false })">
      </SubmitButton>
      <el-main v-else style="text-align: center">
        <el-button plain size="medium" type="primary" @click="$emit('closeDialog')">取消</el-button>
      </el-main>
    </el-dialog>
  </div>
</template>

<script>
import JsonView from '@/components/common/JsonView';
import { area } from '@/api/urls';
import SubmitButton from '@/components/common/SubmitForm';
import { toggle } from '@/components/mixins/toggle';

export default {
  name: 'AreaDialog',
  components: { SubmitButton, JsonView },
  props: {
    form: {
      type: Object,
      default: () => {
      }
    },
    showSubmitButton: {
      type: Boolean,
      default: () => true
    }
  },
  mixins: [toggle],
  data() {
    return {
      localForm: this.form,
      submitForm: {},
      savePermission: area.weather
    };
  },
  watch: {
    form() {
      this.localForm = this.form;
      this.$nextTick(() => {
        setTimeout(() => {
          this.submitForm = { model: this.localForm, $refs: this.$refs, url: area.weather };
        }, 1000);
      });
    }
  }

};
</script>

<style scoped>

</style>
