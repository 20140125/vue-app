<template>
  <HomeLayout
    :back-button="true"
    :bottom-bar="false"
    :submit-button="props !== 'u_name'"
    :header-title="headerTitle"
    :saveParams="saveParams">
    <template #body>
      <!--地区选择-->
      <div class="grid" v-if="notInput.includes(props)">
        <div class="area">当前位置</div>
        <div class="grid-item">
          <div class="info">
            <i class="el-icon-location-outline"></i>
            {{  local.length > 0 ? setLocal(local) : Permission.city.replace('中华人民共和国', '') }}
          </div>
          <div class="icon">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="area">全部地区</div>
        <div class="grid-item" v-for="(item, index) in areaLists" :key="index" @click="setUsersCenter(item)">
          <div class="info" v-html="item.name"></div>
          <div class="icon">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
      <!--个性签名-->
      <div class="grid" v-else-if="props === 'desc'">
        <div class="grid-item settings">
          <el-input :placeholder="`请输入${headerTitle}`" v-model="params" show-word-limit></el-input>
        </div>
      </div>
      <!--个性标签-->
      <div class="grid" v-else-if="props === 'tags'">
        <div class="grid-item__tags settings">
          <el-tag
            v-for="(item, index) in params"
            type="success"
            effect="plain"
            :closable="params.length > 1"
            @close="removePersonTags(index)"
            :key="index">
            {{ item }}
          </el-tag>
        </div>
        <div class="grid-item__tags" v-if="params.length < 4">
          <el-tag
            type="info"
            effect="plain"
            v-for="(item, index) in personLabel"
            @click="addPersonTags(item)"
            :key="index">
            {{ item }}
          </el-tag>
        </div>
      </div>
      <!--站内通知-->
      <div class="grid" v-else-if="props === 'notice_status'">
        <div class="grid-item settings" @click="params = 1">
          <div class="info">
            <el-tag effect="plain" type="success">是</el-tag>
          </div>
          <div class="icon" v-if="parseInt(params, 10) === 1">
            <i class="el-icon-circle-check status"></i>
          </div>
        </div>
        <div class="grid-item" @click="params = 2">
          <div class="info">
            <el-tag effect="plain" type="success">否</el-tag>
          </div>
          <div class="icon" v-if="parseInt(params, 10) === 2">
            <i class="el-icon-circle-check status"></i>
          </div>
        </div>
      </div>
      <!-- 切换账号 -->
      <div class="grid" v-else-if="props === 'u_name'">
        <div class="grid-item">
          <div class="login__account">轻触头像以切换账号</div>
        </div>
        <div class="grid-item" @click="loginCurrent">
          <el-avatar :src="Permission.avatar_url" :size="60"></el-avatar>
          <div class="info">{{ params }}</div>
          <div class="icon">
            <el-tag effect="plain" type="success">当前使用</el-tag>
          </div>
        </div>
        <div class="grid-item">
          <div class="login__account">
            <el-button size="medium" type="primary" plain @click="changeAccount">
              添加账号
            </el-button>
          </div>
        </div>
      </div>
    </template>
  </HomeLayout>
</template>

<script>
import HomeLayout from '@/components/HomeLayout';
import URLS from '@/api/urls';
export default {
  name: 'UsersConfig',
  components: { HomeLayout },
  data() {
    return {
      notInput: ['ip_address', 'local'],
      props: this.$route.params.param,
      params: '',
      local: []
    };
  },
  computed: {
    /* 头部文本 */
    headerTitle() {
      return this.$store.state.index.moreInformationConfig[this.$route.params.param];
    },
    /* 地址列表 */
    areaLists() {
      return this.$store.state.area.areaLists;
    },
    /* 用户信息 */
    userSetting() {
      return JSON.parse(JSON.stringify(this.$store.state.users.userCenter));
    },
    /* 个人标签 */
    personLabel() {
      return this.$store.state.index.configuration.tags;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      if (!this.Permission) {
        await this.$router.push({ path: '/home/users' });
      }
      if (this.notInput.includes(this.props)) {
        await this.getAreaLists(1);
      }
      await this.getUserSettings();
      this.params = JSON.parse(JSON.stringify(this.$store.state.users.userCenter[this.$route.params.param] || ''));
      if (this.props === 'tags') {
        await this.getConfiguration();
      }
    });
  },
  methods: {
    /**
     * todo:切换账号
     */
    changeAccount() {
      this.$store.commit('UPDATE_MUTATIONS', { errorInfo: { code: '20003', message: 'Please Login System'} });
    },
    /**
     * todo:登录当前账号
     */
    loginCurrent() {
      this.$router.push({ path: '/home/users/more' });
    },
    /**
     * todo:获取地址列表
     * @params parentId
     * @returns {Promise<void>}
     */
    async getAreaLists(parentId) {
      await this.$store.dispatch('area/getAreaLists', { parent_id: parentId, refresh: true });
    },
    /**
     * todo:获取用户设置
     * @params refresh
     * @returns {Promise<void>}
     */
    async getUserSettings(refresh = false) {
      await this.$store.dispatch('users/getUserCenter', { refresh });
    },
    /**
     * todo:获取系统通知
     * @returns {Promise<void>}
     */
    async getConfiguration() {
      await this.$store.dispatch('index/getConfiguration', { keywords: 'PersonalLabel', type: 'tags' });
    },
    /**
     * todo:设置地区
     * @param item
     * @returns {Promise<void>}
     */
    async setUsersCenter(item) {
      !this.local.includes(item.name) ? this.local.push(item.name) : '';
      item.hasChildren ? await this.getAreaLists(item.id) : await this.saveParams();
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
     * todo:添加用户标签
     * @param item
     */
    addPersonTags(item) {
      !this.params.includes(item) ? this.params.push(item) : '';
    },
    /**
     * todo:删除用户标签
     * @param index
     */
    removePersonTags(index) {
      this.params.length > 1 ? this.params.splice(index, 1) : '';
    },
    /**
     * todo:数据保存
     * @returns {Promise<void>}
     */
    async saveParams() {
      this.userSetting[this.props] = this.local.length > 0 ? this.local : this.params;
      const loading = this.$loading({
        lock: true,
        spinner: 'el-icon-loading',
        background: 'rgba(225, 225, 224, 0.8)'
      });
      await this.$store.dispatch('UPDATE_ACTIONS', { url: URLS.userCenter.update, model: this.userSetting });
      await this.getUserSettings(true);
      await this.$router.push({ path: '/home/users/more' });
      loading.close();
    }
  }
};
</script>

<style scoped>

</style>
