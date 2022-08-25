<template>
  <HomeLayout :header-title="receiver.client_name" ref="homeLayout">
    <template #body>
      <div class="message-box" :style="cssStyle.box">
        <div class="message-content" :style="cssStyle.content">
          <div v-for="(item, index) in messageLists" :key="index">
            <div :class="`${item.from_client_name === Permission.username ? 'self-state' : ''}`" class="user-info__message">
              <el-avatar :class="`${item.from_client_name === Permission.username ? 'self-state' : ''}`" :size="40" :src="item.client_img"></el-avatar>
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
          <div ref="message" class="input-content" contentEditable="true" @keyup.enter="sendMessage"></div>
          <i class="el-icon-picture-outline-round"></i>
          <i class="el-icon-circle-plus-outline"></i>
        </div>
      </div>
    </template>
  </HomeLayout>
</template>

<script>
import HomeLayout from '@/components/HomeLayout';
import { scrollToBottom, setTime } from '@/utils/func';
import Push from 'push.js';

export default {
  name: 'Message',
  components: { HomeLayout },
  data() {
    return {
      uploadData: {
        token: this.$store.state.baseLayout.token || window.localStorage.getItem('token'),
        file_type: 'text',
        round_name: true
      },
      cssStyle: { box: '', content: '' }
    };
  },
  computed: {
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
     * todo:发送消息
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
      this.$refs.homeLayout.sendMessage(JSON.stringify(sayJSON))
      this.messageLists.push(sayJSON);
      this.$store.commit('index/UPDATE_MUTATIONS', { messageLists: this.messageLists });
      setTimeout(() => {
        scrollToBottom('.message-content');
      }, 100);
      this.$refs.message.innerHTML = '';
    },
    /**
     * todo:图片选择
     * @param item
     */
    clickEmotion(item) {
      this.$refs.message.innerHTML += '<img src=\'' + item.icon + '\' width=\'30px\' height=\'30px\' style=\'object-fit: contain;\' alt=\'' + item.title + '\'>';
    },
    /**
     * todo:图片上传成功
     * @param response
     */
    uploadSuccess(response) {
      if (response.code === 200) {
        switch ((((response || {}).item || {}).lists || {}).file_type) {
          case 'image':
            this.$refs.message.innerHTML += '<img src=\'' + (((response || {}).item || {}).lists || {}).src + '\' width=\'100px\' height=\'100px\' style=\'object-fit: contain;\' alt=\'' + this.userInfo.username + '\'>';
            break;
          case 'video':
            this.$refs.message.innerHTML += '<video src=\'' + (((response || {}).item || {}).lists || {}).src + '\' width=\'200px\' height=\'200px\' autoplay controls=\'controls\'>';
            break;
          default:
            this.$refs.message.innerHTML += '';
            break;
        }
      }
    },
    /**
     * todo；上传之前
     * @param file
     */
    beforeUpload(file) {
      if (['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
        this.uploadData.file_type = 'image';
        if (file.size > 2 * 1024 * 1024) {
          this.$message.error('upload image size error');
          return false;
        }
      }
      if (['audio/mp4', 'video/mp4'].includes(file.type)) {
        this.uploadData.file_type = 'video';
        if (file.size > 5 * 1024 * 1024) {
          this.$message.error('upload video size error');
          return false;
        }
      }
    },
    /**
     * todo:推送弹框消息
     * @param message
     */
    pushMessage(message) {
      Push.create('你有未读消息', {
        body: message,
        requireInteraction: true,
        icon: 'https://www.fanglonger.com/favicon.ico',
        timeout: 60000
      });
    },
    /**
     * todo:控制台信息
     * @param message
     * @returns {Promise<void>}
     */
    async pushNotice(message) {
      await this.$store.commit('index/UPDATE_MUTATIONS', { configuration: { notice: { timestamp: Date.parse(new Date()) / 1000, message } } });
    },
    /**
     * todo:字符串替换
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
