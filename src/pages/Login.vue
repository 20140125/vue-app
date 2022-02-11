<template>
  <div :style="bgStyle">
    <el-row :gutter="24" style="padding-top: 10%">
      <el-col :xl="{'span':8,'offset':8}" :lg="{'span':12,'offset':6}" :md="{'span':16,'offset':4}"
              :sm="{'span':20,'offset':'2'}" :xs="{'span':24}">
        <el-header style="text-align: center;font-size: 20px;font-weight: 800" v-html="header"></el-header>
        <el-tabs type="border-card" @tab-click="changeTabs" v-model="tabPane" style="margin: 0 5px">
          <el-tab-pane label="账号密码登录" name="password">
            <Account :account-attr="accountAttr" @refreshCode="refreshCode" @loginSYS="loginSYS"></Account>
          </el-tab-pane>
          <el-tab-pane label="邮箱验证码登录/注册" name="email">
            <Mail :account-attr="accountAttr" @loginSYS="loginSYS"></Mail>
          </el-tab-pane>
          <el-tab-pane label="账户授权登录/注册" name="oauth" style="text-align: center">
            <OAuth :oauth-login="oauthLogin"></OAuth>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Account from '@/components/login/Account';
import Mail from '@/components/login/Mail';
import OAuth from '@/components/login/Oauth';

export default {
  name: 'Login',
  components: { OAuth, Mail, Account },
  data() {
    return {
      bgStyle: {
        'background': 'url(' + require('../assets/chat/u0.jpg') + ')',
        'background-repeat': 'no-repeat',
        'height': (window.innerHeight) + 'px'
      },
      tabPane: 'password',
      header: '账号密码登录',
      accountAttr: { verifyCode: '', style: { width: '77.6%' }, dialogWidth: '50%' },
      innerWidth: window.innerWidth,
      oauthLogin: false
    };
  },
  created() {
    this.$nextTick(() => {
      this.__initDialog();
    });
  },
  methods: {
    /**
     * todo:初始化
     */
    __initDialog() {
      this.refreshCode();
      if (this.innerWidth < 768) {
        this.accountAttr.dialogWidth = '100%';
        this.accountAttr.style = { width: '55%' };
      } else if (this.innerWidth >= 768 && this.innerWidth < 992) {
        this.accountAttr.dialogWidth = '83.3333%';
        this.accountAttr.style = { width: '79%' };
      } else if (this.innerWidth >= 992 && this.innerWidth < 1200) {
        this.accountAttr.dialogWidth = '65.3333%';
        this.accountAttr.style = { width: '78%' };
      } else if (this.innerWidth >= 1200 && this.innerWidth < 1920) {
        this.accountAttr.dialogWidth = '49.3333%';
        this.accountAttr.style = { width: '79%' };
      } else if (this.innerWidth >= 1920) {
        this.accountAttr.dialogWidth = '32.3333%';
        this.accountAttr.style = { width: '77.6%' };
      }
    },
    /**
     * todo:切换tab
     * @param tab
     */
    changeTabs(tab) {
      this.oauthLogin = tab.props.name === 'oauth';
      this.header = tab.props.label;
    },
    /**
     * todo:设置验证码
     * @return {Promise<void>}
     */
    async refreshCode() {
      this.accountAttr.verifyCode = (Math.random() * 1000000 | 0).toString();
      await this.$store.dispatch('login/reportCode', { verify_code: this.accountAttr.verifyCode });
    },
    /**
     * todo:用戶登錄
     * @param form
     * @return {Promise<void>}
     */
    async loginSYS(form) {
      await this.$store.dispatch('login/loginSYS', form);
    }
  }
};
</script>

<style scoped>

</style>
