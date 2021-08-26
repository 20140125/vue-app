<template>
    <el-tabs type="border-card" closable lazy v-model="tabModel.value" @tab-click="goto" @tab-remove="removeTabs">
        <el-tab-pane v-for="item in authTabs" :tab="item" :label="item.label" :key="item.value" :name="item.value"></el-tab-pane>
        <el-card shadow="always">
            <router-view></router-view>
        </el-card>
    </el-tabs>
</template>

<script>
export default {
    name: 'Content',
    computed: {
        authTabs() {
            return this.$store.state.home.tabs;
        },
        tabModel() {
            return {...this.$store.state.home.tabModel};
        }
    },
    mounted() {
        this.$nextTick(async () => {
            await this.$store.dispatch('home/addTabs', {label: this.$route.meta.title, value: this.$route.path});
        });
    },
    methods: {
        /**
         * todo:页面跳转
         * @return {Promise<void>}
         */
        async goto() {
            await this.$router.push({path: this.tabModel.value});
        },
        /**
         * todo:删除标签
         * @return {Promise<void>}
         */
        async removeTabs() {
            await this.authTabs.forEach((tab, index) => {
                if (tab.name === this.tabModel.name) {
                    let nextTab = this.authTabs[index + 1] || this.authTabs[index - 1];
                    if (nextTab) {
                        this.$store.dispatch('home/deleteTabs', {index: index, nextTab: nextTab}).then(() => {
                            this.$router.push({path: nextTab.value});
                        });
                    }
                }
            });
        }
    }
};
</script>

<style scoped>

</style>
