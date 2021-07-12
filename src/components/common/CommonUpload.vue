<template>
    <el-upload
        ref="upload"
        :name="data.name || 'file'"
        :data="data"
        :http-request="uploadFile"
        :action="action"
        :auto-upload="autoUpload"
        :on-success="uploadSuccess"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        :limit="uploadLimit"
        :file-list="fileList"
        :list-type="listType">
        <el-button size="small" type="primary" v-if="listType === 'picture'">点击上传</el-button>
        <i class="el-icon-plus" v-if="listType === 'picture-card'"></i>
        <span v-if="showTips" class="el-upload__tip" style="margin-left: 20px;">{{`请上传${imgWidth}*${imgHeight}的jpg/png 图片`}}</span>
    </el-upload>
    <el-button v-if="!autoUpload" style="margin-top: 20px" plain type="primary" size="medium" @click="submitUpload">上传到服务器</el-button>
</template>

<script>

import func from '@/utils/func'
import URLS from '@/api/urls'
import $http from '@/tools/request'

export default {
    name: 'CommonUpload',
    props:{
        /* 图片图像 */
        fileList:{
            type: Array,
            default:()=>[],
        },
        /* 图片宽度 */
        imgWidth:{
            type:Number,
            default: () => 320
        },
        /* 图片高度 */
        imgHeight: {
            type: Number,
            default:() => 250,
        },
        /* 图片大小 */
        fileSize: {
            type: Number,
            default: ()=> 1024
        },
        /* 图片上传成功 */
        uploadSuccess: {
            type: Function
        },
        /* 图片上传失败 */
        handleRemove: {
            type: Function
        },
        /* 图片个数 */
        uploadLimit: {
            type: Number,
            default: () => 1
        },
        /* 图片名称 */
        data: {
            type: Object,
            default: () => {}
        },
        /* 是否展示说明 */
        showTips: {
            type: Boolean,
            default: false
        },
        /* 卡片类型 */
        listType: {
            type: String,
            default: () => 'picture'
        },
        /* 图片上传地址 */
        action: {
            type: String,
            default:() => URLS.baseURL + URLS.file.upload
        },
        /* 自动上传 */
        autoUpload: {
            type: Boolean,
            default: () => true
        }
    },
    methods:{
        /**
         * todo:点击上传
         */
        submitUpload() {
            this.$refs.upload.submit()
        },
        /**
         * todo:文件上传
         * @param file
         */
        uploadFile(file) {
            /* 创建form对象 */
            let param = new FormData()
            param.append('file', file.file)
            param.append('filename', file.file.name)
            param.append('token', this.$store.getters.token)
            param.append('round_name', this.data.round_name || false)
            param.append('path', this.data.file.path.replace(this.data.file.filename, ''))
            /* 添加请求头 */
            let config = { headers: { 'Content-Type': 'multipart/form-data' } }
            $http.post(file.action, param, config).then(response => {
                response.data.filename = file.filename
                file.onSuccess(response.data)
            }).catch(() => {
                file.onError()
            })
        },
        /**
         * todo：获取图片背景颜色
         * @param file
         */
        getBackgroundColor(file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (e) => {
                const image = new Image()
                image.src = e.target.result
                image.onload = () => {
                    const canvas =  document.getElementById('s-award-canvas')
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight)
                    this.$emit('setBackgroundColor', func.rgbToHex(ctx.getImageData(0, 0,image.width, image.height).data))
                }
            }
        },
        /**
         * todo:上传图片前处理函数
         * @param file
         * @returns {Promise<*>|boolean}
         */
        beforeUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
            const isLt30KB = file.size / 1024 / this.fileSize < 1
            if (!isJPG) {
                this.$message.error('上传图片只能是 jpg、png 格式!')
                return false
            }
            if (!isLt30KB) {
                this.$message.error(`上传图片大小不能超过${this.fileSize}KB!`)
                return false
            }
            if (!this.imgHeight && !this.imgWidth) {
                return isJPG && isLt30KB
            }
            let __this = this
            const isSize = new Promise(function(resolve, reject) {
                let width = __this.imgWidth
                let height = __this.imgHeight
                let _URL = window.URL || window.webkitURL
                let image = new Image()
                image.onload = function() {
                    let valid =(image.width === width && image.height === height)
                        || (image.width >= width - 10 && image.height >= height - 10 && image.width <= width + 10 && image.height <= height + 10)
                    valid ? resolve() : reject()
                }
                image.src = _URL.createObjectURL(file)
            }).then(() => {
                    return file
                }, () => {
                    __this.$message.error(`上传图片尺寸不符合,只能是${__this.imgWidth}*${__this.imgHeight}!`)
                    return Promise.reject()
                }
            )
            return isJPG && isLt30KB && isSize
        }
    }
}
</script>

<style>

</style>
