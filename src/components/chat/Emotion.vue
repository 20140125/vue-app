<template>
  <div class="emotion">
    <div class="emotion-box" :style="{ height: height + 'px' }">
      <el-tabs type="border-card" tab-position="top" @tab-click="changeEmotionLists" v-model="type">
        <el-tab-pane v-for="(item,index) in emotionType" :name="item.type.toString()" :key="index" :label="item.title">
          <div class="emotion-box-line" v-for="(emotion, index) in emotionList" :key="index">
            <div class="emotion-item">
              <el-image :src="emotion.icon" :alt="emotion.title" style="width: 30px;height: 30px;" lazy @click="$emit('clickEmotion', emotion)"></el-image>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      default: () => 200
    }
  },
  data() {
    return {
      emotionType: [
        { type: 1, title: '表情' },
        { type: 2, title: '人物' },
        { type: 3, title: '动作' },
        { type: 4, title: '家庭' },
        { type: 5, title: '自然' },
        { type: 6, title: '食物' },
        { type: 7, title: '体育' },
        { type: 8, title: '建筑' },
        { type: 9, title: '用品' },
        { type: 10, title: '符号' },
        { type: 11, title: '国旗' }
      ],
      type: '1',
      payload: { page: 1, limit: 500, type: 1 },
      pages: 0,
      offsetPage: 0
    };
  },
  computed: {
    emotionList() {
      return this.$store.state.chat.emotion;
    }
  },
  methods: {
    /**
     * todo:图标切换
     * @param item
     */
    changeEmotionLists(item) {
      this.payload = { page: 1, limit: 500, type: parseInt(item.props.name, 10) };
      this.getEmotionList(this.payload);
    },
    /**
     * TODO:展示表情数据
     * @param payload
     */
    getEmotionList(payload) {
      this.$store.dispatch('chat/getEmotionList', payload);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getEmotionList(this.payload);
    });
  }
};
</script>
<style lang="less">
.emotion {
  position: absolute;
  bottom: 235px;
  width: 490px;
  border: 1px solid #dddeee;
  margin: 5px;

  .emotion-box {
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    position: initial;
    z-index: 2000
  }

  .emotion-box-line {
    display: flex;
    float: left;
  }

  .emotion-item {
    flex: 1;
    margin-left: 13px;
    margin-top: 10px;
    cursor: pointer;
  }
}
</style>
