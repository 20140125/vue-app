<template>
  <HomeLayout header-title="魔盒逗图 -- 通讯录">
    <template #body>
      <div class="user-chat__menu grid">
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
  computed: {
    error() {
      return this.$store.state.errorInfo;
    },
    userLists() {
      return this.$store.state.index.chatBody.userLists;
    },
    indexLists() {
      return this.$store.state.index.chatBody.indexLists;
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.Permission) {
        this.$store.commit('UPDATE_MUTATIONS', { errorInfo: { code: '20003', message: 'Please Login System'} });
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
