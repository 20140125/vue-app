<template>
  <div id="spider" v-loading="loading">
    <el-form label-position="left" label-width="100px">
      <el-form-item class="is-required" label="工具列表：">
        <el-select v-model="keywords" @change="setMethods">
          <el-option
            v-for="(item, index) in spiderConfig"
            :key="index"
            :label="item.value.label"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-for="(item, index) in spiderParams" :key="index" :label="item.label + '：'" class="is-required">
        <el-input v-model="item.value" :placeholder="item.placeholder">
          <template #append>
            <el-button icon="el-icon-search" @click="syncSpider({ keywords: item.value, method: item.name })">
              开始同步
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="spiderParams.length > 0" class="is-required" label="输出信息：">
        <div ref="message" class="messageLists">
          <div v-for="(item, index) in messageLists" :key="index">
            <div v-if="item.message.indexOf('already') > -1">
              <div class="message-time" style="color: #E6A23C" v-html="item.time"></div>
              <div class="client-content" style="color: #E6A23C" v-html="item.message"></div>
            </div>
            <div v-else>
              <div class="message-time" v-html="item.time"></div>
              <div class="client-content" v-html="item.message"></div>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SocketIO from 'socket.io-client';
import { scrollToBottom, setTime } from '@/utils/func';

export default {
  name: 'SpiderIndex',
  data() {
    return {
      keywords: '',
      spiderParams: [],
      messageLists: [],
      loading: false
    };
  },
  props: ['spiderConfig'],
  mounted() {
    this.$nextTick(() => {
      const SocketService = SocketIO(this.$store.state.login.userInfo.socket, {
        transports: ['websocket'],
        autoConnect: true
      });
      /* 链接系统 */
      SocketService.on('connect', () => {
        console.info(`【登录系统】${setTime(Date.parse(new Date()))}`);
        /* 用户登录 */
        SocketService.emit('login', this.$store.state.login.userInfo.uuid);
      });
      /* 站内消息推送 */
      SocketService.on('web_command', ($message) => {
        if (this.messageLists.length > 100) {
          this.messageLists = [];
        }
        this.messageLists.push({ time: setTime(Date.parse(new Date()), 'ch'), message: $message });
        scrollToBottom('.messageLists');
        this.loading = this.messageLists.length <= 0;
      });
    });
  },
  methods: {
    /**
     * 设置同步方法
     */
    setMethods() {
      let spiderConfig = JSON.parse(JSON.stringify(this.spiderConfig));
      spiderConfig.forEach(item => {
        if (item.name === this.keywords) {
          this.spiderParams = item.value;
        }
      });
    },
    /**
     * 执行脚本
     * @param params
     * @return {Promise<void>}
     */
    async syncSpider(params) {
      this.messageLists = [];
      await this.$store.dispatch('spider/runningSpider', params).then(() => {
        this.loading = true;
      });
    }
  }
};
</script>

<style lang="less">
#spider {
  .el-select {
    width: 100%;
  }

  .messageLists {
    background-color: #393d49;
    max-height: 380px;
    height: 380px;
    color: #FFFFFF;
    padding-left: 10px;
    overflow: auto;

    .message-time {
      color: #67C23A;
    }

    .client-content {
      margin-left: 10px;
      color: #67C23A;
      font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
      font-size: 14px;
    }
  }
}
</style>
