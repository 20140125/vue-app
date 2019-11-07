<template>
    <quill-editor v-model="messages"
                  ref="myQuillEditor"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @change="onEditorChange($event)"
                  @ready="onEditorReady($event)" style="height: 400px;padding-bottom: 40px">
    </quill-editor>
</template>

<script>
    import {editorOption} from '../../api/vue-quill-editor-config'
    export default {
        data () {
            return {
                messages: '',
                avatar_url:'',
                editorOption:editorOption,
            }
        },
        methods: {
            onEditorBlur () {
                console.log('blur', this.messages)
            },
            onEditorFocus () {
                console.log('focus', this.messages)
            },
            onEditorReady () {
                console.log('ready', this.messages)
            },
            onEditorChange({ quill, html, text }) {
            },
        },
    }
</script>
<style>
</style>
