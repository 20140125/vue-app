<template>
    <div v-loading="loading" :element-loading-text="loadingText" style="margin: 0 20px" id="imageView">
        <CommonUpload :check-size="false" :upload-limit="1000" :file-size="2048" :show-file-list="false" :btn-style="{margin:'0 0 10px 65px'}" :upload-success="uploadSuccess"/>
        <el-row :span="24">
            <el-col :span="7"  v-for="(image,index) in filtersListsPart" :key="index" :offset="1" style="margin-bottom: 10px;margin-top: 10px">
                <el-card :body-style="{ padding: '0px',border: 'none' }" shadow="hover">
                    <el-image lazy fit="fill" :title="image.label"  :alt="image.label"  :src="image.url" class="image" :preview-src-list="[image.url]"/>
                    <div style="padding: 14px;">
                        <span v-html="image.label"/>
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
            :page-size="limit"
            :current-page="page"
            small
            style="float:right;margin:30px 0"
            @current-change="currentChange"/>
    </div>
</template>

<script>
import apiLists from "../../api/api";
import {mapGetters,mapActions} from 'vuex'
import $url from "../../api/url";
import CommonUpload from "../components/CommonUpload";
export default {
    name: "imageView",
    components: {CommonUpload},
    data(){
        return {
            loading:false,
            fileLists:[],
            filtersListsPart:[],
            loadingText:'数据加载中...',
            fullImagePart:[],
            path:'storage_path',
            limit:9,
            page:1,
            total:0,
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
         * todo:文件上传成功
         * @param response
         * @param file
         */
        uploadSuccess:function (response,file) {
            if (response && response.code === 200) {
                this.getFileLists(this.path);
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
                        let data = { msg:response.data.msg+'：'+image.path,href:$url.fileDelete };
                        this.saveSystemLog(data);
                        this.getFileLists(this.path);
                        this.$message({type:'success',message:response.data.msg+'：'+image.alt});
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
            this.filtersListsPart = [];
            this.fileLists = [];
            imageObj.map(item=>{
                if (item.children.length>0) {
                    item.children.map(row=>{
                        let ext = row.label.split(".")[1], imgExt = ['png','jpg','jpeg','gif'];
                        if (imgExt.includes(ext.toLowerCase())) {
                            this.$set(row,'url',this.userInfo.local+'storage'+row.path.substr(row.path.indexOf('public')+6,row.path.length-row.path.indexOf('public')))
                            this.fileLists.push(row);
                            this.fullImagePart.push(row.url);
                        }
                    })
                }
            });
            this.total = this.fileLists.length;
            this.fileLists.sort(function (a,b){
                return a.time<b.time ? 1 : -1;
            });
            this.filtersListsPart = this.fileLists.slice(0,this.total>this.limit ? this.limit : this.total)
        }
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