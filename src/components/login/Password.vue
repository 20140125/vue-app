<template>
    <el-main>
        <el-form :model="form" ref="password" :rules="rules">
            <el-form-item prop="email">
                <el-input v-model.trim="form.email" clearable type="text" placeholder="email" autocomplete="off" show-icon>
                    <template slot="prepend"><i class="el-icon-s-custom"></i></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model.trim="form.password" type="password" show-password placeholder="password" autocomplete="off">
                    <template slot="prepend"><i class="el-icon-key"></i></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="verify_code" id="login">
                <el-input v-model.trim="form.verify_code" clearable :style="passwordAttr.styleWidth" maxlength="6" type="text" placeholder="verify code" autocomplete="off">
                    <template slot="prepend"><i class="el-icon-picture"/></template>
                </el-input>
                <div class="verify_code" @click="refreshCode">
                    <Identify :identify-code="passwordAttr.verifyCode"></Identify>
                </div>
            </el-form-item>
        </el-form>
        <el-button type="text" @click="dialogAttr.visible = !dialogAttr.visible">忘记密码?</el-button>
        <el-footer style="text-align: center;height: 30px !important">
            <el-button type="primary" @click="logSys('password')" plain>确 定</el-button>
            <el-button plain @click="resetForm('password')">取 消</el-button>
        </el-footer>
        <!---忘记密码-->
        <el-dialog :visible.sync="dialogAttr.visible" :title="'邮箱确认'" center :width="passwordAttr.dialogWidth" top="25vh" :close-on-click-modal="false" :show-close="false">
            <SendEmail v-if="dialogAttr.email" @resetPassword="resetPassword" :user-email="form.email"></SendEmail>
            <ResetPassword v-if="dialogAttr.reset" @autoLoginSys="autoLoginSys" :user-email="form.email" :remember-token="form.remember_token"></ResetPassword>
        </el-dialog>
        <!---忘记密码-->

    </el-main>
</template>

<script>
    import Identify from './Identify'
    import SendEmail from './sendEmail'
    import ResetPassword from './resetPassword'
    export default {
        name: 'Password',
        components: { ResetPassword, SendEmail, Identify },
        props: {
            passwordAttr: {
                type: Object,
                default: () => {}
            }
        },
        data () {
            return {
                dialogAttr: { visible: false, email: true, reset: false },
                form: { email: '', password: '', verify_code: '', remember_token: '', loginType: 'password' },
                rules: {
                    email: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { type: 'email', message: '用户名格式不正确' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                    verify_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
                }
            }
        },
        methods: {
            /**
             * todo:刷新验证码
             * @return {Promise<void>}
             */
            refreshCode: async function () {
                this.$emit('refreshCode')
            },
            /**
             * todo:登录系统
             * @param formName
             */
            logSys: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.$emit('logSys', this.form)
                })
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
                this.form.email = item.email
                this.form.remember_token = item.remember_token
                this.dialogAttr = { visible: true, email: false, reset: true }
            },
            /**
             * todo:系统登录
             * @param item
             */
            autoLoginSys: function (item) {
                this.form.email = item.email
                this.form.password = item.password
                this.form.remember_token = item.remember_token
                this.dialogAttr = { visible: false, email: false, reset: false }
            }
        }
    }
</script>

<style scoped>
#login .verify_code {
    float: right
}
</style>
