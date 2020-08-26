<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-row :gutter="24">
            <!--分类列表-->
            <el-col :xl="{'span':5}" :lg="{'span':5}" :md="{'span':24}" :sm="{'span':24}" :xs="{'span':24}" style="margin-bottom: 20px">
                <el-input placeholder="输入关键字搜索" v-model="filterText" style="margin-bottom: 20px">
                    <el-button slot="append" icon="el-icon-plus" @click="addCategory"/>
                </el-input>
                <el-tree :props="props"
                         @node-contextmenu="rightClick"
                         :filter-node-method="filterNode"
                         :highlight-current="highlight"
                         :data="categoryLists"
                         @node-click="getApiDetail"
                         default-expand-all
                         ref="tree"
                         id="tree"
                         :node-key="props.id"
                         style="background-color: #393d49">
                </el-tree>
            </el-col>
            <!--分类列表-->

            <!--接口详情-->
            <el-col :xl="{'span':18,'push':1}" :lg="{'span':18,'push':1}" :md="{'span':24}" :sm="{'span':24}" :xs="{'span':24}">
                <el-tabs type="border-card" v-model="apiName" v-if="docVisible">
                    <el-tab-pane :label="apiName" :key="apiName" :name="apiName"/>
                    <el-card shadow="always">
                        <el-form>
                            <el-form-item :inline="true">
                                <el-select v-model="codeStyle" v-if="mavonBool">
                                    <el-option v-for="(code,index) in codeStyleList" :label="index" :value="index" :key="index"/>
                                </el-select>
                                <el-button plain type="primary" @click="mavonBool = !mavonBool" icon="el-icon-edit-outline" style="float: right">修 改</el-button>
                            </el-form-item>
                            <el-form-item>
                                <mavon-editor @imgAdd="uploadFile"
                                              @change="getData"
                                              @save="saveData"
                                              ref="md"
                                              :defaultOpen="open"
                                              :subfield="mavonBool"
                                              :toolbarsFlag="mavonBool"
                                              v-model="docModel.markdown"
                                              :codeStyle="codeStyle"
                                              style="z-index:1;min-height: 500px">
                                </mavon-editor>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-tabs>
            </el-col>
            <!--接口详情-->

        </el-row>

        <!--右键弹框-->
        <div v-show="menuVisible">
            <el-menu id="menu" class="menu" style="border-bottom: solid 1px #393d49" background-color="#393d49" text-color="#cccccc" mode="horizontal" active-text-color="#ffd04b">
                <el-menu-item v-show="btn.add" @click="addCategory"><i class="el-icon-circle-plus-outline"/>添 加</el-menu-item>
                <el-menu-item v-show="btn.edit" @click="updateCategory"><i class="el-icon-edit-outline"/>修 改</el-menu-item>
                <el-menu-item v-show="btn.del" @click="deleteCategory"><i class="el-icon-delete-solid"/>删 除</el-menu-item>
            </el-menu>
        </div>
        <!--右键弹框-->

        <!---接口分类弹框-->
        <el-dialog :title="title" :width="dialogWidth" :visible.sync="syncVisible" :modal="modal"  :center="center">
            <el-form :label-width="labelWidth" :model="categoryModel" :ref="reFrom">
                <el-form-item label="接口名称" prop="name" required>
                    <el-input v-model="categoryModel.name" placeholder="分类名称"/>
                </el-form-item>
                <el-form-item label="接口上级" prop="pid">
                    <el-select placeholder="接口上级" v-model="categoryModel.pid" style="width: 100%">
                        <el-option label="默认权限" value="0" v-if="categoryModel.pid === '0'" selected/>
                        <el-option v-for="(category,index) in apiCategory" :key="index" :label="setName(category)" :value="category.id"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="categoryModel" :url="url" :refs="refs" v-on:success="success"/>
            </div>
        </el-dialog>
         <!---接口分类弹框-->

    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import func from '../../api/func'
    import $url from '../../api/url';
    import Delete from "../common/Delete";
    import Submit from "../common/Submit";
    import {mapGetters,mapActions} from 'vuex'
    export default {
        name: "doc",
        components: {Submit, Delete},
        data(){
            return {
                categoryLists:[],
                props:{
                    label:'name',
                    children:'children',
                    id:'id'
                },
                filterText:'',
                //弹框配置值
                title:'',
                syncVisible:false, //是否显示弹框
                modal:true, //遮盖层是否需要
                labelWidth:'80px',
                loading:true,
                center:true,
                loadingText:'玩命加载中。。。',
                url:'',
                refs:this.$refs,
                reFrom:'category',
                //接口名称
                apiName:'README',
                //右键功能显示与否
                menuVisible:false,
                categoryModel:{},
                apiCategory:[],
                highlight:true,
                value:"",

                //是否展示编辑器
                mavonBool:false,
                open:'preview',
                codeStyle:'monokai',
                cgi:{
                    categoryInsert:$url.categorySave,
                    categoryUpdate:$url.categoryUpdate,
                    remove:$url.categoryDelete,
                    uploadUrl:process.env.API_ROOT+$url.fileUpload,
                },
                //滚动条高度
                scrollTop:0,
                //细化权限按钮
                btn:{},
                token:'',
                codeStyleList:require('../../assets/theme.json')
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        computed:{
            ...mapGetters(['docVisible','docModel','docName','userInfo','dialogWidth'])
        },
        methods:{
            ...mapActions(['addDocVisible','addDocModel','saveSystemLog']),
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.getCategoryLists();
                this.syncVisible = false;
            },
            /**
             * TODO：搜索接口名称
             * @param value
             * @param data
             */
            filterNode:function(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            /**
             * todo:设置API名称
             * @param item
             * @return {String}
             */
            setName:function(item){
                return Array(item.level+1).join('　　')+item.name;
            },
            /**
             * todo：获取API分类列表
             */
            getCategoryLists:function () {
                apiLists.CategoryLists({}).then(response=>{
                    if (response && response.data.code === 200){
                        this.apiCategory = response.data.item.category;
                        this.categoryLists = response.data.item.category_tree;
                        if (!this.docModel.id) {
                            this.apiName = this.categoryLists[0].name;
                            this.getApiDetail(this.categoryLists[0]);
                        }
                        this.loading = false;
                    }
                });
            },
            /**
             * todo：鼠标右击触发事件
             * @param MouseEvent event 事件
             * @param object
             * @param Node 节点对应的 Node、
             * @param element 节点组件本身。
             */
            rightClick:function(MouseEvent, object, Node, element) {
                this.menuVisible = false;
                this.menuVisible = true;
                const menu = document.querySelector('#menu');
                const tree = document.getElementById('tree');
                this.scrollTop = func.get_scroll_top();
                document.addEventListener('click', this.foo);
                menu.style.left = tree.offsetWidth + 50 + 'px';
                menu.style.top = MouseEvent.clientY + this.scrollTop - 220 + 'px';
                this.categoryModel = object;
            },
            /**
             * todo：取消鼠标监听事件菜单栏
             */
            foo:function() {
                this.menuVisible = false;
                document.removeEventListener('click', this.foo);
            },
            /**
             * todo：添加API分类
             */
            addCategory:function () {
                this.title='添加接口';
                this.syncVisible = true;
                this.url = this.cgi.categoryInsert;
                this.categoryModel = {name:'', pid:this.categoryModel.id === undefined ? '0':this.categoryModel.id, path:'1', level:1};
            },
            /**
             * todo：修改API分类
             */
            updateCategory:function () {
                this.title = this.categoryModel.name;
                this.syncVisible = true;
                this.url = this.cgi.categoryUpdate;
            },
            /**
             * TODO:删除API分类
             */
            deleteCategory:function(){
                apiLists.CategoryDelete({id:this.categoryModel.id}).then(response=>{
                    if (response && response.data.code === 200){
                        let data = { href:this.cgi.remove, msg:response.data.msg,token:this.$store.state.login.token };
                        this.saveSystemLog(data);
                        this.$message({type:'success',message:response.data.msg});
                        this.getCategoryLists()
                    }
                })
            },
            /**
             * TODO:图片上传
             * @param post
             * @param file
             */
            uploadFile:function (post,file) {
                let type = file.type;
                let typeArr = ['image/jpg','image/gif','image/png','image/jpeg'];
                if (!typeArr.includes(type)){
                    this.$message({type:'warning',message:'upload image format error'});
                    return false;
                }
                if (file.size>2*1024*1024) {
                    this.$message({type:'warning',message:'upload image size error'});
                    return false;
                }
                let params = new FormData();
                params.append("file",file);
                params.append("token",this.userInfo.token);
                params.append("rand",true);
                let config = {headers: {"Content-Type": "multipart/form-data","Authorization":`${func.set_password(func.set_random(32),func.set_random(12))}${this.userInfo.token}${func.set_password(func.set_random(32),func.set_random(12))}`}}
                this.$http.post(this.cgi.uploadUrl,params,config).then(response=>{
                    this.$refs['md'].$img2Url(post, response.data.item.src);
                })
            },
            /**
             * todo:设置数据
             * @param data
             * @param render
             */
            getData:function (data,render) {
                this.docModel.markdown = data;
                this.docModel.html = render;
            },
            /**
             * todo:保存数据
             */
            saveData:function() {
                if (this.docModel.id) {
                    apiLists.ApiDocUpdate(this.docModel).then(response=>{
                        if (response && response.data.code===200){
                            this.addDocModel(this.docModel);
                            let data = { href:$url.apiDocUpdate, msg:response.data.msg,token:this.$store.state.login.token };
                            this.saveSystemLog(data);
                            this.$message.success(response.data.msg);
                        }
                    })
                } else {
                    apiLists.ApiDocSave(this.docModel).then(response=>{
                        if (response && response.data.code===200){
                            this.$message.success(response.data.msg);
                            this.addDocModel(this.docModel)
                            let data = { href:$url.apiDocSave, msg:response.data.msg,token:this.$store.state.login.token };
                            this.saveSystemLog(data);
                            this.getCategoryLists()
                        }
                    })
                }
            },
            /**
             * TODO:获取接口详情
             * @param data
             */
            getApiDetail:function(data){
                const obj = { 'docVisible':true,'docName':data.name };
                this.addDocVisible(obj);
                this.mavonBool = false;
                if (this.$refs.md && this.$refs.md !== 'undefined') {
                    this.$refs['md'].markdownIt.set({ breaks: false });
                }
                this.apiName = this.docName;
                apiLists.ApiDocLists({type:data.id}).then(response=>{
                    if (response && response.data.code===200){
                        this.addDocModel(response.data.item);
                    } else {
                        this.mavonBool = true;
                        this.addDocModel({});
                        this.docModel.type = data.id;
                    }
                });

            }
        },
        created(){
            if (this.docName) {
                this.apiName = this.docName;
            }
            this.token = this.$store.state.login.token;
        },
        mounted() {
            this.$nextTick(function () {
                this.btn = func.set_btn_status(this.$route.path,this.$route.name,this.userInfo.auth);
                this.getCategoryLists();
            });
        }
    }
</script>

<style scoped>

</style>
