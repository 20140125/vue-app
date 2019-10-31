<template>
    <div :style="bgStyle">
        <el-row :gutter="24" style="padding-top: 8%">
            <el-col :xl="{'span':8,'offset':8}" :lg="{'span':12,'offset':6}" :md="{'span':16,'offset':4}" :sm="{'span':20,'offset':'2'}" :xs="{'span':24}">
                <el-header style="text-align: center;font-size: 20px">登录系统</el-header>
                <el-main>
                    <el-form :model="users" :ref="reFrom" :rules="rules">
                        <el-form-item prop="username">
                            <el-input v-model="users.username" placeholder="username" autocomplete="off">
                                <template slot="prepend"><i class="el-icon-s-custom"></i></template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="users.password" type="password" placeholder="password" autocomplete="off">
                                <template slot="prepend"><i class="el-icon-user-solid"></i></template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </el-main>
            </el-col>
            <el-dialog :visible.sync = 'oauthVisible' title="授权登录" :destroy-on-close="destroy_on_close" :center="center" :width="dialogWidth">
                <el-button plain v-for="(oauth,index) in oauthConfig" type="primary" :key="index" v-if="oauth.status === 1" @click="goto(oauth.value)">{{oauth.name.toUpperCase()}}</el-button>
            </el-dialog>
        </el-row>
        <el-footer style="text-align: center">
            <el-button @click="resetForm(reFrom)" plain>取 消</el-button>
            <el-button type="primary" @click="onSubmit(reFrom)" plain>确 定</el-button>
            <el-button v-show="oauth" type="primary" @click="oauthLogin">授权登录</el-button>
        </el-footer>
    </div>
</template>

<script>
    import { mapActions,mapGetters } from 'vuex'
    export default {
        name: "login",
        data(){
            return {
                users:{
                    username:'',
                    password:'',
                },
                rules:{
                    username:[{required:true,message:'用户名必须',trigger:'blur'}],
                    password:[{required:true,message:'用户密码必须',trigger:'blur'}],
                },
                reFrom:'login',
                bgStyle:{
                    'background':'url('+require('../assets/u0.jpg')+')',
                    'background-repeat':'no-repeat',
                    'height':(window.innerHeight)+'px',
                },
                oauthVisible:false,
                center:true,
                destroy_on_close:true, //关闭销毁资源
                innerWidth:window.innerWidth,
                dialogWidth:'33%',
                oauth:true,
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
                        this.loginSystem(this.users);
                    }
                })
            },
            /**
             * TODO:第三方登录
             */
            oauthLogin:function(){
                this.oauthVisible = true;
                this.getOauthConfig('oauth');
            },
            goto:function(href) {
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
        created(){
            this.innerWidth = window.innerWidth;
        },
        mounted() {
            this.$nextTick(function () {
                if (this.innerWidth>=1920){
                    this.oauth = true;
                    this.dialogWidth = '33%';
                }
                if (this.innerWidth>=1200 && this.innerWidth<1920){
                    this.oauth = true;
                    this.dialogWidth = '53%';
                }
                if (this.innerWidth>=992 && this.innerWidth<1200){
                    this.oauth = false;
                    this.dialogWidth = '63%'
                }
                if (this.innerWidth>=768 && this.innerWidth<992){
                    this.oauth = false;
                    this.dialogWidth = '73%'
                }
                if (this.innerWidth<768){
                    this.oauth = false;
                    this.dialogWidth = '98%'
                }
            });
        }
    }
</script>
<style scoped>

</style>
