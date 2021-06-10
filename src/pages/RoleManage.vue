<template>
    <BaseLayout :loading="loading" :pagination="pagination">
        <div slot="header">
            <el-form-item v-if="roleAttr.btn.add">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addRole">添加</el-button>
            </el-form-item>
        </div>
        <div slot="body">
            <RoleLists :role-attr="roleAttr" @setPagination="setPagination" ref="roleLists" @updateRole="updateRole"></RoleLists>
        </div>
        <div slot="dialog">
            <RoleEdit :form="form" :role-attr="roleAttr" :sync-visible="syncVisible" :re-form="reFrom" ref="roleEdit" @closeDialogEvent="closeDialogEvent"></RoleEdit>
        </div>
    </BaseLayout>
</template>

<script>
    import $url from '../api/url'
    import func from '../api/func'
    import { mapGetters } from 'vuex'
    import BaseLayout from './BaseLayout'
    import RoleLists from '../components/role/List'
    import RoleEdit from '../components/role/Edit'
    export default {
        name: 'RoleManage',
        components: { RoleEdit, RoleLists, BaseLayout },
        data () {
            return {
                loading: true,
                pagination: { limit: 15, page: 1, total: 0, show_page: true },
                roleAttr: {
                    cgi: { insert: $url.roleSave, update: $url.roleUpdate, remove: $url.roleDelete, status: $url.roleUpdate },
                    btn: {},
                    url: '',
                    labelWidth: '100px',
                    defaultChecked: [],
                    authLists: []
                },
                syncVisible: false,
                reFrom: 'created',
                form: {}
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        mounted () {
            this.$nextTick(() => {
                this.roleAttr.btn = func.setBtnStatus(this.$route.path, this.$route.name, this.userInfo.auth)
            })
        },
        methods: {
            /**
             * todo:设置分页参数
             * @param pagination
             */
            setPagination: function (pagination) {
                this.pagination = pagination
                this.loading = pagination.page_loading
            },
            /**
             * todo:页面转换
             * @param page
             */
            currentPageChange: function (page) {
                this.pagination.page = page
            },
            /**
             * todo：角色添加
             */
            addRole: function () {
                this.syncVisible = true
                this.roleAttr.url = this.roleAttr.cgi.insert
                this.reFrom = 'created'
                this.form = { role_name: '', auth_ids: [], auth_url: [], status: 1, created_at: func.getTimestamp(), updated_at: func.getTimestamp() }
            },
            /**
             * todo:弹框关闭
             * @param action
             */
            closeDialogEvent: function (action) {
                this.syncVisible = false
                if (action === 'save') {
                    this.$refs['roleLists'].GetLists(this.pagination.page, this.pagination.limit)
                }
            },
            /**
             * todo：角色保存
             * @param item
             */
            updateRole: function (item) {
                this.syncVisible = true
                this.roleAttr.url = this.roleAttr.cgi.update
                this.roleAttr.defaultChecked = []
                this.reFrom = 'update'
                JSON.parse(item.auth_ids).forEach(item => {
                    this.roleAttr.defaultChecked.push(parseInt(item))
                })
                this.form = item
                this.form.auth_ids = this.roleAttr.defaultChecked
            }
        }
    }
</script>

<style scoped>

</style>
