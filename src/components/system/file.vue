<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-row :gutter="24">
            <!--文件列表-->
            <el-col :xl="{'span':5}" :lg="{'span':5}" :md="{'span':24}" :sm="{'span':24}" :xs="{'span':24}" style="margin-bottom: 20px">
                <el-input placeholder="输入关键字搜索" v-model="filterText" style="margin-bottom: 20px"/>
                <el-tree :data="fileLists"  @node-contextmenu="rightClick"
                         :highlight-current="highlight"
                         :props="props"
                         :filter-node-method="filterNode"
                         :node-key="props.id" @node-click="getFileContent"
                         ref="tree"
                         id="tree"
                         style="background-color: #393d49"/>
            </el-col>
            <!--文件列表-->
            <!--文件内容-->
            <el-col :xl="{'span':18,'push':1}" :lg="{'span':18,'push':1}" :md="{'span':24}" :sm="{'span':24}" :xs="{'span':24}" v-show="showIdea">
                <el-form :model="fileModel" :ref="reFrom">
                    <el-form-item style="margin-left: -30px !important;">
                        <el-tabs type="border-card" closable v-model="activeFileTabName"  @tab-click="goto" @tab-remove="removeTabName" style="text-align: left!important;">
                            <el-tab-pane v-for="item in fileTabs" :label="item.label" :key="item.name" :name="item.name"/>
                            <el-card shadow="always">
                                <codemirror @change="updateContent" ref="edit" :value="fileModel.content" :options="options" style="line-height: 20px"/>
                            </el-card>
                        </el-tabs>
                    </el-form-item>
                </el-form>
                <Submit style="text-align: center !important;" :reFrom="reFrom" :model="fileModel" :url="url" :refs="refs" v-on:success="success" v-if="btn.edit"/>
            </el-col>
            <!--文件内容-->
        </el-row>
        <!--鼠标右键-->
        <div v-show="menuVisible" style="z-index:100">
            <el-menu id="menu" class="menu" mode="horizontal" style="border-bottom: solid 1px #393d49" background-color="#393d49" text-color="#cccccc" active-text-color="#ffd04b">
                <el-menu-item  @click="addFile" v-show="showRightBtn.add && btn.add"><i class="el-icon-circle-plus-outline"/>添 加</el-menu-item>
                <el-menu-item  @click="renameFile" v-show="showRightBtn.rename && btn.rename"><i class="el-icon-edit-outline"/>重命名</el-menu-item>
                <el-menu-item  @click="authFile" v-show="showRightBtn.auth && btn.chmod"><i class="el-icon-user-solid"/>权 限</el-menu-item>
                <el-menu-item  @click="compressionFile" v-show="showRightBtn.compression && btn.gzip"><i class="el-icon-collection"/>压 缩</el-menu-item>
                <el-menu-item  @click="DecompressionFile" v-show="showRightBtn.DeCompression && btn.unzip"><i class="el-icon-receiving"/>解 压</el-menu-item>
                <el-menu-item  @click="downloadFile" v-show="showRightBtn.download && btn.download"><i class="el-icon-download"/>下 载</el-menu-item>
                <el-menu-item  @click="uploadFile" v-show="showRightBtn.upload && btn.upload"><i class="el-icon-upload"/>上 传</el-menu-item>
                <el-menu-item  @click="deleteFile" v-show="showRightBtn.remove && btn.del"><i class="el-icon-delete-solid"/>删 除</el-menu-item>
            </el-menu>
        </div>
        <!--鼠标右键-->
        <!--权限框-->
        <el-dialog :visible.sync="syncVisible" :width="dialogWidth" :modal="modal" :title="title" :center="center">
            <el-form :label-width="labelWidth" :model="chmodModel" :rules="rules" :ref="reFrom">
                <el-form-item label="权限" prop="auth" required>
                    <el-input placeholder="请输入内容" @change="setChmodAuth" v-model="chmodModel.auth"/>
                </el-form-item>
                <el-form-item label="所有者" required>
                    <el-checkbox-group v-model="all"  @change="allChange">
                        <el-checkbox border size="small" v-for="checkBox in checkBoxArr" :label="checkBox.value" :key="checkBox.id"/>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="用户组" required>
                    <el-checkbox-group v-model="user"  @change="userChange">
                        <el-checkbox border size="small" v-for="checkBox in checkBoxArr" :label="checkBox.value" :key="checkBox.id"/>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="公共" required>
                    <el-checkbox-group v-model="common" @change="commonChange">
                        <el-checkbox border size="small" v-for="checkBox in checkBoxArr" :label="checkBox.value" :key="checkBox.id"/>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="chmodModel" :url="url" :refs="refs"  v-on:success="success"/>
            </div>
        </el-dialog>
        <!--权限框-->
        <!--文件上传-->
        <el-dialog :visible.sync="fileSyncVisible" :width="dialogWidth" :modal="modal" title="文件上传" :center="center">
            <el-button style="margin-left: 10px;margin-bottom: 20px" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <el-upload ref="upload"
                       :data="fileData"
                       :action="cgi.uploadUrl"
                       :headers="headers"
                       :on-remove="handleRemove"
                       :on-success="handleSuccess"
                       :file-list="fileList"
                       :auto-upload="false"
                       list-type="picture-card">
                <i slot="trigger" class="el-icon-plus"/>
            </el-upload>
        </el-dialog>
        <!--文件上传-->

        <!--图片预览-->
        <el-dialog id="file" :visible.sync="imgVisible" width="30%" :title="dialogTitle" center :show-close="false">
            <el-image v-if="dialogImageUrl" :src="dialogImageUrl" :alt="dialogTitle" fit="cover" :preview-src-list="[dialogImageUrl]" style="width: 300px;height: 300px"/>
            <video v-if="dialogVideoUrl" :src="dialogVideoUrl" autoplay controls width="300px" height="300px">您的浏览器不支持 video 标签。</video>
        </el-dialog>
        <!--图片预览-->
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import func from '../../api/func';
    import $url from '../../api/url';
    import Submit from "../common/Submit";
    import { mapGetters,mapActions } from 'vuex';
    import { codemirror } from 'vue-codemirror-lite'
    //编辑器代码 php
    require('codemirror/mode/php/php.js');
    require('codemirror/mode/sql/sql.js')
    require('codemirror/addon/hint/sql-hint.js')
    require('codemirror/addon/hint/show-hint.js')
    require('codemirror/mode/markdown/markdown.js');
    require('codemirror/mode/xml/xml.js');
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
        components: {Submit,codemirror},
        data(){
            return {
                //树组件
                props:{ label:'label', children:'children', isLeaf:false },
                //文件授权
                checkBoxArr:[{'id':4,'value':'读取'},{'id':2,'value':'写入'},{'id':1,'value':'执行'}],
                all:[],
                user:[],
                common:[],
                all_id:0,
                user_id:0,
                common_id:0,
                chmodModel:{ auth:parseInt(this.all_id +''+ this.user_id +''+ this.common_id), path:'' },
                //文件压缩
                compressionModel:{docLists:[], resource:'', path:''},
                mode:{
                    markdown:"text/markdown",
                    php:"text/x-php",
                    xml:"text/xml",
                    json:"application/ld+json",
                    sql:"text/x-mysql"
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
                showRightBtn:{ add:true, rename:true, remove:true, compression:true, DeCompression:false, auth:true, download:true, upload:true },
                //文件
                fileModel:{content:'', path:''},
                //文件上传
                fileList:[],
                fileSyncVisible:false,
                fileData:{},
                headers:{},
                //编辑器显示与否
                showIdea:true,
                //地址
                cgi:{
                    update:$url.fileUpdate,
                    chmod:$url.fileChmod,
                    uploadUrl:process.env.API_ROOT+$url.fileUpload.replace('/','')
                },
                //图片弹框
                imgVisible:false,
                dialogImageUrl:'',
                dialogVideoUrl:'',
                dialogTitle:'',
                //规则
                rules:{
                    auth:[
                        { required: true, message: '权限不得为空',trigger:'blur'},
                        { type: 'number', message: '权限必须为数字值',trigger:'blur'}
                    ]
                },
                filterText:'',
                scrollTop:0,
                btn:{},
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        computed:{
            ...mapGetters(['fileTabs','currFileObj','userInfo','dialogWidth']),
        },
        methods:{
            ...mapActions(['addFileTabs','deleteFileTabs','addCurrFileObj','saveSystemLog']),
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.addCurrFileObj(this.fileModel);
                this.getFileLists(this.path);
                this.syncVisible = false;
            },
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
                menu.style.left = tree.offsetWidth + 50 +'px';
                menu.style.top = MouseEvent.clientY + this.scrollTop - 135 + 'px';
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
                let ext = item.label.split(".")[1];
                let compressionExt = ['tar','zip','7z','TAR','ZIP','7Z'];
                if (compressionExt.includes(ext) || item.fileType!=='file'){
                    return false;
                }
                this.dialogTitle = item.label;
                //文件地址
                let commUrl = this.userInfo.local+'storage'+item.path.substr(item.path.indexOf('public')+6,item.path.length-item.path.indexOf('public'));
                //图片浏览
                let imgExt = ['png','jpg','jpeg','gif','PNG','JPG','JPEG','GIF'];
                if (imgExt.includes(ext)) {
                    this.dialogVideoUrl = '';
                    this.dialogImageUrl = commUrl
                    this.imgVisible = true;
                    return false;
                }
                //视频浏览
                let videoExt = ['mp4','flv'];
                if (videoExt.includes(ext)) {
                    this.dialogImageUrl = '';
                    this.dialogVideoUrl = commUrl
                    this.imgVisible = true;
                    return false;
                }
                //excel文件下载
                let xlsExt = ['xls','csv'];
                if (xlsExt.includes(ext)) {
                    this.$confirm('是否下载文件【'+item.label+'】到本地',{showClose:false,center:true}).then(response=>{
                        window.location.href=commUrl
                    }).catch(()=>{})
                    return false
                }
                this.setOptionsMode(ext);
                this.showIdea = true;
                this.activeFileTabName = item.size.toString();
                let params = {path:item.path},tabs = {};
                this.url = this.cgi.update;
                tabs.label = item.label;tabs.name = item.size.toString();tabs.path = item.path;
                apiLists.FileRead(params).then((response)=> {
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
             * TODO:设置编辑器的mode
             * @param ext
             */
            setOptionsMode:function(ext) {
                switch (ext) {
                    case 'xml':
                        this.options.mode = this.mode.xml;
                        break;
                    case 'md':
                        this.options.mode = this.mode.markdown;
                        break;
                    case 'json':
                    case 'lock':
                        this.options.mode = this.mode.json;
                        break;
                    case 'sql':
                        this.options.mode = this.mode.sql;
                        break;
                    default:
                        this.options.mode = this.mode.php;
                        break;
                }
            },
            /**
             * todo：文件重新命名
             */
            renameFile:function(){
                let params = {oldFile:this.fileObject.path};
                this.$prompt('请输入新的文件名', '['+this.fileObject.label+'] 重命名', { confirmButtonText: '确定', cancelButtonText: '取消'}).then(({ value }) => {
                    if (value === '' || value === null || value === 'null' || value === 'undefined') {
                        this.$message.warning('File name cannot be empty');
                        return false;
                    }
                    params.newFile = params.oldFile.replace(this.fileObject.label,value);
                    apiLists.FileRename(params).then(response=>{
                        if (response && response.data.code === 200){
                            this.fileObject.name = value;
                            this.$message({type: 'success', message: response.data.msg+'：'+ value});
                            let data = { href:$url.fileSave, msg:response.data.msg+'：'+ value};
                            this.saveSystemLog(data);
                            this.getFileLists(this.path);
                        }
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: 'cancel entry'});
                });
            },
            /**
             * todo：文件删除
             */
            deleteFile:function() {
                this.$confirm('此操作将永远删除该条记录，是否继续？','删除记录',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=> {
                    let params = {path:this.fileObject.path};
                    apiLists.FileDelete(params).then((response)=> {
                       if (response && response.data.code === 200) {
                           let data = { msg:response.data.msg+'：'+params.path,href:$url.fileDelete };
                           this.saveSystemLog(data);
                           this.getFileLists(this.path);
                           this.$message({type:'success',message:response.data.msg+'：'+params.label});
                       }
                    })
                }).catch(()=> {
                    this.$message({type:'info',message:'cancel remove！'});
                });
            },
            /**
             * todo：新建文件
             */
            addFile:function () {
                let params = {};
                this.$prompt('请输入文件名', '新建文件', { confirmButtonText: '确定', cancelButtonText: '取消'}).then(({ value }) => {
                    if (value === '' || value === null || value === 'null' || value === 'undefined') {
                        this.$message.warning('File name cannot be empty');
                        return false;
                    }
                    //这是一个文件
                    if(this.fileObject.fileType === 'file'){
                        params.path = this.fileObject.path.replace(this.fileObject.label,value);
                    } else if (this.fileObject.fileType === 'dir') {
                        params.path = this.fileObject.path+'/'+value;
                    }
                    apiLists.FileSave(params).then(response=>{
                        if (response && response.data.code === 200){
                            let data = { msg:response.data.msg+'：'+ params.path,href:$url.fileRename };
                            this.saveSystemLog(data);
                            this.getFileLists(this.path);
                            this.$message({type: 'success', message: response.data.msg+'：'+ params.path});
                        }
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: 'cancel entry'});
                });
            },
            /**
             * todo：文件权限设置
             */
            authFile:function(){
                this.syncVisible = true;
                this.title = '设置权限【'+(this.fileObject.label)+'】';
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
                    this.$message({type:'warning',message:'Permission setting failed'});
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
                    if (value === '' || value === null || value === 'null' || value === 'undefined') {
                        this.$message.warning('Archive name must not be empty');
                        return false;
                    }
                    this.compressionModel.resource = value.indexOf('.')>=0 ? value.split(".")[0] : value;
                    this.compressionModel.docLists.push(this.fileObject.path);
                    this.compressionModel.path = this.fileObject.path.replace(this.fileObject.label,'');
                    apiLists.Compression(this.compressionModel).then(response=>{
                        if (response && response.data.code === 200){
                            this.$message({type:'success',message:response.data.msg});
                            let data = { msg:response.data.msg +'：'+ this.fileObject.label,href:$url.fileCompression };
                            this.saveSystemLog(data);
                            this.getFileLists(this.path);
                        }
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: 'cancel entry'});
                });
            },
            /**
             * todo：文件解压
             */
            DecompressionFile:function(){
                this.$prompt('请输入文件名', '解压包名称', { confirmButtonText: '确定', cancelButtonText: '取消'}).then(({ value }) => {
                    if (value === '' || value === null || value === 'null' || value === 'undefined') {
                        this.$message.warning('Extract package name must not be empty');
                        return false;
                    }
                    let params = {path : this.fileObject.path, resource:value.indexOf('.')>=0 ? value.split(".")[0] : value};
                    apiLists.Decompression(params).then(response=>{
                        if (response && response.data.code === 200){
                            this.$message({type:'success',message:response.data.msg});
                            let data = { msg:response.data.msg,href:$url.fileDecompression };
                            this.saveSystemLog(data);
                            this.getFileLists(this.path);
                        }
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: 'cancel input'});
                });
            },
            /**
             * todo：文件下载
             */
            downloadFile:function(){
                this.$alert('确定下载文件：'+this.fileObject.label,'文件下载').then(()=>{
                    window.open(process.env.API_ROOT+$url.fileDownload.replace('/','')+"?token="+this.userInfo.token+"&path="+this.fileObject.path,'__target');
                    let data = { msg:'file download successfully：'+this.fileObject.label,href:$url.fileDownload };
                    this.saveSystemLog(data);
                    this.$message({type:'success',message:'download file successfully'});
                }).catch(() => {
                    this.$message({type: 'info', message: 'cancel download'});
                });
            },
            /**
             * todo：文件上传弹出框
             */
            uploadFile:function(){
                this.fileSyncVisible = true;
                this.fileData.token = this.userInfo.token;
                if (this.fileObject.fileType === 'file'){
                    this.fileData.path = this.fileObject.path.replace(this.fileObject.label,'');
                } else if (this.fileObject.fileType === 'dir'){
                    this.fileData.path = this.fileObject.path;
                }
            },
            /**
             * todo：确定文件上传
             */
            submitUpload:function() {
                this.headers.Authorization = `${func.set_password(func.set_random(32),func.set_random(12))}${this.userInfo.token}${func.set_password(func.set_random(32),func.set_random(12))}`
                this.$refs.upload.submit();
            },
            /**
             * todo：取消文件上传
             * @param file
             */
            handleRemove:function(file) {
                this.$message({type:'warning',message:'cancel file upload：'+file.name});
            },
            /**
             * todo：文件上传成功回调
             */
            handleSuccess:function(response){
                if (response.code === 200){
                    this.$message({type:'success',message:response.msg});
                    let data = { msg:response.msg,result:response,href:$url.fileUpload };
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
            if (this.userInfo.username === 'admin') {
                this.options.readOnly = false;
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.btn = func.set_btn_status(this.$route.path,this.$route.name,this.userInfo.auth);
                this.url = this.cgi.update;
                this.getFileLists(this.path);
            });
        }
    }
</script>

<style>
    #file .el-dialog__body{
        text-align: center !important;
    }
    #file .el-dialog__header{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
