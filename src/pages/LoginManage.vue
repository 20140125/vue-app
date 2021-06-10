<template>
    <div :style="bgStyle">
        <el-row :gutter="24" style="padding-top: 10%">
            <el-col :xl="{'span':8,'offset':8}" :lg="{'span':12,'offset':6}" :md="{'span':16,'offset':4}" :sm="{'span':20,'offset':'2'}" :xs="{'span':24}">
                <el-header style="text-align: center;font-size: 20px;font-weight: 800" v-html="headerTitle"></el-header>
                <el-tabs type="border-card" @tab-click="getTabs" v-model="activeModel" style="margin: 0 5px">
                    <el-tab-pane label="账号密码登录" name="password">
                        <Password :password-attr="passwordAttr" @refreshCode="refreshCode" @logSys="logSys"></Password>
                    </el-tab-pane>
                    <el-tab-pane label="邮箱验证码登录/注册" name="email">
                        <Email @logSys="logSys"></Email>
                    </el-tab-pane>
                    <el-tab-pane label="账户授权登录/注册" name="oauth" style="text-align: center">
                        <Oauth></Oauth>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import apiLists from '../api/api'
    import { setRandom } from '../api/func'
    import $url from '../api/url'
    import { mapActions } from 'vuex'
    import Password from '../components/login/Password'
    import Email from '../components/login/Email'
    import Oauth from '../components/login/Oauth'
    export default {
        name: 'login',
        components: { Oauth, Email, Password },
        data () {
            return {
                bgStyle: {
                    'background': 'url(' + require('../assets/u0.jpg') + ')',
                    'background-repeat': 'no-repeat',
                    'height': (window.innerHeight) + 'px'
                },
                passwordAttr: { styleWidth: { width: '76%' }, verifyCode: '', dialogWidth: '32%' },
                innerWidth: window.innerWidth,
                activeModel: 'password',
                headerTitle: '账号密码登录'
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.refreshCode()
                if (this.innerWidth < 768) {
                    this.passwordAttr.styleWidth = { width: '55%' }
                    this.passwordAttr.dialogWidth = '100%'
                } else if (this.innerWidth >= 768 && this.innerWidth < 992) {
                    this.passwordAttr.dialogWidth = '83.3333%'
                    this.passwordAttr.styleWidth = {width: '79%'}
                } else if (this.innerWidth >= 992 && this.innerWidth < 1200) {
                    this.passwordAttr.dialogWidth = '65.3333%'
                    this.passwordAttr.styleWidth = {width: '78%'}
                } else if (this.innerWidth >= 1200 && this.innerWidth < 1920) {
                    this.passwordAttr.dialogWidth = '49.3333%'
                    this.passwordAttr.styleWidth = {width: '79%'}
                } else if (this.innerWidth >= 1920) {
                    this.passwordAttr.dialogWidth = '32.3333%'
                    this.passwordAttr.styleWidth = {width: '76%'}
                }
            })
        },
        methods: {
            ...mapActions(['loginSystem', 'getOauthConfig']),
            /**
             * TODO:tabs切换
             * @param row
             */
            getTabs: function (row) {
                this.headerTitle = row.label
                if (row.name === 'oauth') {
                    this.getOauthConfig('Oauth')
                }
            },
            /**
             * todo:登录系统
             * @param form
             */
            logSys: async function (form) {
                await this.loginSystem(form)
            },
            /**
             * todo:验证码刷新
             */
            refreshCode: function () {
                this.passwordAttr.verifyCode = setRandom(6, 'number')
                /* 验证码上报 */
                apiLists.ReportSys($url.reportCode, { verify_code: this.passwordAttr.verifyCode })
            }
        }
    }
</script>
<style>

</style>
