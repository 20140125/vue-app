<template>
    <el-aside :width="asideStyle.width" :style="asideStyle">
        <el-menu unique-opened  background-color="#393d49" text-color="#fff" active-text-color="#ff69b4" :collapse="isCollapse">
            <el-submenu v-for="(menu,index) in menuLists" :key="index" :index="menu.id.toString()">
                <template #title>
                    <i class="el-icon-monitor"></i>
                    <span v-html="menu.name"></span>
                </template>
                <el-menu-item :index="child.id.toString()"  v-for="(child,index) in menu.__children" @click="goto(child)" :key="index">
                    <template #title>
                        <i class="el-icon-house"></i>
                        <span v-html="child.name"></span>
                    </template>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </el-aside>
</template>

<script>
export default {
    name: 'Menu',
    props: ['asideStyle', 'isCollapse'],
    computed: {
        menuLists() {
            return this.$store.state.home.menuLists
        }
    },
    mounted() {
        this.$nextTick(async () => {
            await this.$store.dispatch('home/getMenu')
        })
    },
    methods: {
        /**
         * todo:窗口切换
         * @param item
         * @return {Promise<void>}
         */
        async goto (item) {
            let params = { label: item.name, value: item.href }
            await this.$store.dispatch('home/addTabs', params).then(() => {
                this.$router.push({ path: params.value })
            })
        }
    }
}
</script>

<style scoped>

</style>
