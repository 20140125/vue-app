<template>
    <div v-loading="loading" :element-loading-text="loadingText" style="margin: 0 20px" id="imageView">
        <el-upload
            :on-success="uploadSuccess"
            :data="fileData"
            :headers="headers"
            :before-upload="beforeUpload"
            :show-file-list = false
            :action="action">
            <el-button style="margin:0 0 10px 5px" size="medium" type="primary" plain>点击上传</el-button>
        </el-upload>
        <el-row>
            <el-col :span="7"  v-for="(image,index) in filtersListsPart" :key="index" :offset="1" style="margin: 10px">
                <el-card :body-style="{ padding: '0px',border: 'none' }" shadow="hover">
                    <el-image fit="fill" :title="image.alt"  :alt="image.alt"  :src="image.url" class="image" :preview-src-list="[image.url]"/>
                    <div style="padding: 14px;">
                        <span v-html="image.alt"/>
                        <div class="bottom clearfix">
                            <time class="time">{{ image.time }}</time>
                            <el-button @click="deleteImg(image,index)" type="text" class="button" icon="el-icon-delete">删 除</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-pagination
            layout="prev, pager, next"
            :total="total"
            style="float:right;margin:30px 0"
            @current-change="currentChange"/>
    </div>
</template>

<script>
import apiLists from "../../api/api";
import {mapGetters,mapActions} from 'vuex'
import func from "../../api/func";
import $url from "../../api/url";
export default {
    name: "imageView",
    data(){
        return {
            loading:false,
            fileLists:[],
            filtersListsPart:[],
            loadingText:'数据加载中...',
            fullImagePart:[],
            path:'storage_path',
            action:process.env.API_ROOT+$url.fileUpload.replace('/',''),
            limit:9,
            page:1,
            total:0,
            headers:{},
            fileData:{},
            visible: false,
        }
    },
    computed:{
        ...mapGetters(['userInfo'])
    },
    mounted() {
        this.$nextTick(function () {
            this.getFileLists(this.path);
        });
    },
    methods:{
        ...mapActions(['saveSystemLog']),
        /**
         * todo:上传图片前处理函数
         * @param file
         * @returns boolean
         */
        beforeUpload:function(file) {
            const isJPG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error("上传图片只能是 jpg、png 格式!");
                return false;
            }
            if (!isLt2M) {
                this.$message.error("上传图片大小不能超过2M");
                return false;
            }
            return isJPG && isLt2M;
        },
        /**
         * todo:文件上传成功
         * @param response
         * @param file
         */
        uploadSuccess:function (response,file) {
            if (response && response.code === 200) {
                this.fileLists.unshift({url:response.item.src, alt:file.name,time:func.set_time(new Date())});
                this.filtersListsPart = this.fileLists.slice(0,this.total>this.limit ? this.limit : this.total)
            } else {
                this.$message.error(response.msg);
            }
        },
        /**
         * todo:图片删除
         * @param image
         * @param index
         */
        deleteImg:function (image,index) {
            this.$confirm('此操作将永远删除该条记录，是否继续？','删除记录',{confirmButtonText:'确定', cancelButtonText:'取消', type:'warning'}).then(()=> {
                let params = {path:image.path};
                apiLists.FileDelete(params).then((response)=> {
                    if (response && response.data.code === 200) {
                        let data = { msg:response.data.msg+'：'+params.path,href:$url.fileDelete };
                        this.saveSystemLog(data);
                        this.filtersListsPart.slice(index,1);
                        this.$message({type:'success',message:response.data.msg+'：'+params.label});
                    }
                })
            }).catch(()=> {
                this.$message({type:'info',message:'cancel remove！'});
            });
        },
        /**
         * todo：获取文件列表
         * @param path
         */
        getFileLists:function (path) {
            this.loading = true;
            let params = {path:path,basename:'/app/public//',sort:'time',sort_order:'desc'};
            apiLists.FileLists(params).then((response)=>{
                if (response && response.data.code === 200){
                    this.getImage(response.data.item)
                    this.loading = false;
                }
            });
        },
        /**
         * todo:分页展示数据
         * @param page
         */
        currentChange:function (page) {
            this.page = page;
            this.getTransactionData();
        },

        /**
         * todo：数据分页
         */
        getTransactionData:function() {
            let offset = this.limit*(this.page-1);
            this.filtersListsPart = (offset + this.limit >= this.fileLists.length)
                ? this.fileLists.slice(offset, this.fileLists.length)
                : this.fileLists.slice(offset, offset + this.limit);
        },
        /**
         * todo:文件列表
         * @param imageObj
         */
        getImage:function (imageObj) {
            imageObj.map(item=>{
                if (item.children.length>0) {
                    item.children.map(row=>{
                        let ext = row.label.split(".")[1], imgExt = ['png','jpg','jpeg','gif'];
                        if (imgExt.includes(ext.toLowerCase())) {
                            this.fileLists.push(
                                {
                                    url:this.userInfo.local+'storage'+row.path.substr(row.path.indexOf('public')+6,row.path.length-row.path.indexOf('public')),
                                    alt:row.label,
                                    time:row.time,
                                    path:row.path,
                                }
                            );
                            this.fullImagePart.push(this.userInfo.local+'storage'+row.path.substr(row.path.indexOf('public')+6,row.path.length-row.path.indexOf('public')));
                            this.total = this.fileLists.length;
                            this.filtersListsPart = this.fileLists.slice(0,this.total>this.limit ? this.limit : this.total)
                        }
                    })
                }
            });
            this.filtersListsPart.sort(function (a,b){
                return a.time<b.time ? 1 : -1;
            });
        }
    },
    created(){
        this.fileData.token = this.$store.state.login.token;
        this.fileData.rand = true;
        this.headers.Authorization = `${func.set_password(func.set_random(32),func.set_random(12))}${this.fileData.token}${func.set_password(func.set_random(32),func.set_random(12))}`
    },
}
</script>
<style lang="less">
#imageView {
    .el-card {
        border-radius: 0 !important;
        -webkit-border-radius: 0 !important;
        -moz-border-radius: 0 !important;
    }
    .time {
        font-size: 13px;
        color: #999;
    }
    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        height: 300px;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
}
</style>