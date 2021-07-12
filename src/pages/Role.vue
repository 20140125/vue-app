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
            <RoleDialog
                :sync-visible="syncVisible"
                :form="form"
                :re-form="reForm"
                :auth-attr="authAttr"
                @getRoleLists="getRoleLists">
            </RoleDialog>
        </template>
    </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import RoleLists from '@/components/role/Lists'
import RoleDialog from '@/components/role/Dialog'
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
        async getAuthLists() {
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
            await this.getAuthLists().then(() => {
                this.authAttr = { authLists: this.$store.state.role.authLists, defaultChecked: [] }
            })
        },
        /**
         * todo:更新角色
         * @param form
         * @return {Promise<void>}
         */
        async updateRoles(form) {
            this.form = form
            this.reForm = 'updated'
            this.syncVisible = true
            await this.getAuthLists().then(() => {
                this.authAttr = { authLists: this.$store.state.role.authLists, defaultChecked: JSON.parse(form.auth_ids) }
            })
        },
    }
}
</script>

<style scoped>

</style>
