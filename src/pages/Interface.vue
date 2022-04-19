<template>
  <BaseLayout :loading="loading">
    <template #header>
      <el-form-item>
        <el-button
          v-if="Permission.auth.indexOf(savePermission) > -1"
          icon="el-icon-plus"
          plain
          size="mini"
          type="primary"
          @click="addCategory">
          新增
        </el-button>
      </el-form-item>
    </template>
    <template #body>
      <CategoryLists
        :categoryTree="categoryTree"
        @addCategory="addCategory"
        @getDetails="getDetails"
        @removeCategory="removeCategory"
        @updateCategory="updateCategory">
      </CategoryLists>
    </template>
    <template #dialog>
      <!--接口详情-->
      <InterfaceDetails
        :categoryLists="categoryLists"
        :form="form"
        :reForm="reForm"
        :syncVisible="syncVisible"
        @getInterfaceCategory="getInterfaceCategory">
      </InterfaceDetails>
      <!--接口分类-->
      <AddCategory
        :categoryLists="categoryLists"
        :form="form"
        :reForm="reForm"
        :syncVisible="addVisible"
        @getInterfaceCategory="getInterfaceCategory">
      </AddCategory>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../components/BaseLayout';
import CategoryLists from '../components/interface/Category';
import InterfaceDetails from '../components/interface/Details';
import AddCategory from '../components/interface/Add';
import URLS from '../api/urls';

export default {
  name: 'Interface',
  components: { AddCategory, InterfaceDetails, CategoryLists, BaseLayout },
  data() {
    return {
      loading: true,
      syncVisible: false,
      addVisible: false,
      reForm: 'created',
      form: {},
      defaultJson: {
        source: 'json', desc: '', api_id: '', href: '', method: 'POST',
        request: [{ name: 'token', desc: '用户token', required: 1, type: 'String', val: this.$store.state.baseLayout.token }],
        response: [
          { name: 'code', desc: '200 成功', type: 'Number' },
          { name: 'message', desc: 'Success', type: 'String' }
        ],
        response_string: [], remark: '接口调用必须添加header头Authorization以便验证用户的合法性', apiLog: []
      },
      savePermission: URLS.interface.save
    };
  },
  computed: {
    categoryLists() {
      return this.$store.state.category.categoryLists;
    },
    categoryTree() {
      return this.$store.state.category.categoryTree;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getInterfaceCategory();
    });
  },
  methods: {
    /**
     * todo:获取接口列表
     * @param refresh
     * @return {Promise<void>}
     */
    async getInterfaceCategory(refresh = true) {
      this.loading = true;
      this.syncVisible = false;
      this.addVisible = false;
      await this.$store.dispatch('category/getInterfaceCategory', { refresh: refresh }).then(() => {
        this.loading = false;
      });
    },
    /**
     * todo:保存接口分类
     * @param category
     */
    addCategory(category = {}) {
      this.form = JSON.parse(JSON.stringify(category));
      this.form = { name: '', pid: this.form.id || 0, path: '1', level: 1 };
      this.addVisible = true;
      this.reForm = 'created';
    },
    /**
     * todo:更新接口分类
     * @param category
     */
    updateCategory(category) {
      this.form = JSON.parse(JSON.stringify(category));
      this.form = {
        name: this.form.name,
        pid: this.form.pid,
        path: this.form.path,
        level: this.form.level,
        id: this.form.id
      };
      this.addVisible = true;
      this.reForm = 'updated';
    },
    /**
     * todo:删除接口协议
     */
    removeCategory() {
      this.$alert('开发中...');
    },
    /**
     * todo:获取接口详情
     * @param form
     * @param source
     * @return {Promise<void>}
     */
    async getDetails(form, source) {
      await this.$store.dispatch('category/getInterfaceDetails', { id: form.id, source: source }).then(() => {
        this.form = JSON.parse(JSON.stringify(this.$store.state.category.details));
        if (source === 'json') {
          this.form.request.forEach((item) => {
            if (item.name === 'token') {
              item.val = this.$store.state.baseLayout.token;
            }
          });
        }
        this.reForm = 'updated';
        if (Object.keys(this.form).length === 0) {
          this.defaultJson.api_id = form.id;
          this.form = source === 'json' ? this.defaultJson : {
            api_id: form.id,
            html: '',
            markdown: '',
            source: 'markdown',
            apiLog: []
          };
          this.reForm = 'created';
        }
        this.syncVisible = true;
      });
    }
  }
};
</script>

<style scoped>

</style>
