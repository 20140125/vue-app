<template>
  <HomeLayout header-title="更多信息" :bottom-bar="false" :back-button="true">
    <template #body>
      <div class="grid">
        <div class="grid-item settings" @click="changeAccount('ip_address')">
          <div class="info">居住地址</div>
          <div class="icon">
            <span v-html="setLocal(userSetting.ip_address || [])"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item" @click="changeAccount('local')">
          <div class="info">所在地</div>
          <div class="icon">
            <span v-html="setLocal(userSetting.local || [])"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item" @click="changeAccount('desc')">
          <div class="info">个性签名</div>
          <div class="icon">
            <span v-html="userSetting.desc"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item" @click="changeAccount('tags')">
          <div class="info">个人标签</div>
          <div class="icon">
            <el-tag
              effect="plain"
              type="success"
              v-for="(item, index) in userSetting.tags"
              :key="index">
              {{ item }}
            </el-tag>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item"  @click="changeAccount('notice_status')">
          <div class="info">系统通知</div>
          <div class="icon">
            <el-tag effect="plain" type="success">
              {{ userSetting.notice_status === 1 ? '是' : '否' }}
            </el-tag>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item"  @click="changeAccount('u_name')">
          <div class="info">切换账号</div>
          <div class="icon">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </template>
  </HomeLayout>
</template>

<script>
import HomeLayout from '@/components/HomeLayout';
export default {
  name: 'MoreInformation',
  components: { HomeLayout },
  computed: {
    userSetting() {
      return this.$store.state.users.userCenter;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getUserSettings();
    });
  },
  methods: {
    /**
     * todo:获取用户设置
     * @returns {Promise<void>}
     */
    async getUserSettings() {
      await this.$store.dispatch('users/getUserCenter', {});
    },
    /**
     * todo:设置文本
     * @param value
     * @returns {string}
     */
    setLocal(value) {
      return value.join('').replace('中华人民共和国', '');
    },
    /**
     * todo:修改登录账号
     * @param param
     */
    changeAccount(param) {
      this.$router.push({ path: `/home/setting/update/${param}` });
    }
  }
};
</script>
