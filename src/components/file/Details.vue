<template>
  <div id="dialog">
    <el-dialog
      v-model="visible.detail"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :fullscreen="fullscreen"
      :show-close="false"
      :title="tabModel.label || '在线编辑器'"
      center
      width="1550px">
      <el-row :gutter="24">
        <el-col :span="24" style="margin-top: -65px;color: white;">
          <i class="el-icon-full-screen" style="font-size: 25px" @click="fullscreen = !fullscreen"></i>
        </el-col>
        <!--文件列表-->
        <el-col :span="6" style="margin-bottom: 20px">
          <el-input
            v-model="filterText"
            clearable
            placeholder="输入关键字搜索"
            style="margin-bottom: 20px"
            suffix-icon="el-icon-search">
          </el-input>
          <el-tree
            ref="tree"
            :data="details"
            :default-expand-all="false"
            :filter-node-method="filterNode"
            :highlight-current="true"
            :indent="20"
            empty-text="暂无数据"
            :props="treeProps"
            icon-class="el-icon-files"
            node-key="name"
            style="background-color: #272822;line-height: 20px;"
            @node-click="getFileContent">
          </el-tree>
        </el-col>
        <!--文件列表-->
        <!--文件内容-->
        <el-col :span="18" class="details">
          <el-form ref="fileSave" :model="form.model">
            <el-form-item>
              <el-tabs
                v-model="tabModel.name"
                closable
                lazy
                style="text-align: left!important;"
                type="border-card"
                @tab-click="goto"
                @tab-remove="removeTab">
                <el-tab-pane
                  v-for="item in fileTabs"
                  :key="item.name"
                  :label="item.label"
                  :name="item.name">
                </el-tab-pane>
                <el-card shadow="always">
                  <codemirror
                    ref="edit"
                    :options="options"
                    :value="tabModel.content"
                    style="line-height: 20px"
                    @change="updateContent">
                  </codemirror>
                </el-card>
              </el-tabs>
            </el-form-item>
            <SubmitButton
              v-if="Permission.auth.indexOf(savePermission) > -1 && fileAuth === 777"
              :form="form"
              re-form="fileSave"
              @closeDialog="$emit('closeDialog')">
            </SubmitButton>
            <el-main v-else style="text-align: center">
              <el-button plain size="medium" type="default" @click="$emit('closeDialog')">取消</el-button>
            </el-main>
          </el-form>
        </el-col>
        <!--文件内容-->
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror-lite';
import SubmitButton from '@/components/common/SubmitForm';
import { file } from '@/api/urls';

/* 编辑器代码 */
require('codemirror/mode/php/php.js');
require('codemirror/mode/sql/sql.js');
require('codemirror/addon/hint/sql-hint.js');
require('codemirror/addon/hint/show-hint.js');
require('codemirror/mode/markdown/markdown.js');
require('codemirror/mode/xml/xml.js');
require('codemirror/addon/hint/javascript-hint.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/addon/selection/active-line');
/* 编辑器主题 */
require('codemirror/theme/monokai.css');
/* 代码折叠 */
require('codemirror/addon/fold/foldgutter.css');
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/brace-fold.js');
require('codemirror/addon/fold/brace-fold.js');
require('codemirror/addon/fold/comment-fold.js');
/* 括号匹配 */
require('codemirror/addon/edit/matchbrackets.js');

