<template>
    <div :style="bgStyle">
        <el-row :gutter="24" style="padding-top: 10%">
            <el-col :xl="{'span':8,'offset':8}" :lg="{'span':12,'offset':6}" :md="{'span':16,'offset':4}" :sm="{'span':20,'offset':'2'}" :xs="{'span':24}">
                <el-header style="text-align: center;font-size: 20px;font-weight: 800">{{headerTitle}}</el-header>
                <el-tabs type="border-card" @tab-click="getTabs" v-model="activeModel" style="margin: 0 5px">
                    <el-tab-pane label="账号密码登录" name="password">
                        <el-main>
                            <el-form :model="passwordLogin" ref="password" :rules="passwordRules">
                                <el-form-item prop="email">
                                    <el-input v-model.trim="passwordLogin.email" clearable type="text" placeholder="email" autocomplete="off" show-icon>
                                        <template slot="prepend"><i class="el-icon-s-custom"/></template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="password">
                                    <el-input v-model.trim="passwordLogin.password" type="password" show-password placeholder="password" autocomplete="off">
                                        <template slot="prepend"><i class="el-icon-key"/></template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="verify_code" id="login">
                                    <el-input v-model.trim="passwordLogin.verify_code" clearable :style="styleWidth" maxlength="6" type="text" placeholder="verify code" autocomplete="off">
                                        <template slot="prepend"><i class="el-icon-picture"/></template>
                                    </el-input>
                                    <div class="verify_code" @click="refreshCode">
                                        <s-identify :identify-code="verifyCode"/>
                                    </div>
                                </el-form-item>
                            </el-form>
                            <el-button type="text" @click="emailSendVisible = !emailSendVisible" style="margin-bottom: -10px">忘记密码?</el-button>
                            <el-footer style="text-align: center;height: 30px !important;">
                                <el-button @click="resetForm('password')" plain>取 消</el-button>
                                <el-button type="primary" @click="onSubmit('password')" ref="login" plain>确 定</el-button>
                            </el-footer>
                        </el-main>
                    </el-tab-pane>
                    <el-tab-pane label="邮箱验证码登录/注册" name="email">
                        <el-main>
                            <el-form :model="mailLogin" ref="mail" :rules="mailRules">
                                <el-form-item prop="email">
                                    <el-input v-model.trim="mailLogin.email" clearable type="text" placeholder="email" autocomplete="off">
                                        <template slot="prepend"><i class="el-icon-s-custom"/></template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="verify_code">
                                    <el-input v-model.number="mailLogin.verify_code" clearable maxlength="8" ref="code" type="text" placeholder="verify code" autocomplete="off">
                                        <el-button slot="append" :disabled="disabled" @click="getEmailCode">{{codeValue}}</el-button>
                                    </el-input>
                                </el-form-item>
                            </el-form>
                            <el-footer style="text-align: center;height: 30px !important;">
                                <el-button @click="resetForm('mail')" plain>取 消</el-button>
                                <el-button type="primary" @click="onSubmit('mail')" plain>确 定</el-button>
                            </el-footer>
                        </el-main>
                    </el-tab-pane>
                    <el-tab-pane label="账户授权登录/注册" name="oauth" style="text-align: center">
                        <el-button style="margin-bottom: 10px" plain v-for="(oauth,index) in oauthConfig" type="primary" :key="index" v-if="oauth.status === 1" @click="oauthLogin(oauth.value)">
                            {{oauth.name.toUpperCase()}}
                        </el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <!---邮箱确认-->
        <el-dialog :visible.sync="emailSendVisible" title="邮箱确认" center :width="dialogWidth" top="25vh" :close-on-click-modal="false" :show-close="false">
            <SendEmail v-on:close="emailSendVisible = false" @resetPassword="resetPassword" :user-email="passwordLogin.email"></SendEmail>
        </el-dialog>
        <!---邮箱确认-->
        <!---修改密码-->
        <el-dialog :visible.sync="resetPasswordVisible" title="修改密码" center :width="dialogWidth" top="25vh" :close-on-click-modal="false" :show-close="false">
            <ResetPassword v-on:close="resetPasswordVisible = false;emailSendVisible = true" @autoLoginSys="autoLoginSys" :user-email="passwordLogin.email" :remember-token="passwordLogin.remember_token"></ResetPassword>
        </el-dialog>
        <!---修改密码-->
    </div>
</template>

