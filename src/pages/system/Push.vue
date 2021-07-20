<template>
    <BaseLayout :loading="loading" :pagination="pagination">
        <template #header>
            <el-form-item>
                <el-button type="primary" plain size="mini" @click='addPush' icon="el-icon-plus">新增</el-button>
            </el-form-item>
        </template>
        <template #body>
            <PushLists :push-lists="pushLists" @runPusher="runPusher" ref="pushLists"></PushLists>
        </template>
        <template #dialog>
            <PushDialog :sync-visible="syncVisible" :re-form="reForm" :form="form" :user-lists="userLists" @getPushLists="getPushLists"></PushDialog>
        </template>
    </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import PushLists from '@/components/system/push/Lists'
import PushDialog from '@/components/system/push/Dialog'
import func from '@/utils/func'
export default {
    name: 'Push',
    components: { PushDialog, PushLists, BaseLayout },
    data() {
        return {
            loading: true,
            pagination: { page: 1, limit: 15, total: 0, show_page: true, refresh: false },
            syncVisible: false,
            reForm: 'created',
            form: {},
            userLists: []
        }
    },
    computed: {
        pushLists() {
            return this.$store.state.push.pushLists
        }
    },
    mounted() {
        this.$nextTick(async () => {
            await this.getPushLists(this.pagination)
        })
    },
    methods: {
        /**
         * todo:获取站内通知
         * @param pagination
         * @return {Promise<void>}
         */
        async getPushLists(pagination) {
            this.loading = true
            this.syncVisible = false
            await this.$store.dispatch('push/getPushLists', pagination).then(() => {
                this.loading = false
                this.pagination.total = this.$store.state.push.total
            })
        },
        /**
         * todo:页面转换
         * @param page
         */
        async currentPageChange(page) {
            this.pagination.page = page
            await this.getPushLists(this.pagination)
        },
        /**
         * todo:添加站内通知
         * @return {Promise<void>}
         */
        async addPush() {
            this.form = { username: '', uuid: '', title: '', info: '', status: 1, state: 'failed', created_at: func.setTime(Date.parse(new Date()), 'en') }
            this.reForm = 'created'
            this.syncVisible = true
            await this.$store.dispatch('users/getCacheUserLists', {}).then(() => {
                this.userLists = this.$store.state.users.cacheUsers
            })
        },
        /**
         * todo:执行站内通知
         * @param form
         * @return {Promise<void>}
         */
        async runPusher(form) {
            this.form = JSON.parse(JSON.stringify(form))
            this.reForm = 'updated'
            this.syncVisible = true
            await this.$store.dispatch('users/getCacheUserLists', {}).then(() => {
                this.userLists = this.$store.state.users.cacheUsers
            })
        },
    }
}
</script>

<style scoped>

</style>
