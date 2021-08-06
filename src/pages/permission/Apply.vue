<template>
    <BaseLayout :loading="loading" :pagination="pagination">
        <template #header>
            <el-form-item>
                <el-button v-if="Permission.auth.indexOf(savePermission) > -1" type="primary" plain size="mini" @click='permissionApply' icon="el-icon-plus">权限申请</el-button>
            </el-form-item>
        </template>
        <template #body>
            <PermissionLists :permission-lists="permissionLists" @permissionUpdate="permissionUpdate" @getPermissionApply="getPermissionApply"></PermissionLists>
        </template>
        <template #dialog>
            <PermissionDialog
                :form="form"
                :syncVisible="syncVisible"
                :reForm="reForm"
                :permissionAttr="permissionAttr"
                @getPermissionApply="getPermissionApply"
                @getUserAuth="getUserAuth">
            </PermissionDialog>
        </template>
    </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import PermissionLists from '@/components/permission/apply/Lists'
import PermissionDialog from '@/components/permission/apply/Dialog'
import URLS from '@/api/urls'
export default {
    name: 'Apply',
    components: { PermissionDialog, PermissionLists, BaseLayout },
    data() {
        return {
            loading: true,
            pagination: { page: 1, limit: 15, total: 0, show_page: true, refresh: false },
            syncVisible: false,
            reForm: 'created',
            form: {},
            permissionAttr: { userLists: [], authList: [] },
            savePermission: URLS.permission.save
        }
    },
    computed: {
        permissionLists() {
            return this.$store.state.apply.permissionLists
        }
    },
    mounted() {
        this.$nextTick(async () => {
            await this.getPermissionApply(this.pagination)
        })
    },
    methods: {
        /**
         * todo:获取站内通知
         * @param pagination
         * @return {Promise<void>}
         */
        async getPermissionApply(pagination) {
            this.loading = true
            this.syncVisible = false
            await this.$store.dispatch('apply/getPermissionApply', pagination).then(() => {
                this.loading = false
                this.pagination.total = this.$store.state.apply.total
            })
        },
        /**
         * todo:页面转换
         * @param page
         */
        async currentPageChange(page) {
            this.pagination.page = page
            await this.getPermissionApply(this.pagination)
        },
        /**
         * todo:获取用户权限
         * @param user_id
         * @return {Promise<void>}
         */
        async getUserAuth(user_id) {
            await this.$store.dispatch('apply/getUserAuth', { user_id: user_id, refresh: true }).then(() => {
                this.permissionAttr = { userLists: this.$store.state.users.cacheUsers, authLists: this.$store.state.apply.authLists }
            })
        },
        /**
         * todo:申请权限
         * @return {Promise<void>}
         */
        async permissionApply() {
            this.syncVisible = true
            /* todo:获取用户列表 */
            await this.$store.dispatch('users/getCacheUserLists', {}).then(() => {
                this.permissionAttr = { userLists: this.$store.state.users.cacheUsers, authList: []  }
                this.form = { username: '', user_id: '', href: '', expires: '', desc: '' }
                this.reForm = 'created'
            })
        },
        /**
         * todo:申请权限续期
         * @param form
         * @return {Promise<void>}
         */
        async permissionUpdate(form) {
            this.$store.dispatch('UPDATE_ACTIONS', { url: URLS.permission.update, model: {  id: form.id, status: form.status  } }).then(() => {
                this.$message.success('权限续期成功')
                this.getPermissionApply({ page: 1, limit: 15, show_page: true, refresh: true })
            })
        }
    }
}
</script>

<style scoped>

</style>
