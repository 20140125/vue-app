<template>
  <div id="webPush">
    <el-carousel
      v-if="pushMessage.length > 0"
      :interval="interval"
      arrow="never"
      direction="vertical"
      indicator-position="none">
      <el-carousel-item v-for="(item,index) in pushMessage" :key="index">
        <el-alert
          :title="item.message"
          :effect="effect"
          :show-icon="showIcon"
          :closable="closable"
          :type="alertType">
        </el-alert>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>

import SocketIO from 'socket.io-client';
import { setTime } from '@/utils/func';

export default {
  name: 'WebPush',
  props: {
    showIcon: {
      type: Boolean,
      default: () => true
    },
    closable: {
      type: Boolean,
      default: () => true
    },
    showWeather: {
      type: Boolean,
      default: () => true
    },
    interval: {
      type: Number,
      default: () => 2000
    },
    alertType: {
      type: String,
      default: () => 'success'
    },
    effect: {
      type: String,
      default: () => 'light'
    }
  },
  computed: {
    pushMessage() {
      const data = this.$store.state.index.configuration.notice;
      const lists = this.showWeather ? [{ message: JSON.stringify(this.Permission.weather?.casts || ''), timestamp: Date.parse(new Date()) / 1000 }] : [];
      data.forEach((item, index) => {
        lists.push({ message: item.message || item, timestamp: Date.parse(new Date()) / 1000 + index});
      });
      return lists;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getConfiguration();
      if (this.Permission) {
        this.getConnection();
      }
    });
  },
  methods: {
    /**
     * 获取推送链接
     */
    getConnection() {
      const SocketService = SocketIO(this.Permission.socket, {
        transports: ['websocket'],
        autoConnect: true
      });
      /* 链接系统 */
      SocketService.on('connect', () => {
        console.info(`【登录系统】${setTime(Date.parse(new Date()))}`);
        /* 用户登录 */
        SocketService.emit('login', this.Permission.uuid);
      });
      /* 获取站内推送信息 */
      SocketService.on('notice', (response) => {
        if (response.length > 0) {
          let $unread = 0;
          response.forEach(item => {
            item.disabled = (item.state === 'successfully' && item.see > 0);
            if (!item.disabled) {
              $unread += 1;
            }
          });
          this.$store.commit('home/UPDATE_MUTATIONS', { notice: response, unread: $unread });
        }
      });
      /* 获取图表信息 */
      SocketService.on('charts', (response) => {
        this.$store.commit('home/UPDATE_MUTATIONS', { xAxisData: response.day, seriesData: response.total });
      });
      /* 站内消息推送 */
      SocketService.on('new_message', (message) => {
        this.pushMessage.push({ message: message, timestamp: Date.parse(new Date()) / 1000 });
        /* 推送消息到站内系统通知 */
        this.$store.commit('index/UPDATE_MUTATIONS', { configuration: { notice: this.pushMessage, hotKeyWord: this.$store.state.index.configuration.hotKeyWord } });
        /* 推送消息到活动窗口 */
        this.$store.commit('index/UPDATE_MUTATIONS', { time: setTime(Date.parse(new Date()), 'ch'), message: message, username: '系统公告' });
      });
      /* 链接断开 */
      SocketService.on('disconnect', (error) => {
        console.info(`【系统断开】${setTime(Date.parse(new Date()))}${JSON.stringify(error)}`);
      });
      /* 链接错误 */
      SocketService.on('connect_error', (error) => {
        console.error(`【系统链接错误】${setTime(Date.parse(new Date()))}${JSON.stringify(error)}`);
      });
    },
    /**
     * 获取系统通知
     * @returns {Promise<void>}
     */
    async getConfiguration() {
      await this.$store.dispatch('index/getConfiguration', { keywords: 'NOTICE', type: 'notice' });
    }
  }
};
</script>

<style lang="less">
#webPush {
  margin-top: 10px !important;

  .el-carousel__container {
    height: 60px !important;
    margin: 0 5px;
  }
}
</style>
