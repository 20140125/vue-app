<template>
  <div id="source">
    <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="staticSource.title"
      center
      :width="dialogWidth"
      @close="$emit('closeDialog')">
      <!--图片滚动-->
      <el-carousel v-if="staticSource.image.length > 0" :height="carouselHeight" :autoplay="false" @change="carouselChange">
        <el-carousel-item v-for="(item, index) in staticSource.image" :key="index">
          <el-image :alt="item.title" :src="item.url" fit="cover" style="width: 100%; height: 100%"></el-image>
        </el-carousel-item>
      </el-carousel>
      <!--视频滚动-->
      <el-carousel v-if="staticSource.video.length > 0">
        <el-carousel-item v-for="(item, index) in staticSource.video" :key="index">
          <video :src="item.url" autoplay controls height="300px" width="300px">您的浏览器不支持 video 标签。</video>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import { toggle } from '../mixins/toggle';

export default {
  name: 'StaticSource',
  props: ['staticSource'],
  mixins: [toggle],
  data() {
    return {
      carouselHeight: '300px',
      dialogWidth: '580px'
    }
  },
  watch: {
    /**
     * todo:监听图片资源
     * @returns {Promise<void>}
     */
    async 'staticSource.image'() {
      if (this.staticSource.image.length > 0) {
        await this.staticSource.image.forEach((item, index) => {
          const image = new Image();
          image.src = item.url;
          image.setAttribute('crossOrigin', 'anonymous');
          image.onload = async () => {
            item.width = image.width;
            item.height = image.height;
            if (index === 0) {
              this.carouselHeight = `${image.height}px`;
              this.dialogWidth = `${image.width}px`;
            }
          };
        });
      }
    }
  },
  methods: {
    /**
     * todo:跑马灯切换
     * @param index
     */
    carouselChange(index) {
      this.carouselHeight = `${this.staticSource.image[index].height}px`;
      this.dialogWidth = `${this.staticSource.image[index].width}px`;
    }
  }
};
</script>

<style lang="less">
#source {

  .el-dialog__body {
    padding: 1px !important;
    line-height: 0 !important;

    .el-carousel__indicator--horizontal {
      display: none !important;
    }
  }
}
</style>
