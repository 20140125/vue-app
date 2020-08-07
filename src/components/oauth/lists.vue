<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="oauthLogin">账号绑定</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="oauthLists.filter(data=>(!search || data.username.toLowerCase().includes(search.toLowerCase()) || data.oauth_type.toLowerCase().includes(search.toLowerCase())))">
            <el-table-column label="#ID" prop="id" align="center" width="100px"/>
            <el-table-column label="用户名" prop="username" align="center"/>
            <el-table-column label="头像" align="center">
                <template slot-scope="scope">
                    <el-image :src="scope.row.avatar_url"
                              style="width: 50px; height: 50px"
                              fit="cover"
                              :title="scope.row.username"
                              :preview-src-list="[scope.row.avatar_url]">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column label="用户邮箱" prop="email" align="center" show-tooltip-when-overflow/>
            <el-table-column label="账号来源" prop="oauth_type" align="center"/>
            <el-table-column label="创建时间" prop="created_at" width="160px" align="center"/>
            <el-table-column label="修改时间" prop="updated_at" width="160px" align="center"/>
            <el-table-column label="操作" align="right" width="200px">
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
        <el-dialog :title="title" :visible.sync="syncVisible" :modal="modal" :width="dialogWidth" :center="center" :destroy-on-close="destroy_on_close">
            <el-form :label-width="labelWidth" :model="OauthModel" :ref="reFrom" :rules="rules">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="OauthModel.username"/>
                </el-form-item>
                <el-form-item label="用户头像" prop="avatar_url">
                    <Upload :avatar_url="OauthModel.avatar_url" :username="OauthModel.username" @uploadSuccess="uploadSuccess"/>
                </el-form-item>
                <el-form-item label="邮箱账号" prop="email">
                    <el-input v-model="OauthModel.email" ref="bindEmail">
                        <el-button slot="append" @click="sendMail(OauthModel)" icon="el-icon-edit">绑定邮箱</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code" v-if="showCode">
                    <el-input v-model.number="OauthModel.code" maxlength="8" @blur="checkCode(OauthModel)"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="OauthModel" :url="url" :refs="refs" v-on:success="success"/>
            </div>
        </el-dialog>
        <!---弹框-->
        <!---账号授权绑定-->
        <el-dialog :visible.sync = 'oauthVisible' title="账户授权登录" :destroy-on-close="destroy_on_close" :center="center" :width="dialogWidth">
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
            let verifyCode =  (rule,value,callback) => {
                try {
                    if (!Number.isInteger(value)) {
                        callback(new Error('验证码格式错误'));
                    }
                    if (value.toString().length!==6) {
                        callback(new Error('请输入6位长度的验证码'));
                    }
                    callback();
                }catch (e) {
                    callback(new Error('验证码格式错误'))
                }
            }
            return {
                oauthLists:[],
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
                showCode:false,
                showPassword:false,
                oauthVisible:false,
                cgi:{
                    remove:$url.oauthDelete,
                    status:$url.oauthUpdate,
                    update:$url.oauthUpdate,
                    uploadUrl:process.env.API_ROOT+$url.fileUpload
                },
                rules:{
                    username:[{required:true,message:'请输入用户名',trigger:'blur'}],
                    avatar_url:[{required:true,message:'请上传用户头像',trigger:'blur'}],
                    email:[{required:true,message:'请输入邮箱',trigger:'blur'},{type:'email',message: '邮箱格式不正确'}],
                    code:[{required:true,message:'请输入验证码',trigger:'blur'},{validator:verifyCode,trigger: 'blur'}],
                    remember_token:[{required:true,message:'请输入用户标识',trigger:'blur'}],
                },
                btn:{}
            }
        },
        computed:{
            ...mapGetters(['userInfo','oauthConfig','dialogWidth']),
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
                apiLists.OauthBind({oauth_type:href,remember_token:this.userInfo.token}).then(response=>{
                    if (response && response.data.code === 200) {
                        if (response.data.item.oauth_url) {
                            window.open(response.data.item.oauth_url,'_self');
                            return false;
                        }
                        let pushParams = {label:'账户绑定',name:response.data.item.local};
                        this.activeName = pushParams.name;
                        this.addCurrTabs(pushParams);
                        this.addTabs(pushParams);
                        this.$router.push({path:pushParams.name});
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
                this.$refs[this.reFrom].validate((valid)=>{
                    if (valid) {
                        let params = {email:oauthObject.email, id:oauthObject.id, username:oauthObject.username, remember_token:oauthObject.remember_token};
                        apiLists.SendEmail(params).then(response=>{
                            if (response && response.data.code === 200) {
                                this.$message({type:'success',message:response.data.msg});
                                this.showCode = true;
                            }
                        });
                    }
                });
            },
            /**
             * TODO：校验邮箱验证码
             * @param oauthObject
             */
            checkCode:function(oauthObject) {
                let params = {code:oauthObject.code, email:oauthObject.email};
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
                this.btn = func.set_btn_status(this.$route.path,this.$route.name,this.userInfo.auth);
                this.getOauthLists(this.page,this.limit);
            });
        }
    }
</script>

<style scoped>

</style>