<script>
    import apiLists from '../api/api'
    import {setRandom} from '../api/func'
    import $url from '../api/url'
    import { mapActions, mapGetters } from 'vuex'
    import SendEmail from './sendEmail'
    import ResetPassword from './resetPassword'
    import SIdentify from './identify'
    export default {
        name: 'login',
        components: {SIdentify, ResetPassword, SendEmail},
        data () {
            return {
                passwordLogin: {
                    email: '',
                    password: '',
                    verify_code: '',
                    remember_token: '',
                    loginType: 'password'
                },
                passwordRules: {
                    email: [{required: true, message: '请输入用户名', trigger: 'blur'}, {type: 'email', message: '用户名格式不正确'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    verify_code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
                },
                mailLogin: {
                    email: '',
                    verify_code: '',
                    loginType: 'mail'
                },
                mailRules: {
                    email: [{required: true, message: '请输入邮箱', trigger: 'blur'}, {type: 'email', message: '邮箱格式不正确'}],
                    verify_code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
                },
                bgStyle: {
                    'background': 'url(' + require('../assets/u0.jpg') + ')',
                    'background-repeat': 'no-repeat',
                    'height': (window.innerHeight) + 'px'
                },
                dialogWidth: '32%',
                styleWidth: {width: '76%'},
                innerWidth: window.innerWidth,
                activeModel: 'password',
                // 邮箱验证码
                codeValue: '获取验证码',
                times: 60,
                disabled: false,
                // 登录验证码
                verifyCode: '',
                headerTitle: '账号密码登录',
                emailSendVisible: false,
                resetPasswordVisible: false
            }
        },
        computed: {
            ...mapGetters(['oauthConfig'])
        },
        mounted () {
            this.$nextTick(function () {
                this.refreshCode()
                if (this.innerWidth < 768) {
                    this.styleWidth = {width: '55%'}
                    this.dialogWidth = '100%'
                } else if (this.innerWidth >= 768 && this.innerWidth < 992) {
                    this.dialogWidth = '83.3333%'
                    this.styleWidth = {width: '79%'}
                } else if (this.innerWidth >= 992 && this.innerWidth < 1200) {
                    this.dialogWidth = '65.3333%'
                    this.styleWidth = {width: '78%'}
                } else if (this.innerWidth >= 1200 && this.innerWidth < 1920) {
                    this.dialogWidth = '49.3333%'
                    this.styleWidth = {width: '79%'}
                } else if (this.innerWidth >= 1920) {
                    this.dialogWidth = '32.3333%'
                    this.styleWidth = {width: '76%'}
                }
            })
        },
        methods: {
            ...mapActions(['loginSystem', 'getOauthConfig']),
            /**
             * todo:用户登录
             * @param formName
             */
            onSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        switch (formName) {
                        case 'password':
                            this.loginSystem(this.passwordLogin)
                            break
                        case 'mail':
                            let params = {verify_code: this.mailLogin.verify_code, email: this.mailLogin.email}
                            apiLists.VerifyCode(params).then(response => {
                                if (response && response.data.code === 200) {
                                    this.loginSystem(this.mailLogin)
                                    return
                                }
                                this.mailLogin.verify_code = ''
                            })
                            break
                        }
                    }
                })
            },
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
             * todo:验证码刷新
             */
            refreshCode: function () {
                this.verifyCode = setRandom(6, 'number')
                // 验证码上报
                apiLists.ReportSys($url.reportCode, {verify_code: this.verifyCode})
            },
            /**
             * TODO:获取验证码
             */
            getEmailCode: function () {
                if (this.disabled) {
                    this.codeValue = this.times-- + ' s'
                    return
                }
                let params = {email: this.mailLogin.email}
                apiLists.SendEmail(params).then(response => {
                    if (response && response.data.code === 200) {
                        this.$message({type: 'success', message: response.data.msg})
                        this.disabled = true
                    }
                })
            },
            /**
             * TODO:授权登录
             * @param href
             */
            oauthLogin: function (href) {
                window.open(href, '_self')
            },
            /**
             * todo：表单重置
             * @param formName
             */
            resetForm (formName) {
                this.$refs[formName].resetFields()
            },
            /**
             * todo:修改密码
             * @param item
             */
            resetPassword: function (item) {
                this.emailSendVisible = false
                this.resetPasswordVisible = true
                this.passwordLogin.email = item.email
                this.passwordLogin.remember_token = item.remember_token
            },
            /**
             * todo:系统登录
             * @param item
             */
            autoLoginSys: function (item) {
                this.passwordLogin.email = item.email
                this.passwordLogin.password = item.password
                this.passwordLogin.remember_token = item.remember_token
                this.resetPasswordVisible = false
            }
        },
        created () {
            /**
             * todo:邮箱验证码定时器
             */
            setInterval(() => {
                if (this.times >= 0 && this.disabled) {
                    this.getEmailCode()
                } else {
                    this.codeValue = '获取验证码'
                    this.disabled = false
                    this.times = 60
                }
            }, 1000)
        }
    }
</script>
<style>
    #login .verify_code {
        float: right;
    }
</style>
