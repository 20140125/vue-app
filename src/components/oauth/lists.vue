<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-table :data="oauthLists.filter(data=>(!search || data.username.toLowerCase().includes(search.toLowerCase()) || data.oauth_type.toLowerCase().includes(search.toLowerCase())))" border>
            <el-table-column label="#" prop="id"></el-table-column>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="头像">
                <template slot-scope="scope">
                    <el-image :src="scope.row.avatar_url"
                              style="width: 50px; height: 50px"
                              fit="cover"
                              :title="scope.row.username"
                              :preview-src-list="oauthImageLists">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column label="账号来源" prop="oauth_type"></el-table-column>
            <el-table-column label="显示状态">
                <template slot-scope="scope">
                    <Radio :item="scope.row" :url="cgi.status"></Radio>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="created_at"> </el-table-column>
            <el-table-column label="修改时间" prop="updated_at"></el-table-column>
            <el-table-column label="操作" align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search"  placeholder="请输入关键词查询"></el-input>
                </template>
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="updateOauth(scope.row)">修 改</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="oauthLists" v-on:success="success"></Delete>
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
                    <el-input v-model="OauthModel.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱账号" prop="email">
                    <el-input v-model="OauthModel.email">
                        <el-button slot="append" plain type="primary" v-if="!OauthModel.code" @click="sendMail(OauthModel)" icon="el-icon-circle-plus">绑 定</el-button>
                        <el-button slot="append" plain type="primary" v-else @click="sendMail(OauthModel)" icon="el-icon-edit">修 改</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code" v-if="showCode">
                    <el-input v-model="OauthModel.code" @blur="checkCode(OauthModel)"></el-input>
                </el-form-item>
                <el-form-item label="用户头像" prop="avatar_url">
                    <Upload :avatar_url="OauthModel.avatar_url" :username="OauthModel.username" @uploadSuccess="uploadSuccess"></Upload>
                </el-form-item>
                <el-form-item label="角色" prop="role_id" v-if="username === 'admin'">
                    <el-select v-model="OauthModel.role_id" style="width: 100%">
                        <el-option v-for="(role,index) in roleLists" :key="index" :label="role.role_name" :value="role.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户状态" prop="status">
                    <el-radio-group v-model="OauthModel.status" size="small">
                        <el-radio-button label="2">关闭</el-radio-button>
                        <el-radio-button label="1">开启</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="OauthModel" :url="url" :refs="refs" v-on:success="success"></Submit>
            </div>
        </el-dialog>
        <!---弹框-->
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
    import {mapGetters} from 'vuex'
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

                cgi:{
                    remove:$url.oauthDelete,
                    status:$url.oauthUpdate,
                    update:$url.oauthUpdate,
                    uploadUrl:process.env.API_ROOT+$url.fileUpload
                },
                rules:{
                    username:[{required:true,message:'用户名不得为空',trigger:'blur'}],
                    avatar_url:[{required:true,message:'用户头像不得为空',trigger:'blur'}],
                    status:[{required:true,message:'用户状态不得为空',trigger:'change'}],
                    role_id:[{required:true,message:'角色名称不为为空',trigger:'blur'}],
                    email:[{required:true,message:'邮箱不得为空',trigger:'blur'}],
                    code:[{required:true,message:'验证码不得为空',trigger:'blur'}]
                },
                headers:{},
                onlineUser:[],
            }
        },
        computed:{
            ...mapGetters(['token','username','socketServer']),
        },
        methods:{
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.syncVisible = false;
                this.getOauthLists(this.page,this.limit)
            },
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
                        this.oauthImageLists = response.data.item.avatar_url_lists;
                        this.roleLists = response.data.item.roleLists;
                        this.loading = false;
                    }
                });
            },
            /**
             * TODO:发送邮件获取验证码
             * @param oauthObject
             */
            sendMail:function(oauthObject){
                let params = {
                    email:oauthObject.email,
                    id:oauthObject.id,
                    username:oauthObject.username,
                    remember_token:oauthObject.remember_token
                };
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
                let params = {
                    code:oauthObject.code,
                    id:oauthObject.id
                };
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
        created(){
            this.fileData.token = this.token;
            this.fileData.rand = true;
            this.headers.Authorization = `${func.set_password(func.set_random(32),func.set_random(12))}${this.token}${func.set_password(func.set_random(32),func.set_random(12))}`
        },
        mounted() {
            this.$nextTick(function () {
                this.getOauthLists(this.page,this.limit);
            });
        }
    }
</script>

<style scoped>

</style>
