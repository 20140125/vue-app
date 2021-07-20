<template>
    <el-skeleton :rows="5" animated :loading="loading">
        <el-timeline>
            <el-timeline-item v-for="(item, index) in timeLine" :key="index" :type="item.type" placement="top" :timestamp="item.timestamp">
                <el-card shadow="always">{{item.content}}</el-card>
            </el-timeline-item>
        </el-timeline>
    </el-skeleton>
</template>

<script>
export default {
    name: 'Timeline',
    data () {
        return {
            loading: true
        }
    },
    computed:{
        timeLine() {
            return this.$store.state.home.timeline
        }
    },
    mounted() {
        this.$nextTick(async () => {
            await this.$store.dispatch('home/getTimeLine').then(() => {
                this.loading = false
            })
        })
    }
}
</script>

<style scoped>

</style>
