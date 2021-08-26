<template>
    <BaseLayout :loading="loading" :pagination="pagination">
        <template #header></template>
        <template #body>
            <UsersLists :users-lists="usersLists" @updatedUsers="updatedUsers" ref="usersLists"></UsersLists>
        </template>
        <template #dialog>
            <UsersDialog :sync-visible="syncVisible" :users-attr="usersAttr" :re-form="reForm" :form="form" @getUsersLists="getUsersLists"></UsersDialog>
        </template>
    </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout';
import UsersLists from '@/components/users/user/Lists';
import UsersDialog from '@/components/users/user/Dialog';

export default {
    name: 'Users',
    components: {UsersDialog, UsersLists, BaseLayout},
    data() {
        return {
            loading: true,
            pagination: {page: 1, limit: 15, total: 0, show_page: true, refresh: false},
            syncVisible: false,
            reForm: 'created',
            form: {},
            usersAttr: {}
        };
    },
    computed: {
        usersLists() {
            return this.$store.state.users.usersLists;
        }
    },
    mounted() {
        this.$nextTick(async () => {
            await this.getUsersLists(this.pagination);
        });
    },
    methods: {
        /**
         * todo:获取管理员列表
         * @param pagination
         * @return {Promise<void>}
         */
        async getUsersLists(pagination) {
            this.loading = true;
            this.syncVisible = false;
            await this.$store.dispatch('users/getUsersLists', pagination).then(() => {
                this.loading = false;
                this.pagination.total = this.$store.state.users.total;
            });
        },
        /**
         * todo:页面转换
         * @param page
         */
        async currentPageChange(page) {
            this.pagination.page = page;
            await this.getUsersLists(this.pagination);
        },
        /**
         * todo:修改管理员
         * @param form
         * @return {Promise<void>}
         */
        async updatedUsers(form) {
            this.$store.dispatch('role/getRoleLists', {page: 1, limit: 20, refresh: false}).then(() => {
                this.form = JSON.parse(JSON.stringify(form));
                this.reForm = 'updated';
                this.syncVisible = true;
                this.usersAttr = {roleLists: this.$store.state.role.roleLists};
            });
        }
    }
};
</script>

<style scoped>

</style>
