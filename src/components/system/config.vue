<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addConfig">添 加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="configLists" row-key="id"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column label="#" prop="id" width="100px"/>
            <el-table-column label="配置名称" prop="name"> </el-table-column>
            <el-table-column label="显示状态">
                <template slot-scope="scope">
                    <div v-if="scope.row.children">
                        <Radio :item="scope.row" :url="cgi.status" v-on:success="success"/>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="created_at"/>
            <el-table-column label="修改时间" prop="updated_at"/>
            <el-table-column label="操作" width="200px">
                <template slot-scope="scope" >
                    <div v-if="scope.row.children" style="text-align: center">
                        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="setConfigVal(scope.row)">添 加</el-button>
                        <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="updateConfig(scope.row)">修 改</el-button>
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

        <!---配置值弹框-->
        <el-dialog :title="title" :visible.sync="syncVisible" :width="dialogWidth" :modal="modal" :center="center" :destroy-on-close="destroy_on_close">
            <el-form :label-width="labelWidth" :model="configValModel" :ref="reFrom" :rules="rules">
                <el-form-item label="配置名称" prop="name" v-show="!show">
                    <el-input v-model="configValModel.name" placeholder="配置名称"/>
                </el-form-item>
                <el-form-item label="配置健" v-show="show">
                    <el-input v-model="configVal.name" placeholder="配置内容"/>
                </el-form-item>
                <el-form-item label="配置值" v-show="show">
                    <el-input v-model="configVal.value" placeholder="配置内容"/>
                </el-form-item>
                <el-form-item label="配置状态" prop="status">
                    <el-radio-group v-model="configValModel.status" size="small">
                        <el-radio-button label="2">关闭</el-radio-button>
                        <el-radio-button label="1">开启</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-show="showBtn">
                <Submit :reFrom="reFrom" :model="configValModel" :url="url" :refs="refs" v-on:success="success"/>
            </div>
        </el-dialog>
        <!---配置值弹框-->

        <!---配置弹框-->
        <el-dialog :title="title" :width="dialogWidth" :visible.sync="syncConfigVisible" :modal="modal" :center="center" :destroy-on-close="destroy_on_close">
            <el-form :label-width="labelWidth" :model="configModel" :ref="reFrom" :rules="rules">
                <el-form-item label="配置名称" prop="name">
                    <el-input v-model="configModel.name" placeholder="配置名称"/>
                </el-form-item>
                <el-form-item label="配置值" prop="value">
                    <codemirror ref="edit" @change="updateContent" :value="configModel.value" :options="options" style="line-height: 20px"/>
                </el-form-item>
                <el-form-item label="配置状态" prop="status">
                    <el-radio-group v-model="configModel.status" size="small">
                        <el-radio-button label="2">关闭</el-radio-button>
                        <el-radio-button label="1">开启</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="configModel" :url="url" :refs="refs" v-on:success="success"/>
            </div>
        </el-dialog>
        <!---配置弹框-->

    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    import Radio from "../common/Radio";
    import Delete from "../common/Delete";
    import Submit from "../common/Submit";
    import { mapActions,mapGetters } from 'vuex'
    import { codemirror } from 'vue-codemirror-lite'
    //编辑器
    require('codemirror/addon/hint/javascript-hint.js');
    require('codemirror/mode/javascript/javascript.js');
    require('codemirror/addon/selection/active-line');
    //编辑器主题
    require('codemirror/theme/monokai.css');
    //代码折叠
    require('codemirror/addon/fold/foldgutter.css');
    require('codemirror/addon/fold/foldcode.js');
    require('codemirror/addon/fold/foldgutter.js');
    require('codemirror/addon/fold/brace-fold.js');
    require('codemirror/addon/fold/brace-fold.js');
    require('codemirror/addon/fold/comment-fold.js');
    //括号匹配
    require('codemirror/addon/edit/matchbrackets.js');
    export default {
        name: "lists",
        components: {Submit, Delete, Radio,codemirror},
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

                configValModel:{},
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

                //代码编辑器配置
                syncConfigVisible:false,
                options:{
                    mode: 'application/ld+json',
                    //缩进
                    tabSize: 4,
                    //显示行号
                    lineNumbers: true,
                    //theme
                    theme:'monokai',
                    //智能提示
                    extraKeys:{"Ctrl-Space":"autocomplete"},//ctrl-space唤起智能提示
                    //代码折叠
                    lineWrapping:true,
                    foldGutter: true,
                    gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                    //在缩进时，是否需要把 n*tab宽度个空格替换成n个tab字符，默认为false
                    indentWithTabs: true,
                    //自动缩进，设置是否根据上下文自动缩进（和上一行相同的缩进量）。默认为true。
                    smartIndent: true,
                    //括号匹配
                    matchBrackets:true,
                    // 光标高度
                    cursorHeight:1,
                    //自动刷新
                    autoRefresh: true,
                    //设置光标所在行高亮
                    styleActiveLine:true,
                },
            }
        },
        computed:{
            ...mapGetters(['dialogWidth'])
        },
        methods:{
            ...mapActions(['saveSystemLog']),
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.syncVisible = false;
                this.syncConfigVisible = false;
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
            currentChange:function(val) {
                this.page = val;
                this.getConfigLists(this.page,this.limit)
            },
            /**
             * TODO:修改配置
             * @param item
             */
            updateConfig:function(item) {
                this.title='修改配置';
                this.configModel = item;
                this.url = this.cgi.update;
                this.syncConfigVisible = true;
            },
            /**
             * TODO:编辑器修改值
             * @param content
             */
            updateContent:function(content) {
                this.configModel.value = content;
            },
            /**
             * todo：添加
             */
            addConfig:function () {
                this.title='添加配置';
                this.configValModel = {name:'', status:1, value:'[]'}
                this.show = false;
                this.showBtn = true;
                this.syncVisible = true;
                this.url = this.cgi.insert;
            },
            /**
             * todo：设置配置值
             * @param item
             */
            setConfigVal:function (item) {
                this.configVal = { name:'', value:'', status:1, id:1 };
                this.configValModel = item;
                this.configVal.status = this.configValModel.status;
                this.configValModel.value = this.configVal;
                this.title='设置【'+item.name+'】配置值';
                this.show = true;
                this.showBtn = true;
                this.syncVisible = true;
                this.url = this.cgi.update;
            },
            /**
             * todo：查看配置值
             * @param item
             */
            getConfigVal:function(item){
                this.title='查看配置值';
                this.configValModel = item;
                this.configVal.name = item.name;
                this.configVal.value = item.value;
                this.show = true;
                this.showBtn = false;
                this.syncVisible = true;
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
                    item.act = 'remove';
                    apiLists.ConfigValUpdate(item).then(response=>{
                        if (response && response.data.code === 200) {
                            this.getConfigLists(this.page,this.limit);
                            let data = { url:this.cgi.updateVal,msg:response.data.msg,token:this.$store.state.login.token };
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
