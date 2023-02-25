<template>
  <el-upload
    ref="upload"
    :action="action"
    :auto-upload="autoUpload"
    :before-upload="beforeUpload"
    :data="data"
    :file-list="fileList"
    :http-request="uploadFile"
    :limit="uploadLimit"
    :list-type="listType"
    :name="data.name || 'file'"
    :on-remove="handleRemove"
    :on-success="uploadSuccess"
    :show-file-list="uploadControls.show_file_list">
    <!--用户图像上传-->
    <el-avatar
      v-if="uploadControls.button_type === 'avatar'"
      :alt="avatarImage.username"
      :size="avatarImage.size"
      :src="avatarImage.avatar_url"
      fit="cover">
    </el-avatar>
    <!--按钮形式上传-->
    <el-button v-if="uploadControls.button_type === 'picture'" size="small" type="primary">点击上传</el-button>
    <!--卡片形式上传-->
    <i v-if="uploadControls.button_type === 'card'" class="el-icon-plus"></i>
    <!--上传提示文案-->
    <span
      v-if="uploadControls.show_tips"
      class="el-upload__tip"
      style="margin-left: 20px;">
      {{ tips ? tips : `请上传${imgWidth}*${imgHeight}的jpg/png 图片` }}
    </span>
  </el-upload>
  <!--点击上传-->
  <el-button v-if="!autoUpload" plain size="medium" style="margin-top: 20px" type="primary" @click="submitUpload">
    上传到服务器
  </el-button>
</template>

<script>

import { rgbToHex } from '@/utils/func';
import URLS from '../../api/urls';
import $http from '../../tools/request';

export default {
  name: 'CommonUpload',
  props: {
    /* 图片图像 */
    fileList: {
      type: Array,
      default: () => []
    },
    /* 图片宽度 */
    imgWidth: {
      type: Number,
      default: () => 320
    },
    /* 图片高度 */
    imgHeight: {
      type: Number,
      default: () => 250
    },
    /* 图片大小 */
    fileSize: {
      type: Number,
      default: () => 1024
    },
    /* 图片上传成功 */
    uploadSuccess: {
      type: Function
    },
    /* 图片上传失败 */
    handleRemove: {
      type: Function
    },
    /* 图片个数 */
    uploadLimit: {
      type: Number,
      default: () => 1000
    },
    /* 上传文案 */
    tips: {
      type: String,
      default: ''
    },
    /* 卡片类型 */
    listType: {
      type: String,
      default: () => 'picture'
    },
    /* 图片上传地址 */
    action: {
      type: String,
      default: () => {
        return `${URLS.baseURL}${URLS.file.upload}`;
      }
    },
    /* 自动上传 */
    autoUpload: {
      type: Boolean,
      default: () => true
    },
    /* 用户头像 */
    avatarImage: {
      type: Object,
      default: () => {
        return { avatar_url: '', username: '', size: 100 };
      }
    },
    /* 图片上传属性 */
    data: {
      type: Object,
      default: () => {
        return { name: 'file', round_name: true, file: {} };
      }
    },
    /* 上传控件 */
    uploadControls: {
      type: Object,
      default: () => {
        return { button_type: 'picture', show_tips: true, show_file_list: true };
      }
    }
  },
  methods: {
    /**
     * 点击上传
     */
    submitUpload() {
      this.$refs.upload.submit();
    },
    /**
     * 文件上传
     * @param file
     */
    uploadFile(file) {
      /* 创建form对象 */
      let param = new FormData();
      param.append('file', file.file);
      param.append('filename', file.file.name);
      param.append('token', this.$store.state.baseLayout.token);
      param.append('round_name', this.data.round_name || false);
      param.append('file_type', 'image');
      /* 名字随机时不需要传入路径 */
      if (!this.data.round_name) {
        param.append('path', this.data.file.path.replace(this.data.file.filename, ''));
      }
      /* 添加请求头 */
      let config = { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': this.$store.state.baseLayout.token } };
      $http.post(file.action, param, config).then(response => {
        response.data.filename = file.filename;
        file.onSuccess(response.data);
      }).catch(() => {
        file.onError();
      });
    },
    /**
     * 获取图片背景颜色
     * @param file
     */
    getBackgroundColor(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          const canvas = document.getElementById('s-award-canvas');
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight);
          this.$emit('setBackgroundColor', rgbToHex(ctx.getImageData(0, 0, image.width, image.height).data));
        };
      };
    },
    /**
     * 上传图片前处理函数
     * @param file
     * @returns {Promise<*>|boolean}
     */
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      const isLt30KB = file.size / 1024 / this.fileSize < 1;
      if (!isJPG) {
        this.$message.error('上传图片只能是 jpg、png 格式!');
        return false;
      }
      if (!isLt30KB) {
        this.$message.error(`上传图片大小不能超过${this.fileSize}KB!`);
        return false;
      }
      if (!this.imgHeight && !this.imgWidth) {
        return isJPG && isLt30KB;
      }
      let tips = [];
      const isSize = new Promise((resolve, reject) => {
        const width = this.imgWidth;
        const height = this.imgHeight;
        let valid = false;
        let validArray = [];
        const _URL = window.URL || window.webkitURL;
        const image = new Image();
        image.onload = function () {
          if (typeof width === 'number' && typeof height === 'number') {
            valid = (image.width === width && image.height === height) || (image.width >= width - 10 && image.height >= height - 10 && image.width <= width + 10 && image.height <= height + 10);
          } else {
            /* 图片宽高相等 */
            validArray.push(width.includes(image.width) && height.includes(image.height) ? 1 : 0);
            /* 图片宽高上下浮动10px */
            width.forEach((item, index) => {
              tips.push(`${item}*${height[index]}`);
              validArray.push((image.width >= item - 10 && image.height >= height[index] - 10 && image.width <= item + 10 && image.height <= height[index] + 10) ? 1 : 0);
            });
            valid = validArray.includes(1);
          }
          valid ? resolve() : reject();
        };
        image.src = _URL.createObjectURL(file);
      }).then(() => file, () => {
        this.$message.error(`上传图片尺寸不符合,只能是${tips.length === 0 ? `${this.imgWidth}*${this.imgHeight}` : tips.join(' / ')}!`);
        return Promise.reject();
      });
      return isJPG && isLt30KB && isSize;
    }
  }
};
</script>

<style>

</style>
