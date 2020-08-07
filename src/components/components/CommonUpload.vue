<template>
    <el-upload
            style="padding-left: 5px;"
            class="upload-demo"
            :http-request="uploadFile"
            :action="action"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :limit="uploadLimit"
            :file-list="fileList"
            list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
        <span slot="tip" class="el-upload__tip" style="margin-left: 20px;">请上传{{imgWidth}}*{{imgHeight}}的 jpg/png 图片</span>
    </el-upload>
</template>

<script>
    export default {
        name: "CommonUpload",
        props:{
            fileList:{
                type:Array,
                default:()=>[],
            },
            imgWidth:{
                type:Number,
                default:()=>320
            },
            imgHeight:{
                type:Number,
                default:()=>250,
            },
            fileSize:{
                type:Number,
                default:()=> 1024  //KB
            },
            uploadSuccess:{
                type:Function
            },
            handleRemove:{
                type:Function
            },
            uploadLimit:{
                type:Number,
                default:()=> 1
            },
            action: {
                type: String,
                default:()=>"https://www.fanglonger.com/api/v1/wx/upload"
            },
        },
        data(){
            return {

            }
        },
        methods:{
            /**
             * todo:文件上传
             * @param file
             */
            uploadFile:function(file) {
                let param = new FormData(); //创建form对象
                param.append("file", file.file);
                param.append('filename',file.file.name);
                //添加请求头
                let config = {headers: {"Content-Type": "multipart/form-data"}};
                this.$http.post(file.action, param, config).then(response => {
                    response.data.filename = file.filename;
                    file.onSuccess(response.data);
                }).catch(() => {
                    file.onError();
                });
            },
            /**
             * todo:上传图片前处理函数
             * @param file
             * @returns {Promise<unknown> | boolean}
             */
            beforeUpload:function(file) {
                const isJPG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
                const isLt30KB = file.size / 1024 / this.fileSize < 1;
                if (!isJPG) {
                    this.$message.error("上传图片只能是 jpg、png 格式!");
                    return false;
                }
                if (!isLt30KB) {
                    this.$message.error("上传图片大小不能超过 "+this.fileSize+"KB!");
                    return false;
                }
                let __this = this;
                const isSize = new Promise(function(resolve, reject) {
                    let width = __this.imgWidth;
                    let height = __this.imgHeight;
                    let _URL = window.URL || window.webkitURL;
                    let image = new Image();
                    image.onload = function() {
                        let valid =(image.width === width && image.height === height)
                            || (image.width >= width-10 && image.height >= height-10 && image.width <= width+10 && image.height <= height+10);
                        valid ? resolve() : reject();
                    };
                    image.src = _URL.createObjectURL(file);
                }).then(() => {
                        return file
                    }, () => {
                        __this.$message.error("上传图片尺寸不符合,只能是"+__this.imgWidth+"*"+__this.imgHeight+"!");
                        return Promise.reject();
                    }
                );
                return isJPG && isLt30KB && isSize;
            },
        }
    }
</script>

<style scoped>

</style>