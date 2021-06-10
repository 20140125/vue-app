<template>
    <BaseLayout :loading="loading">
        <div slot="header">
            <el-form-item v-if="authAttr.btn.add">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addAuth">添 加</el-button>
            </el-form-item>
        </div>
        <div slot="body">
            <AuthLists :auth-attr="authAttr" @setPagination="setPagination" ref="authLists" @addAuth="addAuth" @updateAuth="updateAuth"></AuthLists>
        </div>
        <div slot="dialog">
            <AuthEdit :form="authModel" ref="authEdit" :auth-attr="authAttr" :sync-visible="syncVisible" :re-from="reFrom" @closeDialogEvent="closeDialogEvent"></AuthEdit>
        </div>
    </BaseLayout>
</template>

<script>
    import func from '../api/func'
    import $url from '../api/url'
    import { mapGetters } from 'vuex'
    import AuthLists from '../components/auth/List'
    import BaseLayout from './BaseLayout'
    import AuthEdit from '../components/auth/Edit'
    export default {
        name: 'lists',
        components: { AuthEdit, BaseLayout, AuthLists },
        data () {
            return {
                syncVisible: false, // 是否显示弹框
                loading: true,
                reFrom: 'created',
                authModel: {},
                authAttr: {
                    cgi: { insert: $url.authSave, update: $url.authUpdate, remove: $url.authDelete, status: $url.authUpdate },
                    btn: {},
                    search: '',
                    labelWidth: '100px',
                    url: '',
                    authLevel: []
                }
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        mounted () {
            this.$nextTick(() => {
                this.authAttr.btn = func.setBtnStatus(this.$route.path, this.$route.name, this.userInfo.auth)
            })
        },
        methods: {
            /**
             * todo:设置页码
             */
            setPagination: function (pagination) {
                this.loading = pagination.page_loading
            },
            /**
             * todo：权限添加
             * @param scope
             */
            addAuth: function (scope = {}) {
                if (this.authAttr.authLevel.length <= 0) {
                    this.$refs['authLists'].getAuth()
                }
                this.syncVisible = true
                this.title = '添加权限'
                this.authAttr.url = this.authAttr.cgi.insert
                this.reFrom = 'created'
                this.authModel = { name: '', href: '', status: 1, pid: '0', level: 0, path: '1' }
                this.authModel.pid = scope.name ? scope.id.toString() : '0'
            },
            /**
             * todo:弹框关闭
             * @param action
             */
            closeDialogEvent: function (action) {
                this.syncVisible = false
                if (action === 'save') {
                    this.$refs['authLists'].getAuthLists()
                }
            },
            /**
             * todo：权限保存
             * @param item
             */
            updateAuth: function (item) {
                this.syncVisible = true
                this.title = '修改权限'
                this.authAttr.url = this.authAttr.cgi.update
                this.authModel = item
                this.reFrom = 'update'
                this.authModel.pid = this.authModel.pid.toString()
            }
        }
    }
</script>

<style scoped>

</style>
