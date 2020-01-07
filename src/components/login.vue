<template>
    <div :style="bgStyle">
        <el-row :gutter="24" style="padding-top: 8%">
            <el-col :xl="{'span':8,'offset':8}" :lg="{'span':12,'offset':6}" :md="{'span':16,'offset':4}" :sm="{'span':20,'offset':'2'}" :xs="{'span':24}">
                <el-header style="text-align: center;font-size: 20px">登录系统</el-header>
                <el-tabs type="border-card" @tab-click="getTabs" v-model="activeModel">
                    <el-tab-pane label="账号密码登录" name="password">
                        <el-main>
                            <el-form :model="passwordLogin" ref="password" :rules="passwordRules">
                                <el-form-item prop="email">
                                    <el-input v-model.trim="passwordLogin.email" type="email" placeholder="email" autocomplete="off">
                                        <template slot="prepend"><i class="el-icon-s-custom"/></template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="password">
                                    <el-input v-model.trim="passwordLogin.password" type="password" placeholder="password" autocomplete="off">
                                        <template slot="prepend"><i class="el-icon-user-solid"/></template>
                                    </el-input>
                                </el-form-item>
                            </el-form>
                            <el-footer style="text-align: center">
                                <el-button @click="resetForm('password')" plain>取 消</el-button>
                                <el-button type="primary" @click="onSubmit('password')" plain>确 定</el-button>
                            </el-footer>
                        </el-main>
                    </el-tab-pane>
                    <el-tab-pane label="邮箱验证登录" name="email">
                        <el-main>
                            <el-form :model="mailLogin" ref="mail" :rules="mailRules">
                                <el-form-item prop="email">
                                    <el-input v-model.trim="mailLogin.email" ref="email" type="email" placeholder="email" autocomplete="off">
                                        <template slot="prepend"><i class="el-icon-s-custom"/></template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="verify_code">
                                    <el-input v-model.number="mailLogin.verify_code" maxlength="8" @blur="checkCode" ref="code" type="text" placeholder="verify code" autocomplete="off">
                                        <el-button slot="append" :disabled="disabled" @click="getEmailCode">{{codeValue}}</el-button>
                                    </el-input>
                                </el-form-item>
                            </el-form>
                            <el-footer style="text-align: center">
                                <el-button @click="resetForm('mail')" plain>取 消</el-button>
                                <el-button type="primary" @click="onSubmit('mail')" plain>确 定</el-button>
                            </el-footer>
                        </el-main>
                    </el-tab-pane>
                    <el-tab-pane label="账户授权登录" name="oauth">
                        <el-button style="margin-bottom: 10px" plain v-for="(oauth,index) in oauthConfig" type="primary" :key="index" v-if="oauth.status === 1" @click="oauthLogin(oauth.value)">
                            {{oauth.name.toUpperCase()}}
                        </el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import apiLists from '../api/api';
    import $url from '../api/url'
    import { mapActions,mapGetters } from 'vuex'
    export default {
        name: "login",
        data(){
            return {
                passwordLogin:{
                    email:'',
                    password:'',
                    loginType:'password'
                },
                passwordRules:{
                    email:[{required:true,message:'用户名必须',trigger:'blur'}],
                    password:[{required:true,message:'用户密码必须',trigger:'blur'}],
                },

                mailLogin:{
                    email:'',
                    verify_code:'',
                    loginType:'mail'
                },
                mailRules:{
                    email:[{required:true,message:'用户名必须',trigger:'blur'}],
                    verify_code:[{required:true,message:'验证码必须',trigger:'blur'}],
                },
                bgStyle:{
                    'background':'url('+require('../assets/u0.jpg')+')',
                    'background-repeat':'no-repeat',
                    'height':(window.innerHeight)+'px',
                },
                activeModel:'password',
                codeValue:'获取验证码',
                times:60,
                disabled:false,
            }
        },
        computed:{
            ...mapGetters(['oauthConfig'])
        },
        methods:{
            ...mapActions(['loginSystem','getOauthConfig']),
            /**
             * todo:用户登录
             * @param formName
             */
            onSubmit:function (formName) {
                this.$refs[formName].validate((valid)=>{
                    if (valid){
                        switch (formName) {
                            case 'password':
                                this.loginSystem(this.passwordLogin);
                                break;
                            case 'mail':
                                this.loginSystem(this.mailLogin);
                                break
                        }
                    }
                })
            },
            /**
             * TODO:tabs切换
             * @param row
             */
            getTabs:function(row){
                if (row.name === 'oauth') {
                    this.getOauthConfig('oauth');
                }
            },
            /**
             * TODO:获取验证码
             */
            getEmailCode:function() {
                if (!this.users.email) {
                    this.$refs['email'].focus();
                    this.$message.warning('Please Enter Email')
                    return ;
                }
                if (this.disabled) {
                    this.codeValue = this.times-- +' s';
                    return;
                }
                let params = {email:this.users.email};
                apiLists.SendEmail(params,$url.sendEmail).then(response=>{
                    if (response && response.data.code === 200) {
                        this.$message({type:'success',message:response.data.msg});
                        this.disabled = true;
                    }
                });
            },
            /**
             * TODO：校验邮箱验证码
             */
            checkCode:function() {
                if (!this.users.verify_code) {
                    this.$refs['code'].focus();
                    this.$message.warning('Please Enter Code');
                    return ;
                }
                if (!Number.isInteger(this.users.verify_code)) {
                    this.$refs['code'].focus();
                    this.$message.warning('verification code format error');
                    return ;
                }
                if (this.users.verify_code.length>6) {
                    this.$refs['code'].focus();
                    this.$message.warning('Wrong verification code length');
                    return ;
                }
                let params = {verify_code:this.users.verify_code,email:this.users.email};
                apiLists.VerifyCode(params,$url.checkCode).then(response=>{
                    if (response && response.data.code === 200) {
                        this.$message({type:'success',message:response.data.msg});
                        return ;
                    }
                    this.users.code = '';
                });
            },
            /**
             * TODO:授权登录
             * @param href
             */
            oauthLogin:function(href) {
                window.open(href,'_self');
            },
            /**
             * todo：表单重置
             * @param formName
             */
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
        created() {
            setInterval(()=>{
                 if (this.times>=0 && this.disabled === true) {
                     this.getEmailCode();
                 } else {
                     this.codeValue = '获取验证码';
                     this.disabled = false;
                     this.times = 60;
                 }
            },1000);
        }
    }
</script>
<style scoped>

</style>
