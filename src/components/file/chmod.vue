<template>
  <div id="chmod">
    <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="`设置权限[${file.filename}]`"
      width="500px"
      @close="$emit('getFileLists')">
      <el-form ref="fileChmod" :model="form" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="权限值：" prop="model.auth">
          <el-input
            v-model.number="form.model.auth"
            maxlength="3"
            placeholder="请输入内容"
            @change="setChmod(form.model.auth)">
          </el-input>
        </el-form-item>
        <el-form-item class="is-required" label="所有者：">
          <el-checkbox-group v-model="form.model.all" @change="chmodChange('all')">
            <el-checkbox v-for="item in chmodAttr" :key="item.id" :label="item.value" border size="small"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="is-required" label="用户组：">
          <el-checkbox-group v-model="form.model.user" @change="chmodChange('user')">
            <el-checkbox v-for="item in chmodAttr" :key="item.id" :label="item.value" border size="small"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="is-required" label="公共：">
          <el-checkbox-group v-model="form.model.common" @change="chmodChange('common')">
            <el-checkbox v-for="item in chmodAttr" :key="item.id" :label="item.value" border size="small"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <SubmitButton :form="form" re-form="fileChmod" @closeDialog="$emit('closeDialog')"></SubmitButton>
    </el-dialog>
  </div>
</template>

<script>
import SubmitButton from '@/components/common/SubmitForm';
import URLS from '@/api/urls';

export default {
  name: 'FileChmod',
  components: { SubmitButton },
  props: ['file', 'chmodVisible'],
  data() {
    /**
     * @param rule
     * @param value
     * @param callback
     */
    const checkAuth = (rule, value, callback) => {
      try {
        if (value.toString().substr(0, 1) < 1 || value.toString().substr(0, 1) > 7) {
          callback(new Error('权限值输入错误'));
        }
        if (value.toString().substr(1, 1) < 1 || value.toString().substr(1, 1) > 7) {
          callback(new Error('权限值输入错误'));
        }
        if (value.toString().substr(2, 1) < 1 || value.toString().substr(2, 1) > 7) {
          callback(new Error('权限值输入错误'));
        }
      } catch (error) {
        callback(new Error('请输入权限值'));
      }
    };
    return {
      visible: this.chmodVisible,
      form: { model: { auth: '', all: [], user: [], common: [] }, url: URLS.file.chmod, $refs: this.$refs },
      chmodAttr: [{ 'id': 4, 'value': '读取' }, { 'id': 2, 'value': '写入' }, { 'id': 1, 'value': '执行' }],
      chmodAuth: {
        1: ['执行'],
        2: ['写入'],
        3: ['写入', '执行'],
        4: ['读取'],
        5: ['读取', '执行'],
        6: ['读取', '写入'],
        7: ['读取', '写入', '执行']
      },
      chmodId: { all: 0, user: 0, common: 0 },
      rules: {
        model: {
          auth: [{ required: true, message: '权限值必须是数字', trigger: 'blur', type: 'number' }, { validator: checkAuth }]
        }
      }
    };
  },
  watch: {
    chmodVisible() {
      this.visible = this.chmodVisible;
      if (this.visible) {
        this.setChmod(parseInt(this.file.auth, 10));
      }
    }
  },
  methods: {
    /**
     * 设置权限
     * @param auth
     */
    setChmod(auth) {
      this.chmodId = {
        all: parseInt(auth.toString().substr(0, 1), 10),
        user: parseInt(auth.toString().substr(1, 1), 10),
        common: parseInt(auth.toString().substr(2, 1), 10)
      };
      this.form.model = {
        auth: auth,
        all: this.chmodAuth[this.chmodId.all],
        user: this.chmodAuth[this.chmodId.user],
        common: this.chmodAuth[this.chmodId.common]
      };
    },
    /**
     * 权限值改变
     * @param form
     */
    chmodChange(form) {
      Object.keys(this.chmodAuth).forEach(item => {
        if (JSON.stringify(this.chmodAuth[item].sort()).indexOf(JSON.stringify(this.form.model[form].sort())) > -1) {
          this.chmodId[form] = parseInt(item, 10);
        }
      });
      let auth = '';
      Object.keys(this.chmodId).forEach(item => {
        auth += this.chmodId[item].toString();
      });
      this.form.model.auth = parseInt(auth, 10);
    }
  }
};
</script>
