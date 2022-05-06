<template>
  <div id="json">
    <el-form :ref="reForm" :model="localForm" :rules="rules" label-position="left" label-width="100px">
      <el-form-item label="接口名称：" prop="api_id" class="is-required">
        <el-select v-model.number="localForm.api_id" disabled placeholder="接口名称">
          <el-option
            v-for="(item,index) in categoryLists"
            :key="index"
            :label="setCategoryName(item)"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接口描述：" prop="desc">
        <el-input v-model.trim="localForm.desc" placeholder="接口描述"></el-input>
      </el-form-item>
      <el-form-item label="接口地址：" prop="href">
        <el-input v-model.trim="localForm.href" placeholder="接口地址"></el-input>
      </el-form-item>
      <el-form-item label="接口方法：" prop="method">
        <el-select v-model.trim="localForm.method" placeholder="接口方法">
          <el-option
            v-for="(item,index) in attr.methods"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="response is-required" label="请求字段：" prop="request">
        <el-button
          icon="el-icon-circle-plus-outline"
          plain
          size="medium"
          type="primary"
          @click="requestAdd()">
        </el-button>
        <div v-for="(request, index) in localForm.request" :key="index">
          <el-input v-model.trim="request.name" placeholder="参数名" :readonly="index === 0"></el-input>
          <el-select v-model.trim="request.type" placeholder="字段类型" :disabled="index === 0">
            <el-option
              v-for="(item,index) in attr.type"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model.trim="request.required" placeholder="是否必须" :disabled="index === 0">
            <el-option :value="1" label="是"></el-option>
            <el-option :value="0" label="否"></el-option>
          </el-select>
          <el-input v-model.trim="request.desc" auto-complete="true" placeholder="参数描述" :readonly="index === 0"></el-input>
          <el-input v-model.trim="request.val" auto-complete="true" placeholder="参数值" :readonly="index === 0"></el-input>
          <el-button
            v-if="index >= 1"
            icon="el-icon-delete"
            plain
            size="medium"
            type="danger"
            @click="requestRemove(localForm.request, index)">
          </el-button>
        </div>
      </el-form-item>
      <el-form-item class="response is-required" label="返回字段：" prop="response">
        <el-button
          icon="el-icon-circle-plus-outline"
          plain
          size="medium"
          type="primary"
          @click="responseAdd()">
        </el-button>
        <div v-for="(response, index) in localForm.response" :key="index">
          <el-input v-model.trim="response.name" placeholder="参数名" :readonly="index <= 1"></el-input>
          <el-select v-model.trim="response.type" placeholder="字段类型" :disabled="index <= 1">
            <el-option
              v-for="(item,index) in attr.type"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model.trim="response.desc" placeholder="参数描述" :readonly="index <= 1"></el-input>
          <el-button
            v-if="index >= 2"
            icon="el-icon-delete"
            plain
            size="medium"
            type="danger"
            @click="responseRemove(localForm.response, index)">
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input
          v-model.trim="localForm.remark"
          :autosize="{ minRows: 4}"
          maxlength="500"
          placeholder="备注"
          resize="none"
          show-word-limit type="textarea">
        </el-input>
      </el-form-item>
      <el-form-item label="接口请求：" class="is-required">
        <el-button plain type="primary" @click="getInterfaceDetails">接口调用</el-button>
      </el-form-item>
      <el-form-item label="返回参数：" prop="response_string" class="is-required">
        <JsonView :items="localForm.response_string"></JsonView>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import JsonView from '../common/JsonView';

export default {
  name: 'Json',
  components: { JsonView },
  props: ['form', 'categoryLists', 'reForm'],
  data() {
    return {
      localForm: this.form,
      submitForm: {},
      attr: {
        methods: [
          { label: 'POST', value: 'POST' },
          { label: 'GET', value: 'GET' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' }
        ],
        type: [
          { label: '字符串(String)', value: 'String' },
          { label: '浮点数(Float)', value: 'Float' },
          { label: '整型(Number)', value: 'Number' },
          { label: '对象(Object)', value: 'Object' },
          { label: '数组(Array)', value: 'Array' },
          { label: '时间戳(Timestamp)', value: 'Timestamp' }
        ]
      },
      rules: {
        desc: [{ required: true, message: '请输入接口描述', trigger: 'blur' }],
        href: [{ required: true, message: '请输入接口地址', trigger: 'blur' }],
        method: [{ required: true, message: '请选择请求方法', trigger: 'change' }],
        remark: [{ required: true, message: '请输入接口说明', trigger: 'blur' }]
      }
    };
  },
  methods: {
    /**
     * todo:设置接口名称
     * @param item
     * @return {string}
     */
    setCategoryName(item) {
      return Array(item.level + 1).join('　　') + item.name;
    },
    /**
     * todo:添加请求参数
     */
    requestAdd() {
      this.localForm.request.push({ name: '', desc: '', required: 1, type: 'String', val: '' });
    },
    /**
     * todo:删除请求参数
     * @param item
     * @param index
     */
    requestRemove(item, index) {
      item.length > 1 ? item.splice(index, 1) : '';
    },
    /**
     * todo:添加返回参数
     */
    responseAdd() {
      this.localForm.response.push({ name: '', desc: '', type: '' });
    },
    /**
     * todo:删除返回参数
     * @param item
     * @param index
     */
    responseRemove(item, index) {
      item.length > 1 ? item.splice(index, 1) : '';
    },
    /**
     * todo:获取接口详情
     */
    getInterfaceDetails() {
      let params = {};
      this.localForm.request.map(item => {
        params[item.name] = item.type === 'Number' ? parseInt(item.val) : item.val;
      });
      this.$store.dispatch('UPDATE_ACTIONS', { url: this.localForm.href, model: params }).then((response) => {
        this.localForm.response_string = response.data;
      });
    }
  }
};
</script>

<style lang="less">
#json {
  .response {
    .el-input,
    .el-select {
      width: 150px;
      margin-right: 15px;
      margin-top: 5px;
    }
  }
}
</style>
