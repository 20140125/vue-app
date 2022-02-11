<template>
  <div id="json">
    <el-form :model="localForm" :ref="reForm" label-position="left" label-width="100px" :rules="rules">
      <el-form-item label="接口名称：" prop="api_id">
        <el-select v-model.number="localForm.api_id" placeholder="接口名称">
          <el-option v-for="(item,index) in categoryLists" :key="index" :label="setCategoryName(item)"
                     :value="item.id"></el-option>
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
          <el-option v-for="(item,index) in attr.methods" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求字段：" prop="request" class="response">
        <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="requestAdd()"
                   size="medium"></el-button>
        <div v-for="(request, index) in localForm.request" :key="index">
          <el-input v-model.trim="request.name" placeholder="参数名"></el-input>
          <el-select v-model.trim="request.type" placeholder="字段类型">
            <el-option v-for="(item,index) in attr.type" :key="index" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <el-select v-model.trim="request.required" placeholder="是否必须">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
          <el-input v-model.trim="request.desc" auto-complete="true" placeholder="参数描述"></el-input>
          <el-input v-model.trim="request.val" auto-complete="true" placeholder="参数值"></el-input>
          <el-button type="danger" v-if="localForm.request.length > 1" plain icon="el-icon-delete"
                     @click="requestRemove(localForm.request, index)" size="medium"></el-button>
        </div>
      </el-form-item>
      <el-form-item label="返回字段：" prop="response" class="response">
        <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="responseAdd()"
                   size="medium"></el-button>
        <div v-for="(response, index) in localForm.response" :key="index">
          <el-input v-model.trim="response.name" placeholder="参数名"></el-input>
          <el-select v-model.trim="response.type" placeholder="字段类型">
            <el-option v-for="(item,index) in attr.type" :key="index" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <el-input v-model.trim="response.desc" placeholder="参数描述"></el-input>
          <el-button type="danger" v-if="localForm.response.length > 1" icon="el-icon-delete" plain
                     @click="responseRemove(localForm.response, index)" size="medium"></el-button>
        </div>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input v-model.trim="localForm.remark" maxlength="500" show-word-limit resize="none"
                  :autosize="{ minRows: 4}" placeholder="备注" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="接口请求：">
        <el-button plain type="primary" @click="getInterfaceDetails">接口调用</el-button>
      </el-form-item>
      <el-form-item label="返回参数：" prop="response_string">
        <JsonView :items="localForm.response_string"></JsonView>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import JsonView from '@/components/common/JsonView';

export default {
  name: 'Json',
  components: { JsonView },
  props: ['form', 'categoryLists', 'reForm'],
  data() {
    return {
      localForm: this.form,
      submitForm: {},
      attr: {
        methods: [{ label: 'POST', value: 'POST' }, { label: 'GET', value: 'GET' }, {
          label: 'PUT',
          value: 'PUT'
        }, { label: 'DELETE', value: 'DELETE' }],
        type: [
          { label: '字符串(String)', value: 'String' },
          { label: '浮点数(Float)', value: 'Float' },
          { label: '整型(Number)', value: 'Number' },
          { label: '对象(Object)', value: 'Object' },
          { label: '数组(Array)', value: 'Array' },
          { label: '时间戳(Timestamp)', value: 'Timestamp' }
        ]
      },
      rules: {}
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
      this.localForm.request.push({ name: '', desc: '', required: '1', type: '', val: '' });
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
