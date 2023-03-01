<template>
  <v-md-editor
    ref="markdown"
    v-model="model"
    :disabled-menus="[]"
    :mode="mode"
    height="600px"
    @change="changeHandle"
    @save="saveHandle"
    @upload-image="uploadFile">
  </v-md-editor>
</template>

<script>

import $http from '@/tools/request';
import URLS from '@/api/urls';

export default {
  name: 'MarkDown',
  props: {
    markdown: {
      type: String,
      default: () => ''
    },
    /* EDIT(纯编辑模式) EDITABLE(编辑与预览模式) PREVIEW(纯预览模式). */
    mode: {
      type: String,
      default: () => 'editable'
    },
    /* 数据保存 */
    saveHandle: {
      type: Function
    },
    /* 数据修改 */
    changeHandle: {
      type: Function
    }
  },
  data() {
    return {
      model: this.markdown,
      action: URLS.baseURL + URLS.file.upload
    };
  },
  methods: {
    /**
     * 上传图片
     * @param event
     * @param insertImage
     * @param files
     */
    uploadFile(event, insertImage, files) {
      try {
        /* 创建form对象 */
        const param = new FormData();
        param.append('file', files[0]);
        param.append('filename', files[0].name);
        param.append('token', this.$store.state.baseLayout.token);
        param.append('round_name', 'YES');
        param.append('file_type', 'image');
        /* 添加请求头 */
        const config = { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': this.$store.state.baseLayout.token } };
        $http.post(this.action, param, config).then((response) => {
          insertImage({ url: response.data.item.lists.src, desc: files[0].name });
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>

<style scoped>

</style>
