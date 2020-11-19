<template>
    <div>
        <el-form :model="users" ref="userForm" :rules="rules">
            <el-form-item prop="email">
                <el-input placeholder="请输入你的邮箱账号" v-model="users.email">
                    <template slot="prepend"><i class="el-icon-s-custom"/></template>
                </el-input>
            </el-form-item>
        </el-form>
        <el-footer style="text-align: center">
            <el-button @click="cancelDialog('userForm')" plain>取 消</el-button>
            <el-button type="primary" @click="sendEmail('userForm')" plain>确 定</el-button>
        </el-footer>
    </div>
</template>

<script>
    import apiLists from '../api/api'
    export default {
        name: 'sendEmail',
        props: {
            userEmail: {
                type: String,
                default: () => ''
            }
        },
        data () {
            return {
                users: { email: '' },
                rules: {
                    email: [{required: true, type: 'email', message: '请输入正确的邮箱账号', trigger: 'blur'}]
                }
            }
        },
        created () {
            this.users.email = this.userEmail ? this.userEmail : this.users.email
        },
        methods: {
            /**
             * todo:关闭弹框
             * @param userForm
             */
            cancelDialog: function (userForm) {
                this.$refs[userForm].resetFields()
                this.$emit('close')
            },
            /**
             * todo:发送邮件
             * @param userForm
             */
            sendEmail: function (userForm) {
                this.$refs[userForm].validate(valid => {
                    if (!valid) {
                        return false
                    }
                    apiLists.SendEmail(this.users).then(response => {
                        if (response && response.data.code === 200) {
                            this.$message.success(response.data.msg)
                            this.$emit('resetPassword', response.data.item)
                        }
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>
