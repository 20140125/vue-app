<template>
  <div id="system">
    <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="reForm === 'created' ? '添加系统配置' : '修改系统'"
      center>
      <el-form :ref="reForm" :model="localForm" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="配置名称：" prop="name">
          <el-input v-model.trim="localForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="配置状态：" prop="status">
          <el-switch
            v-model.number="localForm.status"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item prop="children">
          <div v-for="(item, index) in localForm.children" :key="index" class="config">
            <div class="el-form-item is-required children">
              <label class="el-form-item__label">配置属性：</label>
              <div class="el-form-item__content">
                <div class="el-form-item">
                  <label class="el-form-item__label">PID：</label>
                  <div class="el-form-item__content">
                    <span v-html="item.pid"></span>
                  </div>
                </div>
                <div class="el-form-item">
                  <label class="el-form-item__label">KEY：</label>
                  <div class="el-form-item__content">
                    <el-input v-model.trim="item.name" placeholder="请输入"></el-input>
                  </div>
                </div>
                <div class="el-form-item">
                  <label class="el-form-item__label">VALUE：</label>
                  <div class="el-form-item__content">
                    <el-input
                      v-model.trim="item.value"
                      :autosize="{ minRows: 4}"
                      placeholder="请输入对应的VALUE，用逗号间隔"
                      resize="none"
                      type="textarea">
                    </el-input>
                  </div>
                </div>
                <div class="el-form-item">
                  <label class="el-form-item__label">ID：</label>
                  <div class="el-form-item__content">
                    <el-input v-model.number="item.id" placeholder="请输入"></el-input>
                  </div>
                </div>
                <div class="el-form-item">
                  <label class="el-form-item__label">STATUS：</label>
                  <div class="el-form-item__content">
                    <el-switch
                      v-model.number="item.status"
                      :active-value="1"
                      :inactive-value="2"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                  </div>
                </div>
                <div class="el-form-item">
                  <label class="el-form-item__label"></label>
                  <div class="el-form-item__content">
                    <el-button
                      v-if="localForm.children.length > 1"
                      icon="el-icon-delete"
                      plain
                      size="mini"
                      type="danger"
                      @click="deleteChildren(localForm.children, index)">
                      移除
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="addChildren(localForm.children)">
          新增
        </el-button>
        <SubmitButton
          :form="submitForm"
          :reForm="reForm"
          @closeDialog="$emit('getConfigLists', { page: 1, limit: 15, total: 0, show_page: true, refresh: true })">
        </SubmitButton>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SubmitButton from '@/components/common/SubmitForm';
import { config } from '@/api/urls';
import { checkConfigChildren } from '@/components/system/config/index';
import { toggle } from '@/components/mixins/toggle';

export default {
  name: 'SystemConfigDialog',
  components: { SubmitButton },
  props: ['form', 'reForm'],
  mixins: [toggle],
  data() {
    return {
      localForm: this.form,
      submitForm: {},
      rules: {
        name: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择配置状态', trigger: 'change' }],
        children: [{
          required: true,
          message: '请输入配置属性',
          trigger: 'blur',
          type: 'array'
        }, { validator: checkConfigChildren, trigger: 'blur' }]
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
            url: this.reForm === 'created' ? config.save : config.update
          };
        }, 1000);
      });
    }
  },
  methods: {
    /**
     * 添加配置值
     * @param children
     */
    addChildren(children) {
      let items = JSON.parse(JSON.stringify(children));
      items.push({
        name: '',
        value: '',
        status: 1,
        pid: this.localForm.children[this.localForm.children.length - 1].pid,
        id: this.localForm.children[this.localForm.children.length - 1].id + 1
      });
      this.localForm.children = items;
    },
    /**
     * 移除配置值
     * @param children
     * @param index
     */
    deleteChildren(children, index) {
      children.length > 1 ? children.splice(index, 1) : '';
    }
  }
};
</script>

<style lang="less">
#system {
  .config {
    .el-form-item {
      margin-bottom: 15px;
    }

    .children {
      margin-left: -100px;
    }
  }

  .el-form-item__label {
    width: 100px
  }
}
</style>
