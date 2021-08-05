<template>
    <v-md-editor
        v-model="model"
        height="600px"
        ref="markdown"
        :mode="mode"
        :disabled-menus="[]"
        @upload-image="uploadFile"
        @save="saveHandle"
        @change="changeHandle">
    </v-md-editor>
</template>

<script>

export default {
    name: 'MarkDown',
    props: {
        markdown: {
            type: String,
            default: () => ''
        },
        /* todo：edit(纯编辑模式) editable(编辑与预览模式) preview(纯预览模式). */
        mode: {
            type: String,
            default: () => 'editable'
        },
        /* todo：数据保存 */
        saveHandle: {
            type: Function
        },
        /* todo：数据修改 */
        changeHandle: {
            type: Function
        },
        /* todo：图片上传 */
        uploadFile: {
            type: Function
        },
    },
    data() {
        return {
            model: this.markdown
        }
    },
}
</script>

<style scoped>

</style>
