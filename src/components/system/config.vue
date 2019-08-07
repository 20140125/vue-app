<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addConfig">添 加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="configLists" border row-key="id"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column label="#" prop="id" width="100px"></el-table-column>
            <el-table-column label="配置名称" prop="name"> </el-table-column>
            <el-table-column label="显示状态">
                <template slot-scope="scope">
                    <div v-if="scope.row.children">
                        <Radio :item="scope.row" :url="cgi.status" v-on:success="success"></Radio>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="created_at"> </el-table-column>
            <el-table-column label="修改时间" prop="updated_at"></el-table-column>
            <el-table-column label="操作" width="200px">
                <template slot-scope="scope" >
                    <div v-if="scope.row.children" style="text-align: center">
                        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="setConfigVal(scope.row)">添 加</el-button>
                    </div>
                    <div v-else>
                        <el-button type="primary" plain icon="el-icon-search" size="mini" @click="getConfigVal(scope.row)">查 看</el-button>
                        <el-button plain type="danger" icon="el-icon-delete" size="mini" @click="removeConfigVal(scope.row)">删 除</el-button>
                    </div>
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
            <el-form :label-width="labelWidth" :model="configModel" :ref="reFrom" :rules="rules">
                <el-form-item label="配置名称" prop="name" v-show="!show">
                    <el-input v-model="configModel.name" placeholder="配置名称"></el-input>
                </el-form-item>
                <el-form-item label="配置健" v-show="show">
                    <el-input v-model="configVal.name" placeholder="配置内容"></el-input>
                </el-form-item>
                <el-form-item label="配置值" v-show="show">
                    <el-input v-model="configVal.value" placeholder="配置内容"></el-input>
                </el-form-item>
                <el-form-item label="配置状态" prop="status">
                    <el-radio-group v-model="configModel.status" size="small">
                        <el-radio-button label="2">关闭</el-radio-button>
                        <el-radio-button label="1">开启</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-show="showBtn">
                <Submit :reFrom="reFrom" :model="configModel" :url="url" :refs="refs" v-on:success="success"></Submit>
            </div>
        </el-dialog>
        <!---弹框-->
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    import Radio from "../common/Radio";
    import Delete from "../common/Delete";
    import Submit from "../common/Submit";
    import { mapActions } from 'vuex'
    export default {
        name: "lists",
        components: {Submit, Delete, Radio},
        data(){
            return {
                configLists:[],
                page:1,
                limit:15,
                total:0,

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
                reFrom:'config',

                configModel:{},
                configVal:{},

                cgi:{
                    remove:$url.configDelete,
                    status:$url.configUpdate,
                    insert:$url.configSave,
                    update:$url.configUpdate,
                    updateVal:$url.configValUpdate
                },
                rules:{
                    name:[{required:true,message:'配置名称不得为空',trigger:'blur'}]
                },
                show:false,
                showBtn:true,
            }
        },
        methods:{
            ...mapActions(['saveSystemLog','checkAuth']),
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.syncVisible = false;
                this.getConfigLists(this.page,this.limit)
            },
            /**
             * todo：获取配置列表
             * @param page
             * @param limit
             */
            getConfigLists:function (page,limit) {
                let params = { page:page,limit:limit };
                apiLists.ConfigLists(params).then(response=>{
                    if (response && response.data.code === 200){
                        this.configLists = response.data.item;
                        this.total = response.data.item.length;
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
                this.getConfigLists(this.page,this.limit)
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange:function(val){
                this.page = val;
                this.getConfigLists(this.page,this.limit)
            },
            /**
             * todo：添加
             */
            addConfig:function () {
                this.title='添加配置';
                this.syncVisible = true;
                this.configModel = {
                    name:'',
                    status:1,
                    value:'[]',
                }
                this.show = false;
                this.showBtn = true;
                this.url = this.cgi.insert;
            },
            /**
             * todo：设置配置值
             * @param item
             */
            setConfigVal:function (item) {
                this.title='设置【'+item.name+'】配置';
                this.configVal = { name:'', value:'', status:1, id:1 };
                this.show = true;
                this.showBtn = true;
                this.syncVisible = true;
                this.configModel = item;
                this.configVal.status = this.configModel.status;
                this.configModel.value = this.configVal;
                this.url = this.cgi.update;
            },
            /**
             * todo：查看配置值
             * @param item
             */
            getConfigVal:function(item){
                this.title='查看配置值';
                this.show = true;
                this.showBtn = false;
                this.syncVisible = true;
                this.configModel = item;
                this.configVal.name = item.name;
                this.configVal.value = item.value;
            },
            /**
             * todo：移除配置值
             * @param item
             */
            removeConfigVal:function (item) {
                this.$confirm('此操作将永远删除该条记录，是否继续？','删除记录',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    this.checkAuth({url:this.cgi.updateVal});
                    item.act = 'remove';
                    apiLists.ConfigValUpdate(item).then(response=>{
                        if (response && response.data.code === 200) {
                            this.getConfigLists(this.page,this.limit);
                            let data = { url:this.cgi.updateVal,msg:JSON.stringify({info:response.data.msg,result:response.data.result}),token:this.$store.state.login.token };
                            this.saveSystemLog(data);
                            this.$message({type:'success',message:response.data.msg});
                            return false;
                        }
                    })
                }).catch(()=>{
                    this.$message({type:'info',message:'已取消删除！'});
                })
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getConfigLists(this.page,this.limit)
            });
        }
    }
</script>

<style scoped>

</style>
