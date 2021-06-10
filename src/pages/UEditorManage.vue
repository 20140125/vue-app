<template>
    <quill-editor v-model="messages"
                  id="quill"
                  ref="myQuillEditor"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @change="onEditorChange($event)"
                  @ready="onEditorReady($event)" style="height: 400px;padding-bottom: 40px">
    </quill-editor>
</template>

<script>
    import {editorOption} from '../api/vue-quill-editor-config'
    export default {
        data () {
            return {
                messages: '',
                avatar_url: '',
                editorOption: editorOption
            }
        },
        methods: {
            onEditorBlur: function () {
                console.log('blur', this.messages)
            },
            onEditorFocus: function () {
                console.log('focus', this.messages)
            },
            onEditorReady: function () {
                console.log('ready', this.messages)
            },
            onEditorChange: function ({ quill, html, text }) {
                console.log({ quill, html, text })
            }
        }
    }
</script>
<style>
#quill .ql-tooltip{
    left: 40% !important;
}
</style>
