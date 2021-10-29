<template>
  <div id="source">
    <el-dialog v-model="visible" width="30%" :title="staticSource.title" center :close-on-click-modal="false" :close-on-press-escape="false" @close="$emit('closeDialog')">
      <!--图片滚动-->
      <el-carousel v-if="staticSource.image.length > 0">
        <el-carousel-item v-for="(item, index) in staticSource.image" :key="index">
          <el-image :src="item.url" :alt="item.title" fit="cover" style="width: 100%;height: 100%"></el-image>
        </el-carousel-item>
      </el-carousel>
      <!--视频滚动-->
      <el-carousel v-if="staticSource.video.length > 0">
        <el-carousel-item v-for="(item, index) in staticSource.video" :key="index">
          <video :src="item.url" autoplay controls width="300px" height="300px">您的浏览器不支持 video 标签。</video>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'StaticSource',
  props: ['sourceVisible', 'staticSource'],
  data() {
    return {
      visible: this.sourceVisible
    };
  },
  watch: {
    sourceVisible() {
      this.visible = this.sourceVisible;
    }
  }
};
</script>

<style lang="less">
#source {

  .el-dialog__body {
    padding: 10px 0 0 0 !important;
    line-height: 0 !important;

    .el-carousel__indicator--horizontal {
      display: none !important;
    }
  }
}
</style>
