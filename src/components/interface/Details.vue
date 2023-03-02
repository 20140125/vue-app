<template>
  <div id="interface">
    <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :width="localForm.source === 'json' ? '1200px' : '1500px'"
      center
      title="编辑接口">
      <div v-if="localForm.source === 'json'">
        <Json ref="json" :categoryLists="categoryLists" :form="localForm" :reForm="reForm"></Json>
        <InterfaceLog :lists="localForm.apiLog"></InterfaceLog>
        <SubmitButton
          :form="submitForm"
          :reForm="reForm"
          @closeDialog="$emit('getInterfaceCategory', true)">
        </SubmitButton>
      </div>
      <div v-if="localForm.source === 'markdown'" class="markdown">
        <MarkDown
          :markdown="localForm.markdown"
          :saveHandle="saveHandle">
        </MarkDown>
        <InterfaceLog :lists="localForm.apiLog"></InterfaceLog>
        <el-main>
          <el-button plain @click="$emit('getInterfaceCategory', true)">取消</el-button>
        </el-main>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SubmitButton from '@/components/common/SubmitForm';
import Json from '@/components/interface/Json';
import { api } from '@/api/urls';
import MarkDown from '@/components/common/MarkDown';
import { toggle } from '@/components/mixins/toggle';
import InterfaceLog from '@/components/interface/Log';

export default {
  name: 'InterfaceDetails',
  components: { InterfaceLog, MarkDown, Json, SubmitButton },
  props: ['form', 'categoryLists', 'reForm'],
  data() {
    return {
      submitForm: {},
      localForm: this.form
    };
  },
  mixins: [toggle],
  watch: {
    form() {
      this.localForm = this.form;
      if (this.localForm.source === 'json') {
        setTimeout(() => {
          this.submitForm = {
            model: this.localForm,
            $refs: this.$refs.json.$refs,
            url: this.reForm === 'created' ? api.save : api.update
          };
        }, 1000);
      }
    }
  },
  methods: {
    /**
     * markdown数据保存
     * @param text
     * @param html
     */
    saveHandle(text, html) {
      this.localForm.markdown = text;
      this.localForm.html = html;
      this.$store.dispatch('UPDATE_ACTIONS', {
        url: this.reForm === 'created' ? api.save : api.update,
        model: this.localForm
      }).then(() => {
        this.$emit('getInterfaceCategory', true);
      });
    }
  }
};
</script>

<style lang="less">
#interface {
  .v-md-editor {
    margin-bottom: 20px;
  }

  .markdown {
    .el-main {
      text-align: center;
    }
  }
}
</style>
