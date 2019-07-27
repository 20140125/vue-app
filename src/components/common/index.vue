<template>
    <charts :seriesData="seriesData" :legendData="legendData" :legendSelected="legendSelected" :xAxisData="xAxisData" id="charts" :chartsTitle="chartsTitle"></charts>
</template>

<script>
    import charts from './Charts'
    import { mapMutations } from 'vuex'
    export default {
        name: "index",
        data(){
            return {
                seriesData: [
                    {
                        name:'日志管理',
                        type:'line',
                        stack: '总量',
                        data:[120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name:'接口管理',
                        type:'line',
                        stack: '总量',
                        data:[220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name:'权限管理',
                        type:'line',
                        stack: '总量',
                        data:[150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name:'角色管理',
                        type:'line',
                        stack: '总量',
                        data:[320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name:'管理员管理',
                        type:'line',
                        stack: '总量',
                        data:[820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ],
                legendData:['日志管理','接口管理','权限管理','角色管理','管理员管理'],
                legendSelected:{ 'Log':true,'Api':false,'Auth':false,'Role':false,'User':false},
                xAxisData:['周一','周二','周三','周四','周五','周六','周日'],
                chartsTitle:'数据分析',
                access_token:''
            }
        },
        components:{
            charts:charts,
        },
        methods:{
            ...mapMutations(['setToken'])
        },
        created(){
            if (this.$route.params.access_token){
                this.access_token = this.$route.params.access_token;
            }
        },
        mounted() {
            this.$nextTick(function () {
                if (this.access_token){
                    this.setToken(this.access_token);
                }
            })
        }
    }
</script>

<style scoped>

</style>
