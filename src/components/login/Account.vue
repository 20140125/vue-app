<template>
    <el-main>
        <el-form :model="form" ref="password" :rules="rules" label-position="left">
            <el-form-item prop="email">
                <el-input placeholder="请输入邮箱账号" show-icon clearable v-model="form.email">
                    <template #prepend><i class="el-icon-user"></i></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" placeholder="请输入密码" show-icon clearable v-model.trim="form.password">
                    <template #prepend><i class="el-icon-key"></i></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="verify_code">
                <el-input placeholder="请输入验证码" maxlength="6" :style="accountAttr.style" show-icon clearable v-model.trim="form.verify_code">
                    <template #prepend><i class="el-icon-postcard"></i></template>
                </el-input>
                <Identify style="float: right"  @click="refreshCode" :identify-code="accountAttr.verifyCode"></Identify>
            </el-form-item>
        </el-form>
        <el-footer style="text-align: center;height: 30px !important">
            <el-button type="primary" @click="loginSYS('password')" plain>登录系统</el-button>
        </el-footer>
    </el-main>
</template>

<script>
import Identify from '@/components/login/Identify'
export default {
    name: 'Account',
    components: { Identify },
    props: {
        accountAttr: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            form: { password: '', email: '', verify_code: '', loginType: 'password' },
            rules: {
                email: [{ required: true, message: '请输入邮箱账号', trigger: 'blur', type: 'email' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                verify_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
            },
        }
    },
    methods: {
        /**
         * todo:刷新验证码
         */
        refreshCode () {
            this.$emit('refreshCode')
        },
        /**
         * todo:登录系统
         * @param formName
         */
        loginSYS(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    return false
                }
                this.$emit('loginSYS', this.form)
            })
        }
    }
}
</script>

<style scoped>

</style>
