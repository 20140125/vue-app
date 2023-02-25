<template>
  <HomeLayout ref="homeLayout" :connect-web-socket="true" :header-title="receiver.client_name">
    <template #body>
      <div :style="cssStyle.box" class="message-box">
        <div :style="cssStyle.content" class="message-content">
          <div v-for="(item, index) in selfMessage" :key="index">
            <div
              :class="`${item.from_client_name === Permission.username ? 'self-state' : ''}`"
              class="user-info__message">
              <el-avatar
                :class="`${item.from_client_name === Permission.username ? 'self-state' : ''}`"
                :size="40"
                :src="item.client_img">
              </el-avatar>
              <div
                :class="`${item.from_client_name === Permission.username ? 'self-state' : ''}`"
                class="content"
                v-html="replaceContent(item.content)">
              </div>
            </div>
          </div>
        </div>
        <!--发送消息-->
        <div class="message-input__item">
          <div ref="message" class="input-content" contentEditable="true"></div>
          <el-button size="medium" type="primary" @click="sendMessage">发送</el-button>
        </div>
      </div>
    </template>
  </HomeLayout>
</template>

<script>
import HomeLayout from '@/components/HomeLayout';
import { scrollToBottom, setTime } from '@/utils/func';

export default {
  name: 'Message',
  components: { HomeLayout },
  data() {
    return {
      uploadData: {
        token: this.$store.state.baseLayout.token,
        file_type: 'text',
        round_name: true
      },
      cssStyle: { box: '', content: '' }
    };
  },
  computed: {
    /* 自己的聊天记录 */
    selfMessage() {
      const lists = [];
      this.messageLists.forEach((item) => {
        if ((item.to_client_id === this.receiver.uuid || item.from_client_id === this.receiver.uuid) && this.Permission.uuid !== this.receiver.uuid) {
          lists.push(item);
        }
      });
      this.$store.commit('index/UPDATE_MUTATIONS', { selfMessage: lists });
      return lists;
    },
    /* 消息总列表 */
    messageLists() {
      return JSON.parse(JSON.stringify(this.$store.state.index.messageLists));
    },
    /* 接收者 */
    receiver() {
      return this.$store.state.index.receiver;
    },
    /* 用户列表 */
    userLists() {
      return this.$store.state.index.userLists;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      if (!this.Permission) {
        await this.$router.push({ path: '/' });
      }
    });
  },
  created() {
    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    this.cssStyle.box = `height: ${scrollHeight - 120}px`;
    this.cssStyle.content = `height: ${scrollHeight - 200}px`;
  },
  methods: {
    /**
     * 发送消息
     * @returns {boolean}
     */
    sendMessage() {
      if (this.$refs.message.innerHTML.trim() === '') {
        return false;
      }
      let sayJSON = {
        type: 'say',
        to_client_id: this.receiver.uuid,
        to_client_name: this.receiver.client_name,
        from_client_name: this.Permission.username,
        from_client_id: this.Permission.uuid,
        client_img: this.Permission.avatar_url,
        content: this.$refs.message.innerHTML.trim().replace('<div><br></div>', ''),
        room_id: this.receiver.room_id,
        uuid: this.receiver.uuid,
        time: setTime(Date.parse(new Date()))
      };
      this.$refs.homeLayout.sendMessage(JSON.stringify(sayJSON));
      this.messageLists.push(sayJSON);
      this.$store.commit('index/UPDATE_MUTATIONS', { messageLists: this.messageLists });
      setTimeout(() => {
        scrollToBottom('.message-content');
      }, 100);
      this.$refs.message.innerHTML = '';
    },
    /**
     * 字符串替换
     * @param content
     * @returns {*}
     */
    replaceContent(content) {
      return content.replace(new RegExp(/&lt;/g), '<').replace(new RegExp(/&gt;/g), '>').replace(new RegExp(/&quot;/g), '"');
    }
  }
};
</script>

<style scoped>

</style>
