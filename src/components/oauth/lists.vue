<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="oauthLogin">账号绑定</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="oauthLists.filter(data=>(!search || data.username.toLowerCase().includes(search.toLowerCase()) || data.oauth_type.toLowerCase().includes(search.toLowerCase())))">
            <el-table-column label="#" prop="id"/>
            <el-table-column label="用户名" prop="username"/>
            <el-table-column label="头像">
                <template slot-scope="scope">
                    <el-image :src="scope.row.avatar_url"
                              style="width: 50px; height: 50px"
                              fit="cover"
                              :title="scope.row.username"
                              :preview-src-list="[scope.row.avatar_url]">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column label="用户邮箱" prop="email" show-tooltip-when-overflow/>
            <el-table-column label="账号来源" prop="oauth_type"/>
            <el-table-column label="创建时间" prop="created_at"/>
            <el-table-column label="修改时间" prop="updated_at"/>
            <el-table-column label="操作" align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" placeholder="请输入关键词查询"/>
                </template>
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="updateOauth(scope.row)" v-if="btn.edit">修 改</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="oauthLists"
                            v-on:success="success" v-if="btn.del"/>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin: 25px 0">
            <el-pagination
                @size-change="sizeChange"
                @current-change="currentChange"
                :page-sizes="[15, 30, 50, 100]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                :current-page="page">
            </el-pagination>
        </div>
        <!--table 分页-->
        <!---弹框-->
        <el-dialog :title="title" :visible.sync="syncVisible" :modal="modal" :center="center" :destroy-on-close="destroy_on_close">
            <el-form :label-width="labelWidth" :model="OauthModel" :ref="reFrom" :rules="rules">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="OauthModel.username"/>
                </el-form-item>
                <el-form-item label="用户头像" prop="avatar_url">
                    <Upload :avatar_url="OauthModel.avatar_url" :username="OauthModel.username"
                            @uploadSuccess="uploadSuccess"/>
                </el-form-item>
                <el-form-item label="授权标识" prop="remember_token">
                    <el-input :type="!showPassword ? 'password' : ''" v-model="OauthModel.remember_token">
                        <el-button slot="append" :icon="showPassword ? 'el-icon-open' : 'el-icon-turn-off'" @click="showPassword = !showPassword">
                            {{showPassword ? '显 示' : '隐 藏'}}
                        </el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="邮箱账号" prop="email">
                    <el-input v-model="OauthModel.email" ref="bindEmail">
                        <el-button slot="append" plain type="primary" v-if="!OauthModel.code" @click="sendMail(OauthModel)" icon="el-icon-circle-plus">绑 定</el-button>
                        <el-button slot="append" plain type="primary" v-else @click="sendMail(OauthModel)" icon="el-icon-edit">修 改</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code" v-if="showCode">
                    <el-input v-model.number="OauthModel.code" @blur="checkCode(OauthModel)" ref="bindCode"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="OauthModel" :url="url" :refs="refs" v-on:success="success"/>
            </div>
        </el-dialog>
        <!---弹框-->

        <!---账号授权绑定-->
        <el-dialog :visible.sync = 'oauthVisible' title="授权登录" :destroy-on-close="destroy_on_close" :center="center" :width="dialogWidth">
            <el-button plain v-for="(oauth,index) in oauthConfig" type="primary" :key="index" v-if="oauth.status === 1" @click="goto(oauth.name)">{{oauth.name.toUpperCase()}}</el-button>
        </el-dialog>
        <!---账号授权绑定-->

    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    import func from '../../api/func'
    import Radio from "../common/Radio";
    import Delete from "../common/Delete";
    import Submit from "../common/Submit";
    import Upload from '../common/Upload'
    import {mapGetters,mapActions} from 'vuex'
    export default {
        name: "lists",
        components: {Submit, Delete, Radio,Upload},
        data(){
            return {
                oauthLists:[],
                roleLists:[],
                page:1,
                limit:15,
                total:0,
                search:'',

                title:'',
                syncVisible:false, //是否显示弹框
                modal:true, //遮盖层是否需要
                labelWidth:'80px',
                loading:true,
                destroy_on_close:true,
                center:true,
                loadingText:'玩命加载中。。。',

                url:'',
                refs:this.$refs,
                reFrom:'role',

                OauthModel:{},
                oauthImageLists:[],
                fileData:{},
                showCode:false,
                showPassword:false,
                oauthVisible:false,
                dialogWidth:'33%',

                cgi:{
                    remove:$url.oauthDelete,
                    status:$url.oauthUpdate,
                    update:$url.oauthUpdate,
                    uploadUrl:process.env.API_ROOT+$url.fileUpload
                },
                rules:{
                    username:[{required:true,message:'用户名不得为空',trigger:'blur'}],
                    avatar_url:[{required:true,message:'用户头像不得为空',trigger:'blur'}],
                    email:[{required:true,message:'邮箱不得为空',trigger:'blur'}],
                    code:[{required:true,message:'验证码不得为空',trigger:'blur'}],
                    remember_token:[{required:true,message:'授权TOKEN不得为空',trigger:'blur'}],
                },
                headers:{},
                onlineUser:[],
                btn:{},
            }
        },
        computed:{
            ...mapGetters(['token','username','oauthConfig']),
        },
        methods:{
            ...mapActions(['getOauthConfig','addTabs','addCurrTabs']),
            /**
             * TODO:第三方登录
             */
            oauthLogin:function(){
                this.oauthVisible = true;
                this.getOauthConfig('oauth');
            },
            /**
             * TODO:页面跳转
             */
            goto:function(href) {
                apiLists.OauthBind({oauth_type:href,remember_token:this.token}).then(response=>{
                    if (response && response.data.code === 200) {
                        if (response.data.item.oauth_url) {
                            window.open(response.data.item.oauth_url);
                        } else {
                            let pushParams = {label:'账户绑定',name:response.data.item.local};
                            console.log(pushParams);
                            this.activeName = pushParams.name;
                            this.addCurrTabs(pushParams);
                            this.addTabs(pushParams);
                            this.$router.push({path:pushParams.name});
                        }
                    }
                })
            },
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.syncVisible = false;
                this.getOauthLists(this.page,this.limit)
            },
            /**
             * TODO:图片上传回调
             * @param src
             */
            uploadSuccess:function(src) {
                this.OauthModel.avatar_url = src;
            },
            /**
             * todo：获取角色列表
             * @param page
             * @param limit
             */
            getOauthLists:function (page,limit) {
                let params = { page:page,limit:limit };
                apiLists.OauthLists(params).then(response=>{
                    if (response && response.data.code === 200){
                        this.oauthLists = response.data.item.data;
                        this.total = response.data.item.total;
                        this.loading = false;
                    }
                });
            },
            /**
             * TODO:发送邮件获取验证码
             * @param oauthObject
             */
            sendMail:function(oauthObject){
                if (!oauthObject.email) {
                    this.$refs['bindEmail'].focus();
                    this.$message.warning('Please Enter Email')
                    return ;
                }
                let params = {email:oauthObject.email, id:oauthObject.id, username:oauthObject.username, remember_token:oauthObject.remember_token};
                apiLists.SendEmail(params).then(response=>{
                    if (response && response.data.code === 200) {
                        this.$message({type:'success',message:response.data.msg});
                        this.showCode = true;
                    }
                });
            },
            /**
             * TODO：校验邮箱验证码
             * @param oauthObject
             */
            checkCode:function(oauthObject) {
                if (!oauthObject.code) {
                    this.$refs['bindCode'].focus();
                    this.$message.warning('Please Enter Code');
                    return ;
                }
                if (!Number.isInteger(oauthObject.code)) {
                    this.$refs['bindCode'].focus();
                    this.$message.warning('verification code format error');
                    return ;
                }
                if (oauthObject.code.length>6) {
                    this.$refs['bindCode'].focus();
                    this.$message.warning('Wrong verification code length');
                    return ;
                }
                let params = {code:oauthObject.code, id:oauthObject.id};
                apiLists.VerifyCode(params).then(response=>{
                    if (response && response.data.code === 200) {
                        this.$message({type:'success',message:response.data.msg});
                        return ;
                    }
                    oauthObject.code = '';
                });
            },
            /**
             * todo：每页记录数
             * @param val
             */
            sizeChange:function(val){
                this.limit = val;
                this.getOauthLists(this.page,this.limit)
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange:function(val){
                this.page = val;
                this.getOauthLists(this.page,this.limit)
            },
            /**
             * todo：修改
             * @param item
             */
            updateOauth:function (item) {
                this.title='修改授权用户';
                this.syncVisible = true;
                this.OauthModel = item;
                this.showCode = false;
                this.url = this.cgi.update;
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.btn = func.set_btn_status(this.$route.path,this.$route.name,this.$store.state.login.auth_url);
                this.getOauthLists(this.page,this.limit);
            });
        }
    }
</script>

<style scoped>

</style>
