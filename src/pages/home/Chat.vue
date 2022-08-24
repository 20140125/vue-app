<template>
  <HomeLayout header-title="魔盒逗图 -- 联系人">
    <template #body>
      <div class="user-chat__menu grid">
        <div v-for="(char, index) in indexLists" :key="index" class="index-menu__number">
          <div class="char" v-html="char"></div>
          <div v-for="(item, key) in usersLists[index]" :key="key">
            <div class="user-chat__menu-item">
              <el-avatar :src="item.client_img"></el-avatar>
              <div :style="`${item.online ? 'color: #409EFF' : 'color: #9d9a9a'}`" class="user-online">
                {{ item.online ? `[在线] ${item.client_name}` : `[离线] ${item.client_name}` }}
                <br/>
                <span class="desc">{{ (item.centerInfo || {}).desc || '' }}</span>
              </div>
            </div>
            <hr>
          </div>
        </div>
        <!-- 字母侧边栏定位 -->
        <ul>
          <li v-for="(char, index) in indexLists" @click="scrollToPosition(index)" :key="index">{{ char }}</li>
        </ul>
      </div>
      <ErrorPage v-if="error.code !== '20000'"></ErrorPage>
    </template>
  </HomeLayout>
</template>

<script>
import HomeLayout from '@/components/HomeLayout';
import ErrorPage from '@/components/home/ErrorPage';

export default {
  name: 'Chat',
  components: { ErrorPage, HomeLayout },
  data() {
    return {
      usersLists: [],
      indexLists: []
    };
  },
  computed: {
    error() {
      return this.$store.state.errorInfo;
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.Permission) {
        this.getConnection(this.Permission.websocket);
        return false;
      }
      this.$store.commit('UPDATE_MUTATIONS', { errorInfo: { code: '20003', message: 'Please Login System'} });
    });
  },
  methods: {
    /**
     * todo:长链接
     * @param websocket
     */
    getConnection(websocket) {
      const webSocketServer = new WebSocket(websocket);
      /* 监听打开事件 */
      webSocketServer.addEventListener('open', () => {
        const jsonStr = {
          type: 'login',
          from_client_id: this.Permission.uuid,
          client_name: this.Permission.username,
          room_id: this.Permission.room_id,
          client_img: this.Permission.avatar_url,
          uuid: this.Permission.uuid
        };
        webSocketServer.send(JSON.stringify(jsonStr));
      });
      /* 监听发送消息事件 */
      webSocketServer.addEventListener('message', (events) => {
        const message = JSON.parse(events.data);
        switch (message.type) {
          case 'ping':
            webSocketServer.send('{"type":"ping"}');
            break;
          case 'login':
            /* 用户列表 */
            const clientLists = (message || {}).client_lists || [];
            this.indexLists = [];
            for (let i in clientLists) {
              if (this.indexLists.indexOf(clientLists[i].char) < 0) {
                this.indexLists.push(clientLists[i].char);
              }
            }
            this.indexLists.sort();
            this.usersLists = [];
            const online = [];
            for (let j in this.indexLists) {
              const item = [];
              for (let k in clientLists) {
                if (this.indexLists[j] === clientLists[k].char) {
                  item.push(clientLists[k]);
                }
              }
              this.usersLists[j] = item;
            }
            /* 数组前面追加 */
            this.indexLists.unshift('↑');
            /* 获取在线用户 */
            this.usersLists.forEach(item => {
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
            this.usersLists.unshift(online);
            break;
        }
      });
      webSocketServer.addEventListener('close', (e) => {
        console.error(`链接被关闭：${JSON.stringify(e)}`);
      });
      webSocketServer.addEventListener('error', (e) => {
        console.error(`链接异常：${JSON.stringify(e)}`);
      });
    },
    /**
     * todo:场次定位
     * @param index
     */
    scrollToPosition(index) {
      document.getElementsByClassName('index-menu__number')[index].scrollIntoView();
    }
  }
};
</script>
