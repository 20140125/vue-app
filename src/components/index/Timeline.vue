<template>
    <el-timeline>
        <el-timeline-item v-for="(item, index) in timeLine" :key="index" :type="item.type" placement="top" :timestamp="item.timestamp">
            <el-card shadow="always">{{item.content}}</el-card>
        </el-timeline-item>
    </el-timeline>
</template>

<script>
export default {
    name: 'Timeline',
    data () {
        return {}
    },
    computed:{
        timeLine() {
            return this.$store.state.home.timeline
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$store.dispatch('home/getTimeLine')
        })
    }
}
</script>

<style scoped>

</style>
