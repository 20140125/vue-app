<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px" v-if="btn.add">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addAuth">添 加</el-button>
            </el-form-item>
        </el-form>
        <!--table 表格-->
        <el-table :data="authLists.filter(data=>(!search || data.name.toLowerCase().includes(search.toLowerCase()) || data.href.includes(search.toLowerCase())))"
                  row-key="id"
                  lazy
                  :load="load"
                  :tree-props="{children: '__child', hasChildren: 'hasChildren'}">
            <el-table-column label="权限名称" prop="name"/>
            <el-table-column label="权限链接" prop="href"/>
            <el-table-column label="显示状态" v-if="btn.edit">
                <template slot-scope="scope">
                    <Radio :item="scope.row" :url="cgi.status"/>
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" placeholder="输入关键词查询"/>
                </template>
                <template slot-scope="scope">
                    <el-button icon="el-icon-plus" type="primary" size="mini" v-if="scope.row.level<=1 && btn.add" plain @click="addAuth(scope.row)">添 加</el-button>
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="updateAuth(scope.row)" v-if="btn.edit">修 改</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="authLists" v-on:success="success" v-if="scope.row.level>0 && btn.del"/>
                </template>
            </el-table-column>
        </el-table>
        <!--table 表格-->

        <!---弹框-->
        <el-dialog :title="title" :visible.sync="syncVisible" :modal="modal" :center="center">
            <el-form :label-width="labelWidth" :model="authModel" :ref="reFrom" :rules="rules">
                <el-form-item label="权限名称" prop="name">
                    <el-input v-model="authModel.name" placeholder="权限名称"/>
                </el-form-item>
                <el-form-item label="权限链接" prop="href">
                    <el-input v-model="authModel.href" placeholder="/admin/auth/lists"/>
                </el-form-item>
                <el-form-item label="权限上级" prop="pid">
                    <el-select placeholder="权限上级" filterable style="width: 100%" v-model="authModel.pid">
                        <el-option label="默认权限" value="0" v-if="authModel.pid === '0'" selected/>
                        <el-option v-for="(item,index) in authLevel" :key="index" :disabled="item.id === authModel.id" :label="setAuthName(item)" :value="item.id.toString()"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限状态" prop="status" v-if="act === 'add'">
                    <el-radio-group v-model="authModel.status" size="small">
                        <el-radio-button label="2">关闭</el-radio-button>
                        <el-radio-button label="1">开启</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="authModel" :url="url" :refs="refs" v-on:success="success"/>
            </div>
        </el-dialog>
        <!---弹框-->
    </div>
</template>

<script>
    import Submit from "../common/Submit";
    import Radio from "../common/Radio";
    import Delete from "../common/Delete";
    import apiLists from '../../api/api';
    import func from '../../api/func'
    import $url from '../../api/url';
    import {mapGetters} from 'vuex'
    export default {
        name: "lists",
        components: {Delete, Radio, Submit},
        data(){
            return {
                authLists:[],
                authLevel:[],
                search:'',
                syncVisible:false, //是否显示弹框
                modal:true, //遮盖层是否需要
                center:true,
                labelWidth:'80px',
                title:'',
                loading:true,
                loadingText:'玩命加载中。。。',
                url:'',
                refs:this.$refs,
                reFrom:'auth',
                act:'',
                //权限默认数据
                authModel:{},
                //URL
                cgi:{
                    insert:$url.authSave,
                    update:$url.authUpdate,
                    remove:$url.authDelete,
                    status:$url.authUpdate,
                },
                //表单验证规则
                rules:{
                    name:[ { required:true,message:'权限名称不得为空',trigger:'blur' } ],
                    href:[ { required:true,message:'权限链接不得为空',trigger:'blur' } ],
                    pid:[ { required:true,message:'权限上级不得为空',trigger:'change' } ],
                    status:[ { required:true,message:'权限状态不得为空',trigger:'change' } ]
                },
                //权限按钮细化
                btn:{},
                id:0
            }
        },
        computed:{
            ...mapGetters(['userInfo'])
        },
        methods:{
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.getAuthLists(this.id);
                this.syncVisible = false;
            },
            /**
             * todo：获取权限
             */
            getAuthLists:function (id) {
                apiLists.AuthLists({id:id}).then(response=>{
                    if (response && response.data.code===200){
                        this.authLists = response.data.item.authLists;
                        this.authLevel = response.data.item.selectAuth;
                        this.loading = false;
                    }
                });
            },
            load:function (tree, treeNode, resolve) {
                apiLists.AuthLists({id:tree.id}).then(response=>{
                    if (response && response.data.code === 200) {
                        setTimeout(()=>{
                            resolve(response.data.item.authLists);
                        },500)
                    }
                })
            },
            /**
             * todo：设置权限名称
             * @param item
             * @return {String}
             */
            setAuthName:function(item){
                return Array(item.level+1).join('　　')+item.name;
            },
            /**
             * todo：权限添加
             * @param scope
             */
            addAuth:function (scope = {}) {
                this.syncVisible = true;
                this.title = '添加权限';
                this.url = this.cgi.insert;
                this.act = 'add';
                this.authModel = { name:'', href:'', status:'1', pid:'0', level:0, path:'1' };
                if (scope.name) {
                    this.authModel.pid = scope.id.toString();
                }
            },
            /**
             * todo：权限保存
             * @param item
             */
            updateAuth:function (item) {
                this.syncVisible = true;
                this.title = '修改权限';
                this.url = this.cgi.update;
                this.authModel = item;
                this.act = 'update';
                this.authModel.pid = this.authModel.pid.toString();
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.btn = func.set_btn_status(this.$route.path,this.$route.name,this.userInfo.auth);
                this.getAuthLists(this.id);
            });
        }
    }
</script>

<style scoped>

</style>
