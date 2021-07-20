<template>
    <el-skeleton animated :loading="loading">
        <template #template>
            <el-skeleton-item v-for="item in 5" :key="item" :style="`width: ${(item + 1) * Math.random() * 100 | 0}%`" variant="text" class="template"></el-skeleton-item>
        </template>
        <template #default>
            <el-menu unique-opened background-color="#393d49" text-color="#fff" active-text-color="#ff69b4" :collapse="isCollapse">
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
        </template>
    </el-skeleton>
</template>

<script>
export default {
    name: 'Menu',
    props: ['isCollapse'],
    computed: {
        menuLists() {
            return this.$store.state.home.menuLists
        }
    },
    data () {
        return {
            loading: true
        }
    },
    mounted() {
        this.$nextTick(async () => {
            await this.$store.dispatch('home/getMenu').then(() => {
                this.loading = false
            })
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

<style lang="less">
.template {
    background: #333333 !important;
}
</style>
