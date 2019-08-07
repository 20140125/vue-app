<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-row :gutter="24">
            <!--文件列表-->
            <el-col :xl="{'span':5}" :lg="{'span':5}" :md="{'span':24}" :sm="{'span':24}" :xs="{'span':24}" style="margin-bottom: 20px">
                <el-tree :data="fileLists"  @node-contextmenu="rightClick"
                         :highlight-current="highlight"
                         :props="props"
                         :node-key="props.id" @node-click="getFileContent" style="background-color: #393d49"></el-tree>
            </el-col>
            <!--文件列表-->
            <!--鼠标右键-->
            <div v-show="menuVisible">
                <ul id="menu" class="menu">
                    <li class="menu__item" @click="addFile" v-show="showRightBtn.add"><i class="el-icon-circle-plus-outline"></i> 添 加</li>
                    <li class="menu__item" @click="renameFile" v-show="showRightBtn.rename"><i class="el-icon-edit-outline"></i> 修 改</li>
                    <li class="menu__item" @click="authFile" v-show="showRightBtn.auth"><i class="el-icon-user-solid"></i> 权 限</li>
                    <li class="menu__item" @click="compressionFile" v-show="showRightBtn.compression"><i class="el-icon-collection"></i> 压 缩</li>
                    <li class="menu__item" @click="DecompressionFile" v-show="showRightBtn.DeCompression"><i class="el-icon-receiving"></i> 解 压</li>
                    <li class="menu__item" @click="downloadFile" v-show="showRightBtn.download"><i class="el-icon-download"></i> 下 载</li>
                    <li class="menu__item" @click="uploadFile" v-show="showRightBtn.upload"><i class="el-icon-upload"></i> 上 传</li>
                    <li class="menu__item" @click="deleteFile" v-show="showRightBtn.remove"><i class="el-icon-delete-solid"></i> 删 除</li>
                </ul>
            </div>
            <!--鼠标右键-->
            <!--文件内容-->
            <el-col :xl="{'span':18,'push':1}" :lg="{'span':18,'push':1}" :md="{'span':24}" :sm="{'span':24}" :xs="{'span':24}" v-show="showIdea">
                <el-form :model="fileModel" :ref="reFrom">
                    <el-form-item style="margin-left: -30px !important;">
                        <el-tabs type="border-card" closable v-model="activeFileTabName"  @tab-click="goto" @tab-remove="removeTabName" style="text-align: left!important;">
                            <el-tab-pane v-for="item in fileTabs" :label="item.label" :key="item.name" :name="item.name"></el-tab-pane>
                            <el-card shadow="hover">
                                <codemirror @change="updateContent" ref="edit" :value="fileModel.content" :options="options" style="line-height: 20px"></codemirror>
                            </el-card>
                        </el-tabs>
                    </el-form-item>
                </el-form>
                <Submit style="text-align: center !important;" :reFrom="reFrom" :model="fileModel" :url="url" :refs="refs" v-on:success="success"></Submit>
            </el-col>
            <!--文件内容-->
        </el-row>
        <!--权限框-->
        <el-dialog :visible.sync="syncVisible" :modal="modal" :title="title" :center="center">
            <el-form :label-width="labelWidth" :model="chmodModel" :rules="rules" :ref="reFrom">
                <el-form-item label="权限" prop="auth">
                    <el-input placeholder="请输入内容" @change="setChmodAuth" v-model="chmodModel.auth"></el-input>
                </el-form-item>
                <el-form-item label="所有者">
                    <el-checkbox-group v-model="all"  @change="allChange">
                        <el-checkbox border size="small" v-for="checkBox in checkBoxArr" :label="checkBox.value" :key="checkBox.id"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="用户组">
                    <el-checkbox-group v-model="user"  @change="userChange">
                        <el-checkbox border size="small" v-for="checkBox in checkBoxArr" :label="checkBox.value" :key="checkBox.id"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="公共">
                    <el-checkbox-group v-model="common" @change="commonChange">
                        <el-checkbox border size="small" v-for="checkBox in checkBoxArr" :label="checkBox.value" :key="checkBox.id"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="chmodModel" :url="url" :refs="refs"  v-on:success="success"></Submit>
            </div>
        </el-dialog>
        <!--权限框-->
        <!--文件上传-->
        <el-dialog :visible.sync="fileSyncVisible" :modal="modal" title="文件上传" :center="center">
            <el-upload ref="upload"
                       :data="fileData"
                       :action="cgi.uploadUrl"
                       :on-remove="handleRemove"
                       :on-success="handelSuccess"
                       :file-list="fileList"
                       :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            </el-upload>
        </el-dialog>
        <!--文件上传-->
        <!--图片预览-->
        <el-dialog :visible.sync="imgVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <!--图片预览-->
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    import Submit from "../common/Submit";
    import { mapGetters,mapActions } from 'vuex';
    import { codemirror } from 'vue-codemirror-lite'
    require('codemirror/lib/codemirror.css');
    require('codemirror/lib/codemirror.js');
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
        components: {Submit,codemirror},
        data(){
            return {
                //树组件
                props:{
                    label:'label',
                    children:'children',
                    isLeaf:false
                },
                //文件授权
                checkBoxArr:[{'id':4,'value':'读取'},{'id':2,'value':'写入'},{'id':1,'value':'执行'}],
                all:[],
                user:[],
                common:[],
                all_id:0,
                user_id:0,
                common_id:0,
                chmodModel:{
                    auth:parseInt(this.all_id +''+ this.user_id +''+ this.common_id),
                    path:''
                },
                //文件压缩
                compressionModel:{
                    docLists:[],
                    resource:'',
                    path:''
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
                //展示自定义右键菜单
                menuVisible:false,
                //高亮选中的节点
                highlight:true,
                //文件列表
                fileLists:[],
                //默认目录
                path:'base_path',
                //默认显示tabs
                activeFileTabName:null,

                title:'default',
                syncVisible:false, //是否显示弹框
                modal:true, //遮盖层是否需要
                labelWidth:'80px',
                center:true,
                loading:true,
                loadingText:'玩命加载中。。。',
                //自定义组件
                url:'',
                refs:this.$refs,
                reFrom:'file',
                //文件对象
                fileObject:{},
                //是否显示按钮
                showRightBtn:{
                    add:true,
                    rename:true,
                    remove:true,
                    compression:true,
                    DeCompression:false,
                    auth:true,
                    download:true,
                    upload:true,
                },
                //文件
                fileModel:{
                    content:'',
                    path:''
                },
                //文件上传
                fileList:[],
                fileSyncVisible:false,
                fileData:{},
                //编辑器显示与否
                showIdea:true,
                //地址
                cgi:{
                    update:$url.fileUpdate,
                    chmod:$url.fileChmod,
                    uploadUrl:process.env.API_ROOT+$url.fileUpload
                },
                //图片弹框
                imgVisible:false,
                dialogImageUrl:'',
                //规则
                rules:{
                    auth:[
                        { required: true, message: '权限不得为空',trigger:'blur'},
                        { type: 'number', message: '权限必须为数字值',trigger:'blur'}
                    ]
                },
            }
        },
        computed:{
            ...mapGetters(['fileTabs','currFileObj','token']),
        },
        methods:{
            ...mapActions(['addFileTabs','deleteFileTabs','addCurrFileObj','saveSystemLog']),
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.getFileLists(this.path);
                this.syncVisible = false;
            },
            /**
             * todo：获取文件列表
             * @param path
             */
            getFileLists:function (path) {
                let params = {path:path,basename:'/'};
                apiLists.FileLists(params).then(response=>{
                    if (response && response.data.code === 200){
                        this.fileLists = response.data.item;
                        this.loading = false;
                    }
                });
            },
            /**
             * todo：鼠标右击触发事件
             * @param MouseEvent event 事件
             * @param object 传递给 data 属性的数组中该节点所对应的对象
             * @param Node 节点对应的 Node、
             * @param element 节点组件本身。
             */
            rightClick:function(MouseEvent, object, Node, element) {
                this.menuVisible = false; // 关闭模态框
                this.menuVisible = true;  // 显示模态窗口，跳出自定义菜单栏
                const menu = document.querySelector('#menu');
                document.addEventListener('click', this.foo); // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
                menu.style.left = '340px';
                menu.style.top = MouseEvent.clientY - 195 + 'px';
                this.fileObject = object;
                switch (this.fileObject.fileType) {
                    case 'file':
                        this.showRightBtn.DeCompression = false;
                        this.showRightBtn.download = true;
                        let ext = this.fileObject.label.split(".")[1];
                        let compressionExt = ['tar','zip','7z','TAR','ZIP','7Z'];
                        if (compressionExt.includes(ext)){
                            this.showRightBtn.DeCompression = true;
                        }
                        break;
                    case 'dir':
                        this.showRightBtn.download = false;
                        this.showRightBtn.DeCompression = false;
                        break;
                }
            },
            /**
             * todo：取消鼠标监听事件菜单栏
             */
            foo:function() {
                this.menuVisible = false;
                document.removeEventListener('click', this.foo) // 关掉监听
            },
            /**
             * todo：tab切换
             * @param tab
             * @val label  tabs 标签的标题
             * @val name   tabs 标签的值
             * @val path   tabs 标签的路径
             * @val content tabs 标签下的内容
             */
            goto:function(tab){
                let item = this.fileTabs;
                for (const i in item){
                    if (item[i].label === tab.label) {
                        this.fileModel.content = item[i].content;
                        this.fileModel.path = item[i].path;
                        let currFileObj = {content:this.fileModel.content, path:this.fileModel.path, name:item[i].name};
                        this.addCurrFileObj(currFileObj);
                    }
                }
            },
            /**
             * todo：删除tabs
             * @param tabName
             * @val label  tabs 标签的标题
             * @val name   tabs 标签的值
             * @val path   tabs 标签的路径
             * @val content tabs 标签下的内容
             */
            removeTabName:function(tabName){
                this.fileTabs.forEach((tab, index) => {
                    if (tab.name === tabName) {
                        let nextTab = this.fileTabs[index + 1] || this.fileTabs[index - 1];
                        if (nextTab) {
                            this.activeFileTabName = nextTab.name;
                            this.fileModel.content = nextTab.content;
                            let currFileObj = {content:nextTab.content, path:nextTab.path, name:nextTab.name};
                            this.addCurrFileObj(currFileObj);
                            this.deleteFileTabs(tabName);
                        }
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
                if (item.fileType!=='file'){
                    this.$notify({type:'success',title:'通知',message:'不是一个文件'});
                    return false;
                }
                let ext = item.label.split(".")[1];
                let compressionExt = ['tar','zip','7z','TAR','ZIP','7Z'];
                if (compressionExt.includes(ext)){
                    this.$notify({type:'success',title:'通知',message:'该文件不支持直接查看'});
                    return false;
                }
                this.showIdea = true;
                this.activeFileTabName = item.size.toString();
                let params = {path:item.path},tabs = {};
                this.url = this.cgi.update;
                tabs.label = item.label;tabs.name = item.size.toString();tabs.path = item.path;
                apiLists.FileRead(params).then(response=>{
                    if (response && response.data.code === 200){
                        this.fileModel.content = response.data.item.content;
                        this.fileModel.path = item.path;
                        tabs.content = this.fileModel.content;
                        this.addCurrFileObj(tabs);
                        this.addFileTabs(tabs)
                    }
                });
            },
            /**
             * todo：文件重新命名
             */
            renameFile:function(){
                let params = {oldFile:this.fileObject.path};
                this.$prompt('请输入文件名', '重命名', { confirmButtonText: '确定', cancelButtonText: '取消'}).then(({ value }) => {
                    params.newFile = params.oldFile.replace(this.fileObject.label,value);
                    apiLists.FileRename(params).then(response=>{
                        if (response && response.data.code === 200){
                            this.fileObject.name = value;
                            this.$message({type: 'success', message: '你的新文件名: ' + value});
                            let data = { msg:JSON.stringify({url:$url.fileSave, info:'你的新文件名: ' + value,result:response.data.result}) };
                            this.saveSystemLog(data);
                            this.getFileLists(this.path);
                        }
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '取消输入'});
                });
            },
            /**
             * todo：文件删除
             */
            deleteFile:function(){
                this.$confirm('此操作将永远删除该条记录，是否继续？','删除记录',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    let params = {path:this.fileObject.path};
                    apiLists.FileDelete(params).then(response=>{
                       if (response && response.data.code === 200){
                           let data = { msg:'删除文件成功：'+params.path,result:response.data.result };
                           this.saveSystemLog(data);
                           this.getFileLists(this.path);
                           this.$message({type:'success',message:'删除记录成功！：'+params.path});
                       }
                    })
                }).catch(()=>{
                    this.$message({type:'info',message:'已取消删除！'});
                });
            },
            /**
             * todo：新建文件
             */
            addFile:function () {
                let params = {};
                this.$prompt('请输入文件名', '新建文件', { confirmButtonText: '确定', cancelButtonText: '取消'}).then(({ value }) => {
                    //这是一个文件
                    if(this.fileObject.fileType === 'file'){
                        params.path = this.fileObject.path.replace(this.fileObject.label,value);
                    } else if (this.fileObject.fileType === 'dir') {
                        params.path = this.fileObject.path+'/'+value;
                    }
                    apiLists.FileSave(params).then(response=>{
                        if (response && response.data.code === 200){
                            let data = { msg:'你的新文件名: ' + params.path,result:response.data.result };
                            this.saveSystemLog(data);
                            this.getFileLists(this.path);
                            this.$message({type: 'success', message: '你的新文件名: ' + params.path});
                        }
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '取消输入'});
                });
            },
            /**
             * todo：文件权限设置
             */
            authFile:function(){
                this.syncVisible = true;
                this.title = '设置权限【'+(this.fileObject.path)+'】';
                this.chmodModel.auth = parseInt(this.fileObject.auth);
                this.chmodModel.path = this.fileObject.path;
                this.all_id = this.fileObject.auth.substr(0,1);
                this.user_id = this.fileObject.auth.substr(1,1);
                this.common_id = this.fileObject.auth.substr(2,1);
                this.all = this.setChmod(this.all_id);
                this.user = this.setChmod(this.user_id);
                this.common = this.setChmod(this.common_id);
                this.url = this.cgi.chmod;
            },
            /**
             * todo：设置权限
             * @param chmod
             */
            setChmod:function(chmod){
                let auth = [];
                switch (chmod) {
                    case '7': auth = ['读取','写入','执行']; break;
                    case '6': auth = ['读取','写入']; break;
                    case '5': auth = ['读取','执行']; break;
                    case '4': auth = ['读取']; break;
                    case '3': auth = ['写入','执行']; break;
                    case '2': auth = ['写入']; break;
                    case '1': auth = ['执行']; break;
                }
                return auth;
            },
            /**
             * todo：根据用户输入设置权限
             */
            setChmodAuth:function(){
                this.chmodModel.auth = parseInt(this.chmodModel.auth);
                if (this.chmodModel.auth>666){
                    this.$message({type:'warning',message:'权限设置失败'});
                    this.chmodModel.auth = parseInt(this.fileObject.auth);
                }
                this.all_id = this.chmodModel.auth.toString().substr(0,1);
                this.user_id = this.chmodModel.auth.toString().substr(1,1);
                this.common_id = this.chmodModel.auth.toString().substr(2,1);
                this.all = this.setChmod(this.all_id);
                this.user = this.setChmod(this.user_id);
                this.common = this.setChmod(this.common_id);
                this.url = this.cgi.chmod;
            },
            /**
             * todo：获取权限
             * @param chmod
             */
            getChmod:function(chmod){
                let auth = 0;
                for (let i in chmod){
                    if (chmod[i] === '读取'){
                        auth+=4;
                    }
                    if (chmod[i] === '写入'){
                        auth+=2;
                    }
                    if (chmod[i] === '执行'){
                        auth+=1;
                    }
                }
                return auth;
            },
            /**
             * todo：所有者权限
             * @param val
             */
            allChange:function(val){
                this.all_id = this.getChmod(val);
                this.chmodModel.auth = parseInt(this.all_id +''+ this.user_id +''+ this.common_id);
            },
            /**
             * todo：用户组权限
             * @param val
             */
            userChange:function(val){
                this.user_id = this.getChmod(val);
                this.chmodModel.auth = parseInt(this.all_id +''+ this.user_id +''+ this.common_id);
            },
            /**
             * todo：公共权限
             * @param val
             */
            commonChange:function(val){
                this.common_id = this.getChmod(val);
                this.chmodModel.auth = parseInt(this.all_id +''+ this.user_id +''+ this.common_id);
            },
            /**
             * todo：文件压缩
             */
            compressionFile:function(){
                this.$prompt('请输入文件名', '压缩包名称', { confirmButtonText: '确定', cancelButtonText: '取消'}).then(({ value }) => {
                    this.compressionModel.resource = value;
                    this.compressionModel.docLists.push(this.fileObject.path);
                    this.compressionModel.path = this.fileObject.path.replace(this.fileObject.label,'');
                    apiLists.Compression(this.compressionModel).then(response=>{
                        if (response && response.data.code === 200){
                            this.$message({type:'success',message:response.data.msg});
                            let data = { msg:'你的压缩包名: ' + this.compressionModel.type,result:response.data.result };
                            this.saveSystemLog(data);
                            this.getFileLists(this.path);
                        }
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '取消输入'});
                });
            },
            /**
             * todo：文件解压
             */
            DecompressionFile:function(){
                this.$prompt('请输入文件名', '解压包名称', { confirmButtonText: '确定', cancelButtonText: '取消'}).then(({ value }) => {
                    let params = {
                        path : this.fileObject.path,
                        resource:value
                    };
                    apiLists.Decompression(params).then(response=>{
                        if (response && response.data.code === 200){
                            this.$message({type:'success',message:response.data.msg});
                            let data = { msg:'文件解压成功',result:response.data.result };
                            this.saveSystemLog(data);
                            this.getFileLists(this.path);
                        }
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '取消输入'});
                });
            },
            /**
             * todo：文件下载
             */
            downloadFile:function(){
                this.$alert('确定下载文件：'+this.fileObject.path,'文件下载').then(()=>{
                    window.open(process.env.API_ROOT+$url.fileDownload+"?token="+this.token+"&path="+this.fileObject.path,'__target');
                    let data = { msg:'文件下载成功：'+this.fileObject.path };
                    this.saveSystemLog(data);
                    this.$message({type:'success',message:'download file successfully'});
                }).catch(() => {
                    this.$message({type: 'info', message: '取消下载'});
                });
            },
            /**
             * todo：文件上传弹出框
             */
            uploadFile:function(){
                this.fileSyncVisible = true;
                this.fileList = [];
                this.fileData.token = this.token;
                if (this.fileObject.fileType === 'file'){
                    this.fileData.path = this.fileObject.path.replace(this.fileObject.label,'');
                } else if (this.fileObject.fileType === 'dir'){
                    this.fileData.path = this.fileObject.path;
                }
            },
            /**
             * todo：确定文件上传
             */
            submitUpload() {
                this.$refs.upload.submit();
            },
            /**
             * todo：文件上传成功回调
             */
            handelSuccess:function(response){
                if (response.code === 200){
                    let ext = response.item.name.split(".")[1];
                    let imgArr = ['png','jpeg','gif'];
                    if (imgArr.includes(ext.toLowerCase())){
                        this.$alert('是否预览图片?','图片预览').then(()=>{
                            this.imgVisible = true;
                            apiLists.ImagePreview({name:response.item.name}).then(response=>{
                                if (response && response.data.code === 200){
                                    this.dialogImageUrl = response.data.item.src;
                                }
                            })
                        })
                    }
                    this.$message({type:'success',message:response.msg});
                    let data = { msg:response.msg,result:response };
                    this.saveSystemLog(data);
                    this.getFileLists(this.path);
                    this.fileSyncVisible = false;
                }
            },
            /**
             * todo：修改编辑器内容
             * @param content
             */
            updateContent:function(content){
                this.fileModel.content = content;
            },
        },
        created(){
            this.activeFileTabName = this.currFileObj.name;
            this.fileModel = this.currFileObj;
            if (this.activeFileTabName === null){
                this.fileModel.content = '';
                this.showIdea = false; //隐藏编辑器
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.url = this.cgi.update;
                this.getFileLists(this.path);
            });
        }
    }
</script>

<style scoped>

</style>
