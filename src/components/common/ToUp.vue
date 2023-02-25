<template>
  <el-button v-if="ToUpBtn" id="toUp" icon="el-icon-caret-top" round size="mini" type="primary" @click="toUp">
    {{ buttonValue }}
  </el-button>
</template>

<script>
import { scrollToUp } from '@/utils/func';
export default {
  name: 'ToUp',
  props: {
    /* 按钮名称 */
    buttonValue: {
      type: String,
      default: () => 'UP'
    },
    /* 上升配速 */
    speed: {
      type: Number,
      default: () => 8.888
    },
    /* 按钮展示时机 */
    showTimes: {
      type: Number,
      default: () => 500
    },
    /* 定时器时间 */
    interval: {
      type: Number,
      default: () => 50
    }
  },
  data() {
    return {
      ToUpBtn: false
    };
  },
  created() {
    this.$nextTick(() => {
      window.addEventListener('scroll', () => {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.ToUpBtn = scrollTop >= this.showTimes;
      });
    });
  },
  methods: {
    /**
     * 返回顶部
     */
    toUp() {
      scrollToUp(this.speed, this.interval);
    }
  }
};
</script>

<style lang="less">
#toUp {
  box-shadow: 0 5px 5px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  text-align: center;
  line-height: 20px;
  border-radius: 30px;
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 2001
}
</style>
