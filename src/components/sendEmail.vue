<template>
    <div>
        <el-form :model="users" label-width="100px" ref="userForm" :rules="rules">
            <el-form-item label="邮件发送:" prop="email">
                <el-input placeholder="请输入你的邮箱账号" v-model="users.email"></el-input>
            </el-form-item>
        </el-form>
        <el-footer style="text-align: center">
            <el-button @click="cancelDialog('userForm')" plain>取 消</el-button>
            <el-button type="primary" @click="sendEmail('userForm')" plain>确 定</el-button>
        </el-footer>
    </div>
</template>

<script>
    import $url from '../api/url';
    import apiLists from '../api/api'
    export default {
        name: "sendEmail",
        data() {
            return {
                users:{ email:'' },
                rules:{
                    email:[{required:true,type:'email',message:'请输入正确的邮箱账号',trigger:'blur'}]
                },
            }
        },
        methods:{
            /**
             * todo:关闭弹框
             * @param userForm
             */
            cancelDialog:function (userForm) {
                this.$refs[userForm].resetFields();
                this.$emit('close')
            },
            /**
             * todo:发送邮件
             * @param userForm
             */
            sendEmail:function (userForm) {
                this.$refs[userForm].validate(valid=>{
                   if (!valid) {
                       return false;
                   }
                })
            }
        }
    }
</script>

<style scoped>

</style>
