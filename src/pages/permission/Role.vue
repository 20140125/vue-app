<template>
    <BaseLayout :loading="loading" :pagination="pagination">
        <template #header>
            <el-form-item>
                <el-button type="primary" plain size="mini" @click='addRoles' icon="el-icon-plus">新增</el-button>
            </el-form-item>
        </template>
        <template #body>
            <RoleLists :role-lists="roleLists" @updateRole="updateRoles"></RoleLists>
        </template>
        <template #dialog>
            <RoleDialog :sync-visible="syncVisible" :form="form" :reForm="reForm" :authAttr="authAttr" @getRoleLists="getRoleLists"></RoleDialog>
        </template>
    </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import RoleLists from '@/components/permission/role/Lists'
import RoleDialog from '@/components/permission/role/Dialog'
export default {
    name: 'Role',
    components: { RoleDialog, RoleLists, BaseLayout },
    data () {
        return {
            loading: true,
            pagination: { page: 1, limit: 15, total: 0, show_page: true, refresh: false },
            syncVisible: false,
            reForm: 'created',
            form: {},
            authAttr: { authLists: [], defaultChecked: [] }
        }
    },
    computed: {
        roleLists() {
            return this.$store.state.role.roleLists
        }
    },
    mounted() {
        this.$nextTick(async () => {
            await this.getRoleLists(this.pagination)
        })
    },
    methods: {
        /**
         * todo:获取角色列表
         * @param pagination
         * @return {Promise<void>}
         */
        async getRoleLists(pagination) {
            this.syncVisible = false
            this.loading = true
            await this.$store.dispatch('role/getRoleLists', pagination).then(() => {
                this.pagination.total = this.$store.state.role.total
                this.loading = false
            })
        },
        /**
         * todo:页面转换
         * @param page
         */
        async currentPageChange(page) {
            this.pagination.page = page
            await this.getRoleLists(this.pagination)
        },
        /**
         * todo:获取角色权限
         * @return {Promise<void>}
         */
        async getRoleAuth() {
            return await this.$store.dispatch('role/getRoleAuth', {})
        },
        /**
         * todo:添加角色
         * @return {Promise<void>}
         */
        async addRoles() {
            this.reForm = 'created'
            this.form = { role_name: '', auth_ids: [], status: 1 }
            this.syncVisible = true
            await this.getRoleAuth().then(() => {
                this.authAttr = { authLists: this.$store.state.role.authLists, defaultChecked: [] }
            })
        },
        /**
         * todo:更新角色
         * @param form
         * @return {Promise<void>}
         */
        async updateRoles(form) {
            this.form = { ...form }
            this.reForm = 'updated'
            this.syncVisible = true
            await this.getRoleAuth().then(() => {
                this.authAttr = { authLists: this.$store.state.role.authLists, defaultChecked: form.auth_ids ? JSON.parse(form.auth_ids) : [] }
                this.form.auth_ids = this.authAttr.defaultChecked
            })
        },
    }
}
</script>

<style scoped>

</style>
