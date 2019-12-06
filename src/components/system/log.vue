<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-row :gutter="24">
            <!--文件列表-->
            <el-col :xl="{'span':5}" :lg="{'span':5}" :md="{'span':24}" :sm="{'span':24}" :xs="{'span':24}" style="margin-bottom: 20px">
                <el-input placeholder="输入关键字搜索" v-model="filterText" style="margin-bottom: 20px"/>
                <el-tree :data="fileLists"
                         :highlight-current="highlight"
                         :props="props"
                         :filter-node-method="filterNode"
                         :node-key="props.id" @node-click="getFileContent"
                         ref="tree"
                         style="background-color: #393d49"/>
            </el-col>
            <!--文件列表-->
            <!--文件内容-->
            <el-col :xl="{'span':18,'push':1}" :lg="{'span':18,'push':1}" :md="{'span':24}" :sm="{'span':24}" :xs="{'span':24}">
                <el-form :model="fileModel">
                    <el-form-item style="margin-left: -30px !important;">
                        <el-tabs type="border-card" v-model="fileModel.name">
                            <el-tab-pane :label="fileModel.name" :key="fileModel.name" :name="fileModel.name"/>
                            <el-card shadow="always">
                                <codemirror :value="fileModel.content" :options="options" style="line-height: 20px"/>
                            </el-card>
                        </el-tabs>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--文件内容-->
        </el-row>
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import { mapGetters,mapActions } from 'vuex';
    import { codemirror } from 'vue-codemirror-lite'
    //编辑器代码 php
    require('codemirror/mode/php/php.js');
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
        components: {codemirror},
        data(){
            return {
                //树组件
                props:{
                    label:'label',
                    children:'children',
                    isLeaf:false
                },
                //代码编辑器配置
                options:{
                    mode: "text/x-php",
                    //缩进
                    tabSize: 4,
                    //显示行号
                    lineNumbers: true,
                    //theme
                    theme:'monokai',
                    //智能提示
                    extraKeys:{"Ctrl-Space":"autocomplete"},//ctrl-space唤起智能提示
                    //自动换行
                    lineWrapping:false,
                    //代码折叠
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
                    //只读
                    readOnly:true,
                    showCursorWhenSelecting:true
                },
                //高亮选中的节点
                highlight:true,
                //文件列表
                fileLists:[],
                //默认目录
                path:'storage_path',
                loading:true,
                loadingText:'玩命加载中。。。',
                filterText:'',
                //文件
                fileModel:{
                    content:'',
                    path:''
                },
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        computed:{
            ...mapGetters(['currSystemLogObj','token']),
        },
        methods:{
            ...mapActions(['addCurrSystemLogObj']),
            /**
             * TODO：搜索文件名称
             * @param value
             * @param data
             */
            filterNode:function(value, data) {
                if (!value) return true;
                return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
            },
            /**
             * todo：获取文件列表
             * @param path
             */
            getFileLists:function (path) {
                let params = {path:path,basename:'/logs//'};
                apiLists.FileLists(params).then(response=>{
                    if (response && response.data.code === 200){
                        this.fileLists = response.data.item;
                        this.getFileContent(this.fileLists[this.fileLists.length-1])
                        this.loading = false;
                    }
                });
            },
            /**
             * todo：获取文件内容
             * @param item
             * @val label  tabs 标签的标题
             * @val name   tabs 标签的值
             * @val path   tabs 标签的路径
             * @val content tabs 标签下的内容
             */
            getFileContent:function (item) {
                let params = {path:item.path};
                this.fileModel.name = item.label;
                apiLists.FileRead(params).then(response=>{
                    if (response && response.data.code === 200){
                        this.fileModel.content = response.data.item.content;
                        this.addCurrSystemLogObj(this.fileModel);
                    }
                });
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getFileLists(this.path);
            });
        }
    }
</script>

<style scoped>

</style>
