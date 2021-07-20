<template>
    <BaseLayout :loading="loading" :pagination="pagination">
        <template #header></template>
        <template #body>
            <SystemLogLists :system-log-lists="systemLogLists"></SystemLogLists>
        </template>
    </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import SystemLogLists from '@/components/system/log/Lists'
export default {
    name: 'SystemLog',
    components: { SystemLogLists, BaseLayout },
    computed: {
        systemLogLists() {
            return this.$store.state.log.systemLogLists
        }
    },
    data() {
        return {
            loading: true,
            pagination: { page: 1, limit: 15, total: 0, show_page: true, refresh: false },
            syncVisible: false
        }
    },
    mounted() {
        this.$nextTick(async () =>{
            await this.getSystemLogLists(this.pagination)
        })
    },
    methods: {
        async getSystemLogLists(pagination) {
            this.syncVisible = false
            this.loading = true
            await this.$store.dispatch('log/getSystemLogLists', pagination).then(() => {
                this.pagination.total = this.$store.state.log.total
                this.loading = false
            })
        },
        /**
         * todo:页面转换
         * @param page
         */
        async currentPageChange(page) {
            this.pagination.page = page
            await this.getSystemLogLists(this.pagination)
        }
    }
}
</script>

<style scoped>

</style>
