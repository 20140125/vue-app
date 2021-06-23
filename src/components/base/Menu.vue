<template>
    <el-aside :width="asideStyle.width" :style="asideStyle">
        <el-menu unique-opened  background-color="#393d49" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse">
            <el-submenu v-for="(menu,index) in menuLists" :key="index" :index="menu.id.toString()">
                <template #title>
                    <i class="el-icon-menu"></i>
                    <span v-html="menu.name"></span>
                </template>
                <el-menu-item :index="child.id.toString()"  v-for="(child,index) in menu.__children" @click="goto(child)" :key="index">
                    <template #title>
                        <i class="el-icon-s-home"></i>
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
    data () {
        return {
            menuLists: this.$store.state.menuLists
        }
    },
    mounted() {
        this.$nextTick(async () => {
            await this.$store.dispatch('home/getMenu')
            this.menuLists = this.$store.state.menuLists
        })
    },
    methods: {
        async goto (item) {
            let params = { label: item.name, value: item.href }
            await this.$store.dispatch('home/addTabs', params)
            await this.$router.push({ path: params.value })
        }
    }
}
</script>

<style scoped>

</style>
