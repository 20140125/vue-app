<template>
  <div id="container"></div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
  name: 'AMap',
  props: {
    center: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    async center() {
      await this.initAMap(this.center);
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.initAMap(this.center);
    });
  },
  methods: {
    /**
     * 初始化地图
     * @param center
     * @return {Promise<void>}
     */
    async initAMap(center) {
      await this.$store.dispatch('config/getConfigDetails', { name: 'AMapOauth' }).then(() => {
        let AMapKey = this.$store.state.config.systemConfig.children[0].value;
        AMapLoader.load({
          'key': AMapKey
        }).then((AMap) => {
          new AMap.Map('container', { zoom: 11, viewMode: '3D', center: center });
        }).catch(e => {
          console.log(e);
        });
      });
    }
  }
};
</script>

<style lang="less">
#container {
  height: 500px;
  width: 100%;
}
</style>
