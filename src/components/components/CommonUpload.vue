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
            :show-file-list="showFileList"
            :file-list="fileList"
            :list-type="listType">
        <el-button :style="btnStyle" plain size="medium" type="primary">点击上传</el-button>
        <span v-if="showTips" slot="tip" class="el-upload__tip" style="margin-left: 20px;">请上传{{imgWidth}}*{{imgHeight}}的 jpg/png 图片</span>
    </el-upload>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'CommonUpload',
        props: {
            fileList: {
                type: Array,
                default: () => []
            },
            imgWidth: {
                type: Number,
                default: () => 320
            },
            imgHeight: {
                type: Number,
                default: () => 250
            },
            checkSize: {
                type: Boolean,
                default: () => true
            },
            fileSize: {
                type: Number,
                default: () => 1024 // KB
            },
            uploadSuccess: {
                type: Function
            },
            handleRemove: {
                type: Function
            },
            uploadLimit: {
                type: Number,
                default: () => 1
            },
            action: {
                type: String,
                default: () => process.env.API_ROOT + 'v1/common/upload'
            },
            showFileList: {
                type: Boolean,
                default: () => true
            },
            listType: {
                type: String,
                default: () => 'picture'
            },
            btnStyle: {
                type: String | Object,
                default: () => '' | {}
            },
            showTips: {
                type: Boolean,
                default: () => false
            }
        },
        data () {
            return {
                uploadData: {}
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        methods: {
            /**
             * todo:文件上传
             * @param file
             */
            uploadFile: function (file) {
                let param = new FormData() // 创建form对象
                param.append('file', file.file)
                param.append('filename', file.file.name)
                param.append('username', this.userInfo.username || 'tourist')
                // 添加请求头
                let config = {headers: {'Content-Type': 'multipart/form-data'}}
                this.$http.post(file.action, param, config).then(response => {
                    response.data.filename = file.filename
                    file.onSuccess(response.data)
                }).catch(() => {
                    file.onError()
                })
            },
            /**
             * todo:上传图片前处理函数
             * @param file
             * @returns {Promise<unknown> | boolean}
             */
            beforeUpload: function (file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
                const isFileSize = file.size / 1024 / this.fileSize < 1
                if (!isJPG) {
                    this.$message.error('上传图片只能是 jpg、png 格式!')
                    return false
                }
                if (!isFileSize) {
                    let size = this.fileSize >= 1024 ? Math.floor(this.fileSize / 1024) + 'MB' : this.fileSize + 'KB'
                    this.$message.error('上传图片大小不能超过 ' + size)
                    return false
                }
                // 不校验图片尺寸
                if (!this.checkSize) {
                    return isJPG && isFileSize
                }
                let __this = this
                const isSize = new Promise(function (resolve, reject) {
                    let width = __this.imgWidth
                    let height = __this.imgHeight
                    let _URL = window.URL || window.webkitURL
                    let image = new Image()
                    image.onload = function () {
                        let valid = (image.width === width && image.height === height) || (image.width >= width - 10 && image.height >= height - 10 && image.width <= width + 10 && image.height <= height + 10)
                        // eslint-disable-next-line prefer-promise-reject-errors
                        valid ? resolve() : reject()
                    }
                    image.src = _URL.createObjectURL(file)
                }).then(() => {
                    return file
                }, () => {
                    __this.$message.error('上传图片尺寸不符合,只能是' + __this.imgWidth + '*' + __this.imgHeight + '!')
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject()
                })
                return isJPG && isFileSize && isSize
            }
        }
    }
</script>
