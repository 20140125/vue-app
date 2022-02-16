<template>
  <div id="wenPush">
    <el-carousel :interval="2000" arrow="never" direction="vertical" indicator-position="none"
                 v-if="pushMessage.length > 0">
      <el-carousel-item v-for="(item,index) in pushMessage" :key="index">
        <el-alert type="success" show-icon :title="item.message" effect="light"></el-alert>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>

import SocketIO from 'socket.io-client';
import func from '../../utils/func';

export default {
  name: 'WebPush',
  data() {
    return {
      pushMessage: [{
        message: JSON.stringify(this.$store.state.login.userInfo.weather),
        timestamp: Date.parse(new Date()) / 1000
      }]
    };
  },
  mounted() {
    this.$nextTick(() => {
      const SocketService = SocketIO(this.$store.state.login.userInfo.socket, {
        transports: ['websocket'],
        autoConnect: true
      });
      /* todo:链接系统 */
      SocketService.on('connect', () => {
        console.info(`【登录系统】${func.setTime(Date.parse(new Date()))}`);
        /* todo:用户登录 */
        SocketService.emit('login', this.$store.state.login.userInfo.uuid);
      });
      /* todo:获取站内推送信息 */
      SocketService.on('notice', ($response) => {
        if ($response.length > 0) {
          let $unread = 0;
          $response.forEach(item => {
            item.disabled = (item.state === 'successfully' && item.see > 0);
            if (!item.disabled) {
              $unread += 1;
            }
          });
          this.$store.dispatch('home/saveSocketMessage', { notice: $response, unread: $unread });
        }
      });
      /* todo：获取图表信息 */
      SocketService.on('charts', ($response) => {
        this.$store.dispatch('home/saveSocketMessage', { xAxisData: $response.day, seriesData: $response.total });
      });
      /* todo:站内消息推送 */
      SocketService.on('new_message', ($message) => {
        this.pushMessage.push({ message: $message, timestamp: Date.parse(new Date()) / 1000 });
        let clientLog = { time: func.setTime(Date.parse(new Date()), 'ch'), message: $message, username: '系统公告' };
        this.$store.dispatch('chat/addClientLog', clientLog);
      });
      /* todo:链接断开 */
      SocketService.on('disconnect', ($error) => {
        console.info(`【系统断开】${func.setTime(Date.parse(new Date()))}${JSON.stringify($error)}`);
      });
      /* todo:链接错误 */
      SocketService.on('connect_error', ($error) => {
        console.error(`【系统链接错误】${func.setTime(Date.parse(new Date()))}${JSON.stringify($error)}`);
      });
    });
  }
};
</script>

<style lang="less">
#wenPush {
  .el-carousel__container {
    height: 80px !important;
    line-height: 25px;
  }
}
</style>
