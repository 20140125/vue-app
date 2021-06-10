<template>
    <el-main>
        <el-form :model="form" ref="mail" :rules="rules">
            <el-form-item prop="email">
                <el-input v-model.trim="form.email" clearable type="text" placeholder="email" autocomplete="off">
                    <template slot="prepend"><i class="el-icon-s-custom"/></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="verify_code">
                <el-input v-model.number="form.verify_code" clearable maxlength="8" ref="code" type="text" placeholder="verify code" autocomplete="off">
                    <el-button slot="append" @click="getEmailCode" :disabled="disabled">{{codeValue}}</el-button>
                </el-input>
            </el-form-item>
        </el-form>
        <el-footer style="text-align: center;height: 30px !important">
            <el-button type="primary" @click="logSys('mail')" plain>确 定</el-button>
            <el-button plain @click="resetForm('mail')">取 消</el-button>
        </el-footer>
    </el-main>
</template>

<script>
    import apiLists from '../../api/api'

    export default {
        name: 'Email',
        data () {
            return {
                form: { email: '', verify_code: '', loginType: 'mail' },
                disabled: false,
                times: 60,
                codeValue: '获取验证码',
                rules: {
                    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '邮箱格式不正确' }],
                    verify_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
                }
            }
        },
        created () {
            /**
             * todo:邮箱验证码定时器
             */
            setInterval(() => {
                if (this.times >= 0 && this.disabled) {
                    this.getEmailCode()
                    return false
                }
                this.codeValue = '获取验证码'
                this.times = 60
            }, 1000)
        },
        methods: {
            /**
             * TODO:获取验证码
             */
            getEmailCode: async function () {
                if (this.disabled) {
                    this.codeValue = this.times-- + ' s'
                    return false
                }
                let params = { email: this.form.email }
                let response = await apiLists.SendEmail(params).catch(error => {
                    this.$message.error(error)
                })
                if (response && response.data.code === 200) {
                    this.disabled = true
                    this.$message({type: 'success', message: response.data.msg})
                }
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
                    let params = { verify_code: this.form.verify_code, email: this.form.email }
                    apiLists.VerifyCode(params).then(response => {
                        if (response && response.data.code === 200) {
                            this.$emit('logSys', this.form)
                            return
                        }
                        this.form.verify_code = ''
                    })
                })
            },
            /**
             * todo：表单重置
             * @param formName
             */
            resetForm (formName) {
                this.$refs[formName].resetFields()
            }
        }
    }
</script>

<style scoped>

</style>
