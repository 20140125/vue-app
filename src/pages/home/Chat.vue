<template>
  <HomeLayout :connect-web-socket="true" header-title="魔盒逗图 -- 通讯录">
    <template #body>
      <transition name="el-zoom-in-center">
        <div v-if="error.code === '20000'" class="user-chat__menu">
          <div v-for="(char, index) in indexLists" :key="index" class="index-menu__number">
            <div class="char" v-html="char"></div>
            <div v-for="(item, key) in userLists[index]" :key="key">
              <div class="user-chat__menu-item" @click="receiveMessage(item)">
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
            <li v-for="(char, index) in indexLists" :key="index" @click="scrollToPosition(index)">{{ char }}</li>
          </ul>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <ErrorPage v-if="error.code === '40001'"></ErrorPage>
      </transition>
    </template>
  </HomeLayout>
</template>

<script>
import HomeLayout from '@/components/HomeLayout';
import ErrorPage from '@/components/home/ErrorPage';

export default {
  name: 'Chat',
  components: { ErrorPage, HomeLayout },
  computed: {
    /* 错误信息 */
    error() {
      return this.$store.state.errorInfo;
    },
    /* 用户列表 */
    userLists() {
      return this.$store.state.index.chatBody.userLists;
    },
    /* 导航栏列表 */
    indexLists() {
      return this.$store.state.index.chatBody.indexLists;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.commit('UPDATE_MUTATIONS', { errorInfo: this.$store.state.index.error.success });
      if (!this.Permission) {
        setTimeout(() => {
          this.$store.commit('UPDATE_MUTATIONS', { errorInfo: this.$store.state.index.error.login });
        }, 500);
      }
    });
  },
  methods: {
    /**
     * todo:设置接收者消息
     * @param item
     * @returns {Promise<void>}
     */
    receiveMessage(item) {
      this.$store.commit('index/UPDATE_MUTATIONS', { receiver: item });
      this.$router.push({ path: `/home/message/${item.id}` });
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
