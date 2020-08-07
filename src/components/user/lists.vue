<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px" v-if="btn.add && userInfo.role_id === md5('1')">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addUser">添 加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="userLists.filter(data=>(!search || data.username.toLowerCase().includes(search.toLowerCase()) || data.email.toLowerCase().includes(search.toLowerCase()) || data.phone_number.toLowerCase().includes(search.toLowerCase())))">
            <el-table-column label="#" prop="id" width="80" align="center"/>
            <el-table-column label="管理员" prop="username" align="center"/>
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
            <el-table-column label="邮箱" prop="email" align="center" :show-tooltip-when-overflow="true"/>
            <el-table-column label="手机号" prop="phone_number" align="center" :show-tooltip-when-overflow="true"/>
            <el-table-column label="允许登录" v-if="userInfo.role_id === md5('1')" align="center" width="120">
                <template slot-scope="scope">
                    <Radio :item="scope.row" :url="cgi.status"/>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="created_at" width="160" align="center"/>
            <el-table-column label="修改时间" prop="updated_at" width="160" align="center"/>
            <el-table-column label="操作" align="right" width="260">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search"  placeholder="请输入关键词查询"/>
                </template>
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="updateUser(scope.row)" v-if="btn.edit">修 改</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="userLists" v-on:success="success" v-if="btn.del"/>
                </template>
            </el-table-column>
        </el-table>
        <!--table 分页-->
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
        <el-dialog :title="title" :width="dialogWidth" :visible.sync="syncVisible" :modal="modal"  :center="center">
            <el-form :label-width="labelWidth" :model="userModel" :ref="reFrom" :rules="rules">
                <el-form-item label="管理员" prop="username">
                    <el-input v-model="userModel.username" :readonly="act === 'edit'" placeholder="管理员名称"/>
                </el-form-item>
                <el-form-item label="用户头像" prop="avatar_url">
                    <Upload :avatar_url="userModel.avatar_url" :username="userModel.username"
                            @uploadSuccess="uploadSuccess"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="userModel.password" type="password" placeholder="密码"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userModel.email" type="email" placeholder="邮箱"/>
                </el-form-item>
                <el-form-item label="手机号" prop="phone_number" v-if="act === 'update'">
                    <el-input v-model="userModel.phone_number" type="email" placeholder="手机号"/>
                </el-form-item>
                <el-form-item label="角色" prop="role_id" v-if="userInfo.role_id === md5('1')">
                    <el-select v-model="userModel.role_id" style="width: 100%">
                        <el-option v-for="(role,index) in roleLists" :key="index" :label="role.role_name" :value="role.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示状态" prop="status" v-if="act === 'add'">
                    <el-radio-group  v-model="userModel.status" size="small">
                        <el-radio-button label="2">关闭</el-radio-button>
                        <el-radio-button label="1">开启</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="userModel" :url="url" :refs="refs" v-on:success="success"/>
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
    import Upload from '../common/Upload';
    import {mapGetters} from 'vuex';
    export default {
        name: "lists",
        components: {Submit, Delete, Radio,Upload},
        data(){
            return {
                userLists:[],
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
                center:true,
                loadingText:'玩命加载中。。。',

                url:'',
                refs:this.$refs,
                reFrom:'user',
                act:'',
                userModel:{},
                cgi:{
                    insert:$url.userSave,
                    update:$url.userUpdate,
                    remove:$url.userDelete,
                    status:$url.userUpdate
                },
                rules:{
                    username:[{required:true,message:'管理员名称不得为空',trigger:'blur'}],
                    password:[{required:true,message:'密码不得为空',trigger:'blur'}],
                    email:[{required:true,message:'邮箱不得为空',trigger:'blur'},{type:'email',message:'邮箱格式不正确',trigger:'blur'}],
                    phone_number:[{required:true,message:'手机号不得为空',trigger:'blur'}],
                    role_id:[{required:true,message:'角色不得为空',trigger:'change'}]
                },
                //细化权限按钮
                btn:{}
            }
        },
        computed:{
            ...mapGetters(['userInfo','dialogWidth'])
        },
        methods:{
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.getUserLists(this.page,this.limit);
                this.syncVisible = false;
            },
            /**
             * TODO:图片上传回调
             * @param src
             */
            uploadSuccess:function(src) {
                this.userModel.avatar_url = src;
            },
            /**
             * todo：获取角色列表
             * @param page
             * @param limit
             */
            getUserLists:function (page,limit) {
                let params = {  page:page, limit:limit ,level:'1'};
                apiLists.UserLists(params).then(response=>{
                    if (response && response.data.code===200){
                        this.userLists = response.data.item.data;
                        this.total = response.data.item.total;
                        this.roleLists = response.data.item.roleLists;
                        this.loading = false;
                    }
                });
            },
            /**
             * todo：每页记录数
             * @param val
             */
            sizeChange:function(val){
                this.limit = val;
                this.getUserLists(this.page,this.limit)
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange:function(val){
                this.page = val;
                this.getUserLists(this.page,this.limit)
            },
            /**
             * todo：添加管理员
             */
            addUser:function () {
                this.title='添加管理员';
                this.syncVisible = true;
                this.act = 'add';
                this.userModel = {username:'', email:'', password:'', salt:func.set_random(), status:'1', role_id:1, phone_number:'', created_at:func.get_timestamp(), updated_at:func.get_timestamp(), remember_token:''};
                this.url = this.cgi.insert;
            },
            /**
             * todo：修改管理员
             * @param item
             */
            updateUser:function (item) {
                this.title='修改管理员';
                this.syncVisible = true;
                this.userModel = item;
                this.url = this.cgi.update;
                this.act = 'update';
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.btn = func.set_btn_status(this.$route.path,this.$route.name,this.userInfo.auth);
                this.getUserLists(this.page,this.limit);
            });
        }
    }
</script>

<style scoped>

</style>
