<template>
    <el-main>
        <el-form :model="form" ref="mail" :rules="rules">
            <el-form-item prop="email">
                <el-input v-model.trim="form.email" clearable placeholder="请输入邮箱账号" show-icon>
                    <template #prepend><i class="el-icon-s-custom"/></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="verify_code">
                <el-input v-model.number="form.verify_code" :readonly="!form.email" clearable maxlength="8" placeholder="请输入邮箱验证码" show-icon>
                    <template #append>
                        <el-button :disabled="!form.email" type="info" @click="getMailCode" plain>{{ codeValue }}</el-button>
                    </template>
                </el-input>
            </el-form-item>
        </el-form>
        <el-footer style="text-align: center;height: 30px !important">
            <el-button type="primary" @click="loginSYS('mail')" plain>登录系统</el-button>
        </el-footer>
    </el-main>
</template>

<script>
export default {
    name: 'Mail',
    data() {
        return {
            form: {email: '', verify_code: '', loginType: 'mail'},
            codeValue: '获取验证码',
            mailLogin: this.$store.state.login.mailLogin,
            rules: {
                email: [{required: true, message: '请输入邮箱', trigger: 'blur', type: 'email'}],
                verify_code: [{required: true, message: '请输入邮箱验证码', trigger: 'blur'}]
            }
        };
    },
    created() {
        /**
         * todo:邮箱验证码定时器
         * @return {Promise<void>}
         */
        setInterval(() => {
            if (this.times >= 0 && this.mailLogin) {
                this.getMailCode();
                return false;
            }
            this.codeValue = '获取验证码';
            this.times = 60;
        }, 1000);
    },
    methods: {
        /**
         * todo:获取邮箱验证码
         */
        async getMailCode() {
            if (this.mailLogin) {
                this.codeValue = this.times-- + ' s';
                return false;
            }
            await this.$store.dispatch('login/sendMail', {email: this.form.email});
        },
        /**
         * todo:登录系统
         * @param formName
         */
        loginSYS(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    return false;
                }
                this.$emit('loginSYS', this.form);
            });
        }
    }
};
</script>

<style scoped>

</style>
