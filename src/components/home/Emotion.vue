<template>
  <div class="emotion-box">
    <div>
      <el-tabs v-model="value" tab-position="top" type="border-card" @tab-click="changeEmotionLists">
        <el-tab-pane v-for="(item,index) in emotionMenu" :key="index" :label="item.label" :name="item.value.toString()">
          <div class="emotion-item">
            <div class="emotion-item__list" v-for="(emotion, key) in emotionLists" :key="key">
              <el-tooltip :content="emotion.title" placement="top-start">
                <el-image :alt="emotion.title" :src="emotion.icon" lazy></el-image>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Emotion',
  props: {
    showEmotion: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      value: '1',
      payload: { page: 1, limit: 100, type: 1 }
    }
  },
  computed: {
    emotionMenu() {
      return this.$store.state.index.emotionMenu;
    },
    emotionLists() {
      return this.$store.state.index.emotionLists
    }
  },
  mounted() {
    this.$nextTick(async () => {
      if (this.showEmotion) {
        await this.getEmotionLists(this.payload);
      }
    })
  },
  methods: {
    async changeEmotionLists(item) {
      console.log(item)
    },
    /**
     * todo:获取表情列表
     * @param payload
     * @returns {Promise<void>}
     */
    async getEmotionLists(payload) {
      await this.$store.dispatch('index/getEmotionList', payload);
    }
  }
};
</script>
