<template>
    <el-tabs type="border-card" closable lazy v-model="tabModel.value" @tab-click="goto" @tab-remove="removeTabs">
        <el-tab-pane v-for="item in tabs" :tab="item" :label="item.label" :key="item.value" :name="item.value"></el-tab-pane>
        <el-card shadow="always">
            <router-view></router-view>
        </el-card>
    </el-tabs>
</template>

<script>
export default {
    name: 'Content',
    computed: {
        tabs() {
            return JSON.parse(JSON.stringify(this.$store.getters.tabs))
        },
        tabModel() {
            return {...this.$store.getters.tabModel}
        }
    },
    methods: {
        /**
         * todo:页面跳转
         * @return {Promise<void>}
         */
        async goto() {
            await this.$router.push({ path: this.tabModel.value })
        },
        /**
         * todo:删除标签
         * @return {Promise<void>}
         */
        async removeTabs() {
            this.tabs.forEach((tab, index) => {
                if (tab.name === this.tabModel.name) {
                    let nextTab = this.tabs[index + 1] || this.tabs[index - 1]
                    if (nextTab) {
                        this.$store.dispatch('home/deleteTabs', index)
                        this.$router.push({ path: nextTab.value })
                    }
                }
            })
        }
    }
}
</script>

<style scoped>

</style>
