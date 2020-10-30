<template>
    <div>
        <el-form :model="resetPass" ref="resetPass" :rules="rules" label-position="left">
            <el-form-item prop="email">
                <el-input v-model="userEmail" readonly>
                    <template slot="prepend"><i class="el-icon-user-solid"/></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input placeholder="请输入用户密码" maxlength="16" v-model="resetPass.password" show-password>
                    <template slot="prepend"><i class="el-icon-lock"/></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
                <el-input placeholder="请输入用户密码" maxlength="16" v-model="resetPass.confirmPassword" show-password>
                    <template slot="prepend"><i class="el-icon-lock"/></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="verify_code">
                <el-input placeholder="请输入邮箱验证码" maxlength="8" v-model.number="resetPass.verify_code">
                    <template slot="prepend"><i class="el-icon-picture"/></template>
                </el-input>
            </el-form-item>
        </el-form>
        <el-footer style="text-align: center">
            <el-button @click="cancelDialog('resetPass')" plain>返 回</el-button>
            <el-button type="primary" @click="submitPassword('resetPass')" plain>确 定</el-button>
        </el-footer>
    </div>
</template>

<script>
    import $url from '../api/url';
    import apiLists from '../api/api'
    export default {
        name: "resetPassword",
        props:{
            userEmail:{
                type:String,
                default:()=>''
            },
            rememberToken:{
                type:String,
                default:()=>''
            }
        },
        data(){
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.resetPass.confirmPassword !== '') {
                        this.$refs.resetPass.validateField('confirmPassword');
                    }
                    callback();
                }
            };
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.resetPass.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                resetPass:{
                    password:'',
                    confirmPassword:'',
                    email:'',
                    remember_token:''
                },
                rules:{
                    password: [{ validator: validatePass, trigger: 'blur',required:true }],
                    confirmPassword: [{ validator: validatePass2, trigger: 'blur',required: true }],
                    email:{required:true,message:'用户邮箱获取失败',type:'email'},
                    verify_code:{required:true,message:'请输入邮箱验证码',trigger:'blur'}
                },
            }
        },
        created() {
            this.resetPass.email = this.userEmail || this.resetPass.email;
            this.resetPass.remember_token = this.rememberToken || this.resetPass.remember_token
        },
        methods:{
            /**
             * todo:关闭弹框
             * @param resetPass
             */
            cancelDialog:function (resetPass) {
                this.$refs[resetPass].resetFields();
                this.$emit('close')
            },
            /**
             * todo:修改密码
             * @param resetPass
             */
            submitPassword:function (resetPass) {
                this.$refs[resetPass].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    apiLists.SaveData(this.resetPass,$url.resetPass).then(response=>{
                        if (response && response.data.code === 200) {
                            this.$message.success(response.data.msg);
                            this.$emit('autoLoginSys',this.resetPass);
                        }
                    })
                });
            }
        }
    }
</script>

<style scoped>

</style>
