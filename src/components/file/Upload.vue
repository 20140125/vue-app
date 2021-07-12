<template>
    <div id="upload">
        <el-dialog v-model="visible" :title="`文件上传`" center :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" @close="$emit('getFileLists')">
            <CommonUpload list-type='picture-card'
                          :img-height="0"
                          :img-width="0"
                          :auto-upload="false"
                          :data="{ name: 'file', file: file, round_name: false }">
            </CommonUpload>
        </el-dialog>
    </div>
</template>

<script>
import CommonUpload from '@/components/common/CommonUpload'
export default {
    name: 'FileUpload',
    components: { CommonUpload },
    props: ['uploadVisible', 'file'],
    data () {
        return {
            visible: this.uploadVisible
        }
    },
    watch: {
        uploadVisible() {
            this.visible = this.uploadVisible
        },
    }
}
</script>

<style lang="less">
#upload {

}
</style>