export default {
  name: 'FileDetails',
  props: ['details', 'detailVisible'],
  components: { SubmitButton, codemirror },
  data() {
    return {
      visible: { detail: this.detailVisible },
      treeProps: { label: 'filename', children: 'children', isLeaf: false },
      fullscreen: false,
      filterText: '',
      form: { model: { content: '', path: '' }, url: file.update, $refs: '' },
      /* 代码编辑器配置 */
      options: {
        /* 语言类型 */
        mode: 'text/x-php',
        /* 缩进 */
        tabSize: 4,
        /* 显示行号 */
        lineNumbers: true,
        /* theme */
        theme: 'monokai',
        /* 智能提示 ctrl-space唤起智能提示 */
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        /* 自动换行 */
        lineWrapping: false,
        /* 代码折叠 */
        foldGutter: true,
        // gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        /* 代码缩进 */
        indentWithTabs: true,
        /* 括号匹配 */
        matchBrackets: true,
        /* 光标高度 */
        cursorHeight: 1,
        /* 自动刷新 */
        autoRefresh: true,
        /* 设置光标所在行高亮 */
        styleActiveLine: true,
        /* 只读 */
        readOnly: false
      },
      mode: {
        markdown: 'text/markdown',
        php: 'text/x-php',
        xml: 'text/xml',
        json: 'application/ld+json',
        sql: 'text/x-mysql'
      },
      savePermission: file.update,
      fileAuth: 644
    };
  },
  watch: {
    detailVisible() {
      this.visible.detail = this.detailVisible;
      /* 编辑器只读 */
      if (this.visible.detail) {
        this.options.readOnly = this.Permission.auth.indexOf(this.savePermission) < 0;
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    tabModel() {
      this.form.model.content = this.tabModel.content;
      this.form.$refs = this.$refs;
    }
  },
  computed: {
    fileTabs() {
      return this.$store.state.file.tabs;
    },
    tabModel() {
      return { ...this.$store.state.file.tabModel };
    }
  },
  methods: {
    /**
     * 获取文件内容
     * @param file
     */
    async getFileContent(file) {
      if (file.file_type !== 'file') {
        this.visible.detail = true;
        this.$parent.$parent.$parent.getFileLists(file, 0, true);
        return false;
      }
      this.fileAuth = parseInt(file.auth, 10);
      this.options.readOnly = this.fileAuth !== 777;
      let ext = (file.filename.split('.') || [])[1] || 'php';
      /* 不支持在线编辑 */
      let imgExt = ['png', 'jpg', 'jpeg', 'gif', 'mp4', 'flv'];
      if (imgExt.includes(ext.toLowerCase())) {
        this.$message.error('该文件格式不支持在线编辑!');
        return false;
      }
      this.form.$refs = this.$refs;
      this.setOptionsMode(ext);
      this.form.model.path = file.path;
      let tabs = { name: file.name, label: file.filename, path: file.path, auth: this.fileAuth };
      await this.$store.dispatch('file/getFileContent', tabs);
    },
    /**
     * 设置编辑器的mode
     * @param ext
     */
    setOptionsMode(ext) {
      switch (ext.toLowerCase()) {
        case 'xml':
          this.options.mode = this.mode.xml;
          break;
        case 'md':
          this.options.mode = this.mode.markdown;
          break;
        case 'json':
        case 'lock':
          this.options.mode = this.mode.json;
          break;
        case 'sql':
          this.options.mode = this.mode.sql;
          break;
        default:
          this.options.mode = this.mode.php;
          break;
      }
    },
    /**
     * TODO：搜索文件名称
     * @param value
     * @param data
     */
    filterNode: function (value, data) {
      return value ? data.filename.toLowerCase().indexOf(value.toLowerCase()) !== -1 : true;
    },
    /**
     * 获取文件详情
     * @param tab
     * @return {Promise<void>}
     */
    async goto(tab) {
      await this.fileTabs.forEach(item => {
        if (tab.props.label === item.label) {
          this.form.$refs = this.$refs;
          this.form.model.path = item.path;
          this.fileAuth = item.auth;
          this.options.readOnly = this.fileAuth !== 777;
          this.$store.commit('file/UPDATE_MUTATIONS', { tabModel: item });
        }
      });
    },
    /**
     * 删除tab
     * @param tabName
     * @return {Promise<void>}
     */
    async removeTab(tabName) {
      await this.fileTabs.forEach((item, index) => {
        if (tabName === item.name) {
          this.form.$refs = this.$refs;
          this.form.model.path = item.path;
          let nextTab = this.fileTabs[index + 1] || this.fileTabs[index - 1];
          if (nextTab) {
            this.$store.dispatch('file/deleteTabs', { index: index, nextTab: nextTab });
          }
        }
      });
    },
    /**
     * 更新文件详情
     * @param content
     */
    updateContent(content) {
      this.form.$refs = this.$refs;
      this.form.model.content = content;
    }
  }
};
</script>

<style lang="less">
#dialog {
  .el-tree {
    min-height: 500px;
  }

  .CodeMirror {
    border: 1px solid #eee;
    min-height: 550px;
    height: auto !important;
    z-index: 1;
  }

  .CodeMirror-scroll {
    height: auto;
    min-height: 550px;
    max-height: 1000px;
    overflow-y: hidden;
    overflow-x: auto;
  }

  .CodeMirror-hscrollbar {
    left: 30px !important;
    height: 5px !important;
  }

  .details {
    .el-form-item__content {
      .el-tabs--border-card {
        width: 1120px !important;
      }
    }
  }
}
</style>
