<template>
    <BaseLayout :loading="loading" :pagination="pagination">
        <template #header>
            <el-form-item>
                <el-button v-if="Permission.auth.indexOf(savePermission) > -1" type="primary" plain size="mini" @click='addConfig' icon="el-icon-plus">新增</el-button>
            </el-form-item>
        </template>
        <template #body>
            <SystemConfigLists :config-lists="configLists" @updateConfig="updateConfig"></SystemConfigLists>
        </template>
        <template #dialog>
            <SystemConfigDialog :sync-visible="syncVisible" :re-form="reForm" :form="form" @getConfigLists="getConfigLists"></SystemConfigDialog>
        </template>
    </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout';
import SystemConfigLists from '@/components/system/config/Lists';
import SystemConfigDialog from '@/components/system/config/Dialog';
import URLS from '@/api/urls';

export default {
    name: 'SystemConfig',
    components: {SystemConfigDialog, SystemConfigLists, BaseLayout},
    computed: {
        configLists() {
            return this.$store.state.config.configLists;
        }
    },
    data() {
        return {
            loading: true,
            pagination: {page: 1, limit: 15, total: 0, show_page: true, refresh: false},
            syncVisible: false,
            reForm: 'created',
            form: {},
            savePermission: URLS.config.save
        };
    },
    mounted() {
        this.$nextTick(async () => {
            await this.getConfigLists(this.pagination);
        });
    },
    methods: {
        /**
         * todo:获取列表
         * @param pagination
         */
        async getConfigLists(pagination) {
            this.syncVisible = false;
            this.loading = true;
            await this.$store.dispatch('config/getConfigLists', pagination).then(() => {
                this.pagination.total = this.$store.state.config.total;
                this.loading = false;
            });
        },
        /**
         * todo:页面转换
         * @param page
         */
        async currentPageChange(page) {
            this.pagination.page = page;
            await this.getConfigLists(this.pagination);
        },
        /**
         * todo：新增系统配置
         */
        addConfig() {
            this.syncVisible = true;
            this.form = {name: '', children: [{name: '', value: '', status: 1, pid: this.pagination.total + 1, id: (this.pagination.total + 1) * 1000}], status: 1};
            this.reForm = 'created';
        },
        /**
         * todo:修改系统配置
         * @param form
         */
        updateConfig(form) {
            this.syncVisible = true;
            this.form = JSON.parse(JSON.stringify(form));
            this.reForm = 'updated';
        }
    }
};
</script>

<style scoped>

</style>
