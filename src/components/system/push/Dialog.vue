<template>
  <div>
    <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="reForm === 'created' ? '添加站内通知' : '修改站内通知'"
      center>
      <el-form :ref="reForm" :model="localForm" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="目标用户：" prop="username">
          <el-select v-model="localForm.username" filterable placeholder="请选择目标用户" @change="handleChange">
            <el-option :value="Permission.default_client_id" label="站内所有用户"></el-option>
            <el-option
              v-for="(item,index) in userLists"
              :key="index"
              :label="item.username"
              :value="item.uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="站内标识：" prop="uuid">
          <el-input v-model="localForm.uuid" placeholder="请输入站内标识" readonly></el-input>
        </el-form-item>
        <el-form-item label="推送标题：" prop="title">
          <el-input v-model.trim="localForm.title" placeholder="请输入推送标题"></el-input>
        </el-form-item>
        <el-form-item label="推送消息：" prop="info">
          <el-input
            v-model.trim="localForm.info"
            placeholder="请输入推送消息"
            resize="none"
            rows="4"
            type="textarea">
          </el-input>
        </el-form-item>
        <el-form-item label="推送时间：" prop="created_at">
          <el-date-picker
            v-model="localForm.created_at"
            :editable="false"
            format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="is-required" label="实时推送：">
          <el-switch
            v-model.number="localForm.status"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <SubmitButton
          :form="submitForm"
          :reForm="reForm"
          @closeDialog="$emit('getPushLists', { page: 1, limit: 15, refresh: true, total: 0 })">
        </SubmitButton>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SubmitButton from '@/components/common/SubmitForm';
import { push } from '@/api/urls';
import { setTime } from '@/utils/func';
import { toggle } from '@/components/mixins/toggle';

export default {
  name: 'PushDialog',
  components: { SubmitButton },
  props: ['form', 'reForm', 'userLists'],
  mixins: [toggle],
  data() {
    return {
      localForm: this.form,
      submitForm: {},
      rules: {
        username: [{ required: true, message: '请选择目标用户', trigger: 'change' }],
        uuid: [{ required: true, message: '请输入站内标识', trigger: 'blur' }],
        title: [{ required: true, message: '请输入推送标题', trigger: 'blur' }],
        info: [{ required: true, message: '请输入推送内容', trigger: 'blur' }],
        created_at: [{ required: true, message: '请选择推送时间', trigger: 'change', type: 'date' }]
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
            url: this.reForm === 'created' ? push.save : push.update
          };
        }, 1000);
      });
    },
    'localForm.status'() {
      this.localForm.created_at = this.localForm.status === 1 ? setTime(Date.parse(new Date())) : this.form.created_at;
    }
  },
  methods: {
    /**
     * 获取UUID
     * @param uuid
     */
    handleChange(uuid) {
      this.localForm.uuid = uuid;
      this.userLists.map(row => {
        if (uuid === row.uuid) {
          this.localForm.username = row.username;
        }
      });
    }
  }
};
</script>

<style lang="less">

</style>
