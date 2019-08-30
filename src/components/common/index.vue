<template>
    <div id="charts" style="width: 100%;height: 600px"></div>
</template>

<script>
    import echarts from 'echarts'
    import { mapMutations,mapGetters } from 'vuex'
    export default {
        name: "index",
        data(){
            return {
                access_token:'',
                charts:{},
                xAxisData:[],
                seriesData:{
                    log:[],
                    notice:[],
                },
            }
        },
        computed:{
            ...mapGetters(['socketServer']),
        },
        methods:{
            ...mapMutations(['setToken']),
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
                this.echarts = echarts.init(document.getElementById('charts'));
                //用户通知
                this.socketServer.on('charts',(response)=>{
                    //日期
                    this.xAxisData = response.day;
                    //系统日志总量
                    this.seriesData.log = response.total.log;
                    //站内通知总量
                    this.seriesData.notice = response.total.push;
                    this.echarts.setOption({
                        title: {
                            text: '数据统计'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['系统日志','站内通知','视频广告','直接访问','搜索引擎']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: true,
                            data: this.xAxisData
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name:'系统日志',
                                type:'line',
                                stack: '总量',
                                data:this.seriesData.log
                            },
                            {
                                name:'站内通知',
                                type:'bar',
                                stack: '总量',
                                data:this.seriesData.notice
                            }
                        ]
                    });
                });
            })
        }
    }
</script>

<style scoped>

</style>
