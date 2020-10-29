<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px" v-if="btn.add">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addRole">添 加</el-button>
            </el-form-item>
        </el-form>
        <!--table 表格-->
        <el-table :data="roleLists.filter(data=>(!search || data.role_name.includes(search)))">
            <el-table-column label="#ID" prop='id' sortable align="center" width="100px"></el-table-column>
            <el-table-column label="角色名称" prop="role_name" align="center"></el-table-column>
            <el-table-column label="显示状态" v-if="btn.edit" align="center">
                <template slot-scope="scope">
                    <Radio :item="scope.row" :url="cgi.status"></Radio>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" sortable prop="created_at" align="center"></el-table-column>
            <el-table-column label="修改时间" sortable prop="updated_at" align="center"></el-table-column>
            <el-table-column label="操作" align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" placeholder="请输入关键词查询"></el-input>
                </template>
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" v-if="btn.edit" size="mini" @click="updateRole(scope.row)">修 改</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="roleLists" v-on:success="success" v-if="btn.del"></Delete>
                </template>
            </el-table-column>
        </el-table>
        <!--table 表格-->
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
        <el-dialog :title="title" :visible.sync="syncVisible" :width="dialogWidth" :center="true">
            <el-form :label-width="labelWidth" :model="roleModel" :ref="reFrom" label-position="left">
                <el-form-item label="角色名称：" prop="role_name" :rules="[{ required:true,message:'角色名称不得为空',trigger:'blur' }]">
                    <el-input v-model="roleModel.role_name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="权限列表：" prop="auth_ids" :rules="[{required:true,message:'请选择权限',trigger:'change'}]">
                    <el-transfer :titles="['所有', '拥有']" :button-texts="['移除', '添加']" v-model="defaultChecked" :data="authLists" filterable @change="handleChange"></el-transfer>
                </el-form-item>
                <el-form-item required label="状态：" prop="status" v-if="reFrom === 'created'">
                    <Status :status="roleModel.status" @changeStatus="changeStatus"></Status>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="roleModel" :url="url" :refs="refs" v-on:success="success"></Submit>
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
    import {mapGetters} from "vuex";
    import Status from "../common/Status";
    export default {
        name: "lists",
        components: {Status, Submit, Delete, Radio},
        data(){
            return {
                roleLists:[],
                loading:true,
                loadingText:'玩命加载中。。。',
                authLists:[],
                defaultChecked:[],
                search:'',
                limit:15,
                page:1,
                total:0,
                title:'',
                syncVisible:false, //是否显示弹框
                labelWidth:'100px',
                url:'',
                refs:this.$refs,
                reFrom:'created',
                roleModel:{},
                cgi:{insert:$url.roleSave, update:$url.roleUpdate, remove:$url.roleDelete, status:$url.roleUpdate},
                //细化权限按钮
                btn:{},
            }
        },
        computed:{
            ...mapGetters(['userInfo','dialogWidth']),
        },
        methods:{
            /**
             * todo:修改状态
             * @param status
             */
            changeStatus:function (status) {
                this.roleModel.status = status
            },
            /**
             * todo：关闭弹框
             * @param item
             */
            success:function(item){
                this.getRoleLists(this.page,this.limit)
            },
            /**
             * todo：获取角色列表
             * @param page
             * @param limit
             */
            getRoleLists:function (page,limit) {
                let params = { page:page, limit:limit};
                this.syncVisible = false;
                apiLists.RoleLists(params).then(response=>{
                    if (response && response.data.code===200){
                        this.roleLists = response.data.item.role.data;
                        this.total = response.data.item.role.total;
                        this.authLists = response.data.item.auth;
                        this.loading = false;
                    }
                })
            },
            /**
             * todo：每页记录数
             * @param val
             */
            sizeChange:function(val){
                this.limit = val;
                this.getRoleLists(this.page,this.limit)
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange:function(val){
                this.page = val;
                this.getRoleLists(this.page,this.limit)
            },
            /**
             * todo：角色添加
             */
            addRole:function () {
                this.title='添加角色';
                this.syncVisible = true;
                this.url = this.cgi.insert;
                this.reFrom = 'created';
                this.defaultChecked = [];
                this.roleModel={role_name:'', auth_ids:[], auth_url:[], status:1, created_at:func.get_timestamp(), updated_at:func.get_timestamp()}
            },
            /**
             * @param value      当前值
             * @param direction  数据移动的方向（'left' / 'right'）
             * @param movedKeys  发生移动的数据 key 数组
             */
            handleChange(value, direction, movedKeys) {
                switch (direction) {
                  //删除
                    case 'left':
                        movedKeys.map((item) => {
                            this.defaultChecked.splice(this.defaultChecked.indexOf(parseInt(item)),1);
                        });
                        break;
                  //添加
                    case 'right':
                        movedKeys.map((item) => {
                            this.defaultChecked.push(parseInt(item));
                        });
                        break;
                }
                this.roleModel.auth_ids = this.defaultChecked;
            },
            /**
             * todo：角色保存
             * @param item
             */
            updateRole:function (item) {
                this.syncVisible = true;
                this.title = '修改角色';
                this.url = this.cgi.update;
                this.defaultChecked = []; //需要重置角色拥有的权限
                this.reFrom = 'update';
                JSON.parse(item.auth_ids).map(item=>{
                    this.defaultChecked.push(parseInt(item));
                })
                this.roleModel = item;
                this.roleModel.auth_ids = this.defaultChecked;
            },
        },
        mounted() {
            this.$nextTick(function () {
                this.btn = func.set_btn_status(this.$route.path,this.$route.name,this.userInfo.auth);
                this.getRoleLists(this.page,this.limit)
            });
        }
    }
</script>

<style scoped>

</style>
