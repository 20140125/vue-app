<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addRole">添 加</el-button>
            </el-form-item>
        </el-form>
        <!--table 表格-->
        <el-table :data="roleLists" border>
            <el-table-column label="#" prop='id' sortable></el-table-column>
            <el-table-column label="角色名称" prop="role_name" ></el-table-column>
            <el-table-column label="显示状态">
                <template slot-scope="scope">
                    <Radio :item="scope.row" :url="cgi.status"></Radio>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" sortable prop="created_at"></el-table-column>
            <el-table-column label="修改时间" sortable prop="updated_at"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="updateRole(scope.row)">修 改</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="roleLists" v-on:success="success"></Delete>
                </template>
            </el-table-column>
        </el-table>
        <!--table 表格-->
        <!---弹框-->
        <el-dialog :title="title" :visible.sync="syncVisible" :modal="modal"  :center="center">
            <el-form :label-width="labelWidth" :model="roleModel" :ref="reFrom" :rules="rules">
                <el-form-item label="角色名称" prop="role_name">
                    <el-input v-model="roleModel.role_name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="权限列表" prop="auth_ids">
                    <el-transfer
                        :titles="['所有', '拥有']"
                        :button-texts="['移除', '添加']"
                        v-model="defaultChecked"
                        :data="authLists"
                        filterable
                        @change="handleChange">
                    </el-transfer>
                </el-form-item>
                <el-form-item label="状态" prop="status" v-if="act === 'add'">
                    <el-radio-group v-model="roleModel.status" size="small">
                        <el-radio-button label="0">关闭</el-radio-button>
                        <el-radio-button label="1">开启</el-radio-button>
                    </el-radio-group>
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
    export default {
        name: "lists",
        components: {Submit, Delete, Radio},
        data(){
            return {
                roleLists:[],
                loading:true,
                loadingText:'玩命加载中。。。',
                authLists:[],
                defaultChecked:[],

                title:'',
                syncVisible:false, //是否显示弹框
                modal:true, //遮盖层是否需要
                labelWidth:'80px',
                center:true,

                url:'',
                refs:this.$refs,
                reFrom:'role',
                act:'',
                roleModel:{},

                ids:[],
                urls:[],

                cgi:{
                    insert:$url.roleSave,
                    update:$url.roleUpdate,
                    remove:$url.roleDelete,
                    status:$url.roleUpdate
                },
                rules:{
                    role_name:[{ required:true,message:'角色名称不得为空',trigger:'blur' }],
                    ids:[{ required:true,message:'权限ID不得为空',trigger:'blur' }],
                    urls:[{ required:true,message:'权限地址不得为空',trigger:'blur' }]
                },
            }
        },
        methods:{
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.getRoleLists(this.page,this.limit)
                this.syncVisible = false;
            },
            /**
             * todo：获取角色列表
             * @param page
             * @param limit
             */
            getRoleLists:function (page,limit) {
                let params = { offset:limit*(page-1), limit:limit,level:4 };
                apiLists.RoleLists(params).then(response=>{
                    if (response.data.code===200){
                        this.roleLists = response.data.item.role;
                        this.authLists = response.data.item.auth
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
                this.act = 'add';
                this.defaultChecked = [];
                this.roleModel={
                    role_name:'',
                    auth_ids:[],
                    auth_url:[],
                    status:'1',
                    created_at:func.get_timestamp(),
                    updated_at:func.get_timestamp()
                }
            },
             /**
             * @param value      当前值
             * @param direction  数据移动的方向（'left' / 'right'）
             * @param movedKeys  发生移动的数据 key 数组
             */
            handleChange(value, direction, movedKeys) {
                let __this = this;
                switch (direction) {
                    //删除
                    case 'left':
                        movedKeys.forEach(function (item,index) {
                            __this.ids.splice(__this.ids.indexOf(item),1);
                        });
                        break;
                    //添加
                    case 'right':
                        movedKeys.forEach(function (item,index) {
                            __this.ids.push(parseInt(item));
                        });
                        break;
                }
                __this.roleModel.auth_ids = __this.ids;
            },
            /**
             * todo：角色保存
             * @param item
             */
            updateRole:function (item) {
                this.syncVisible = true;
                this.title = '修改角色';
                this.url = this.cgi.update;
                this.ids = JSON.parse(item.auth_ids);
                this.urls = JSON.parse(item.auth_url);
                this.defaultChecked = []; //需要重置角色拥有的权限
                this.act = 'update';
                for (let i in this.ids){
                    this.defaultChecked.push(parseInt(this.ids[i]));
                }
                this.roleModel = item;
                this.roleModel.auth_ids = this.defaultChecked;
            },
        },
        mounted() {
            this.$nextTick(function () {
                this.getRoleLists(this.page,this.limit)
            });
        }
    }
</script>

<style scoped>

</style>
