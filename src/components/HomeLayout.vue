<template>
  <el-card
    v-water-mark="{ text: text, textColor: 'rgba(0, 0, 0, .2)', font: '20px consolas, sans-serif', row: 150, col: 150 }"
    shadow="always">
    <!-- 网站标题 -->
    <template #header>{{ headerTitle }}</template>
    <!-- 页面内容 -->
    <slot name="body" v-if="error.code !== '20003'"></slot>
    <!-- 底部导航栏 -->
    <div class="item">
      <div
        v-for="(item, index) in menuLists"
        :key="index"
        :class="`${item.highlight.includes(highlight) ? 'active' : ''}`"
        class="item-list"
        @click="goto(item)">
        <i :class="item.icon"></i>
        <div class="icon">{{ item.label }}</div>
      </div>
    </div>
    <!--返回顶部-->
    <ToUp></ToUp>
    <!-- 授权登录 -->
    <el-collapse-transition>
      <OauthLogin></OauthLogin>
    </el-collapse-transition>
  </el-card>
</template>

<script>
import ToUp from '@/components/common/ToUp';
import OauthLogin from '@/components/home/OauthLogin';
import { scrollToBottom } from '@/utils/func';

export default {
  name: 'HomeLayout',
  components: { ToUp, OauthLogin },
  props: {
    /* 标题设置 */
    headerTitle: {
      type: String,
      default: () => '魔盒逗图'
    },
    /* 长链接 */
    connectWebSocket: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      highlight: this.$route.name,
      text: this.$store.state.baseLayout.username
    };
  },
  computed: {
    /* 底部导航栏 */
    menuLists() {
      return this.$store.state.index.menuLists;
    },
    /* webSocket服务 */
    webSocketServer() {
      return new WebSocket(this.Permission.websocket);
    },
    /* 错误信息 */
    error() {
      return this.$store.state.errorInfo;
    },
    /* 接收者 */
    receiver() {
      return this.$store.state.index.receiver;
    },
    /* 消息列表 */
    messageLists() {
      const data = JSON.parse(JSON.stringify(this.$store.state.index.messageLists));
      const lists = [];
      data.forEach((item) => {
        if (item.to_client_id === this.receiver.uuid || item.from_client_id === this.receiver.uuid) {
          lists.push(item);
        }
      });
      return lists;
    }
  },
  mounted() {
    this.$nextTick( async () => {
      if (this.Permission && this.connectWebSocket) {
        await this.getConnection();
      }
    });
  },
  methods: {
    /**
     * todo:长链接
     */
    getConnection() {
      /* 监听打开事件 */
      this.webSocketServer.addEventListener('open', () => {
        const jsonStr = {
          type: 'login',
          from_client_id: this.Permission.uuid,
          client_name: this.Permission.username,
          room_id: this.Permission.room_id,
          client_img: this.Permission.avatar_url,
          uuid: this.Permission.uuid
        };
        this.webSocketServer.send(JSON.stringify(jsonStr));
      });
      /* 监听发送消息事件 */
      this.webSocketServer.addEventListener('message', (events) => {
        const message = JSON.parse(events.data);
        switch (message.type) {
          case 'ping':
            this.webSocketServer.send('{type:"ping"}');
            break;
          case 'login':
            /* WebSocket推送的用户 */
            const clientLists = message.client_lists || [];
            /* 字母导航 */
            const indexLists = [];
            /* 用户列表 */
            const userLists = [];
            /* 在线用户 */
            const online = [];
            /* 接收者 */
            let receiver = {};
            for (let i in clientLists) {
              if (clientLists[i].id === this.$route.params.id) {
                receiver = clientLists[i];
              }
              if (indexLists.indexOf(clientLists[i].char) < 0) {
                indexLists.push(clientLists[i].char);
              }
            }
            indexLists.sort();
            for (let j in indexLists) {
              const item = [];
              for (let k in clientLists) {
                if (indexLists[j] === clientLists[k].char) {
                  item.push(clientLists[k]);
                }
              }
              userLists[j] = item;
            }
            /* 数组前面追加 */
            indexLists.unshift('↑');
            /* 获取在线用户 */
            userLists.forEach(item => {
              item.forEach((user, index) => {
                if (user.online) {
                  online.push(user);
                  item.splice(index, 1);
                }
              });
            });
            /* 字母排序 */
            online.sort((a, b) => {
              return a.char > b.char ? 1 : -1;
            });
            /* 追加在线用户 */
            userLists.unshift(online);
            if (Object.keys(this.$store.state.index.receiver).length === 0) {
              this.$store.commit('index/UPDATE_MUTATIONS', { chatBody: { userLists, indexLists }, userLists: clientLists, receiver });
            }
            break;
          case 'say':
            if (message.to_client_id === this.Permission.uuid) {
              this.messageLists.push(message);
              this.$store.commit('index/UPDATE_MUTATIONS', { messageLists: this.messageLists });
              setTimeout(() => {
                scrollToBottom('.message-content');
              }, 100);
            }
            break;
        }
      });
      this.webSocketServer.addEventListener('close', (e) => {
        this.getConnection();
        console.error(`链接被关闭：${JSON.stringify(e)}`);
      });
      this.webSocketServer.addEventListener('error', (e) => {
        console.error(`链接异常：${JSON.stringify(e)}`);
      });
    },
    /**
     * todo:发送消息
     * @param message
     */
    sendMessage(message) {
      try {
        this.webSocketServer.send(message);
      } catch (e) {
        console.error(e);
      }
    },
    /**
     * todo:地址跳转
     * @param item
     */
    goto(item) {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(225, 225, 224, 0.8)'
      });
      this.$router.push({ path: item.path });
      setTimeout(() => {
        loading.close();
      }, item.path === '/' ? 0 : 500);
    }
  }
};
</script>

<style lang="less">
@import '../assets/common.less';
</style>
