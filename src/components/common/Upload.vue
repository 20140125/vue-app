<template>
    <el-upload :action="uploadUrl"
               :data="fileData"
               :headers="headers"
               :show-file-list="showFile"
               :index="index"
               :on-success="uploadSuccess"
               :before-upload="beforeUpload">
        <el-avatar :src="avatar_url" :alt="username" fit="cover" :size="size"></el-avatar>
    </el-upload>
</template>

<script>
    import func from '../../api/func'
    export default {
        name: 'Upload',
        props: {
            avatar_url: {
                type: String,
                default: () => ''
            },
            username: {
                type: String,
                default: () => ''
            },
            size: {
                type: [Number, String],
                default: () => 100
            },
            index: {
                type: [Number, String],
                default: () => 1
            },
            showFile: {
                type: Boolean,
                default: () => false
            },
            /* 上传图片的大小 */
            sizeLimit: {
                type: Number,
                default: () => 2
            }
        },
        data () {
            return {
                fileData: {},
                headers: {},
                uploadUrl: process.env.API_ROOT + 'v1/common/upload'
            }
        },
        methods: {
            /**
             * TODO：图片上传成功
             * @param response
             */
            uploadSuccess: function (response) {
                if (response && response.code === 200) {
                    this.$message({type: 'success', message: response.msg})
                    this.$emit('uploadSuccess', response.item.src)
                    return
                }
                this.$message({type: 'warning', message: response.msg})
            },
            /**
             * TODO：图片上传前
             * @param file
             */
            beforeUpload: function (file) {
                let type = file.type
                let typeArr = ['image/jpg', 'image/gif', 'image/png', 'image/jpeg']
                if (!typeArr.includes(type)) {
                    this.$message({type: 'warning', message: 'upload image format error'})
                    return false
                }
                if (file.size > this.sizeLimit * 1024 * 1024) {
                    this.$message({type: 'warning', message: 'upload image size error'})
                    return false
                }
                return true
            }
        },
        created () {
            this.fileData.token = this.$store.state.login.token
            this.fileData.rand = true
            this.headers.Authorization = `${func.setPassword(func.setRandom(32), func.setRandom(12))}${this.fileData.token}${func.setPassword(func.setRandom(32), func.setRandom(12))}`
        }
    }
</script>

<style scoped>

</style>
