<template>
  <canvas id="s-canvas" :height="contentHeight" :width="contentWidth"></canvas>
</template>
<script>
export default {
  name: 'Identify',
  props: {
    // 默认注册码
    identifyCode: {
      type: String,
      default: () => '1234'
    },
    // 字体最小值
    fontSizeMin: {
      type: Number,
      default: () => 25
    },
    // 字体最大值
    fontSizeMax: {
      type: Number,
      default: () => 35
    },
    // 验证码图片背景色最小值
    backgroundColorMin: {
      type: Number,
      default: () => 200
    },
    // 验证码图片背景色最大值
    backgroundColorMax: {
      type: Number,
      default: () => 220
    },
    // 背景干扰点最小值
    dotColorMin: {
      type: Number,
      default: () => 60
    },
    // 背景干扰点最大值
    dotColorMax: {
      type: Number,
      default: () => 120
    },
    // 容器宽度
    contentWidth: {
      type: Number,
      default: () => 120
    },
    // 容器高度
    contentHeight: {
      type: Number,
      default: () => 36
    }
  },
  methods: {
    /**
     * 生成一个随机数
     * @param min
     * @param max
     * @returns {number}
     */
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    /**
     * 生成一个随机的颜色
     * @param min
     * @param max
     * @returns {string}
     */
    randomColor(min, max) {
      let r = this.randomNum(min, max);
      let g = this.randomNum(min, max);
      let b = this.randomNum(min, max);
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    },
    /**
     * 绘制图层
     */
    drawPic() {
      let canvas = document.getElementById('s-canvas');
      let ctx = canvas.getContext('2d');
      ctx.textBaseline = 'bottom';
      // 绘制背景
      ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax);
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight);
      // 绘制文字
      for (let i = 0; i < this.identifyCode.length; i++) {
        this.drawText(ctx, this.identifyCode[i], i);
      }
      this.drawLine(ctx);
      this.drawDot(ctx);
    },
    /**
     * 随机生成验证码
     * @param ctx
     * @param txt
     * @param i
     */
    drawText(ctx, txt, i) {
      ctx.fillStyle = this.randomColor(50, 160);
      // 随机生成字体大小
      ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei';
      let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1));
      let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5);
      let deg = this.randomNum(-30, 30);
      // 修改坐标原点和旋转角度
      ctx.translate(x, y);
      ctx.rotate(deg * Math.PI / 180);
      ctx.fillText(txt, 0, 0);
      // 恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180);
      ctx.translate(-x, -y);
    },
    /**
     * 绘制干扰线
     * @param ctx
     */
    drawLine(ctx) {
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = this.randomColor(100, 200);
        ctx.beginPath();
        ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight));
        ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight));
        ctx.stroke();
      }
    },
    /**
     * 绘制干扰点
     * @param ctx
     */
    drawDot(ctx) {
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = this.randomColor(0, 255);
        ctx.beginPath();
        ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  },
  watch: {
    identifyCode() {
      this.drawPic();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.drawPic();
    });
  }
};
</script>
