<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :label-width="labelWidth" :model="userModel" :ref="reFrom" :rules="rules">
            <el-form-item label="用户名称" prop="username">
                <el-input v-model.trim="userModel.username" placeholder="管理员名称"/>
            </el-form-item>
            <el-form-item label="用户头像" prop="avatar_url">
                <Upload :avatar_url="userModel.avatar_url" :username="userModel.username"
                        @uploadSuccess="uploadSuccess"/>
            </el-form-item>
            <el-form-item label="用户密码" prop="password">
                <el-input :type="!showPassword ? 'password' : 'text'" v-model="userModel.password">
                    <el-button slot="append" :icon="showPassword ? 'el-icon-open' : 'el-icon-turn-off'" @click="showPassword = !showPassword">
                        {{showPassword ? '显 示' : '隐 藏'}}
                    </el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="用户邮箱" prop="email">
                <el-input v-model.trim="userModel.email" type="email" placeholder="邮箱（请填写正确的邮箱，便于后期密码修改，密码找回）"/>
            </el-form-item>
            <el-form-item label="用户手机" prop="phone_number">
                <el-input v-model.number="userModel.phone_number" placeholder="手机号（请填写正确的手机号，便于后期密码修改，密码找回）"/>
            </el-form-item>
            <el-form-item label="显示状态" prop="status">
                <el-radio-group  v-model="userModel.status" size="small">
                    <el-radio-button label="2">关闭</el-radio-button>
                    <el-radio-button label="1">开启</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item style="text-align: center">
                <Submit :reFrom="reFrom" :model="userModel" :url="url" :refs="refs" v-on:success="success"/>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    import func from '../../api/func'
    import Submit from "../common/Submit";
    import Upload from '../common/Upload'
    import {mapGetters} from 'vuex';
    export default {
        name: "lists",
        components: {Submit,Upload},
        data(){
            return {
                labelWidth:'80px',
                loading:false,
                loadingText:'玩命加载中。。。',

                url:$url.userSave,
                refs:this.$refs,
                reFrom:'user',
                showPassword:false,
                userModel:{
                    username:'',
                    email:'',
                    password:'',
                    salt:func.set_random(),
                    status:1,
                    role_id:2,
                    phone_number:'',
                    created_at:func.get_timestamp(),
                    updated_at:func.get_timestamp(),
                    avatar_url:''
                },
                rules:{
                    username:[{required:true,message:'登陆账号不得为空',trigger:'blur'}],
                    password:[{required:true,message:'密码不得为空',trigger:'blur'}],
                    email:[{required:true,message:'邮箱不得为空',trigger:'blur'},{type:'email',message:'邮箱格式不正确',trigger:'blur'}],
                    status:[{required:true,message:'用户状态不得为空',trigger:'change'}],
                    avatar_url:[{required:true,message:'用户头像不得为空',trigger:'change'}],
                },
            }
        },
        computed:{
            ...mapGetters(['username','token',"avatarUrl"]),
        },
        methods:{
            /**
             * TODO:获取用户绑定信息
             */
            userBind:function() {
                apiLists.UserBind({'remember_token':this.token}).then(response=>{
                    if (response && response.data.code===200){
                        this.userModel = response.data.item;
                    }
                })
            },
            /**
             * TODO:图片上传回调
             * @param src
             */
            uploadSuccess:function(src) {
                this.userModel.avatar_url = src;
            },
            success:function () {

            }
        },
        mounted() {
            this.$nextTick(function () {
                this.userBind();
            })
        },
        created(){
            this.userModel.username = this.username;
            this.userModel.avatar_url = this.avatarUrl;
            this.userModel.remember_token = this.token;
        },
    }
</script>

<style scoped>

</style>
