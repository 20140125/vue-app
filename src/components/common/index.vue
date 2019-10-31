<template>
    <el-row :gutter="24">
        <el-col :span="12">
            <div id="charts" style="height: 500px"></div>
            <el-calendar v-model="value">
                <template  slot="dateCell" slot-scope="{date, data}">
                    <p :class="data.isSelected ? 'is-selected' : ''">
                       {{data.day.split('-').slice(2).join('-') }} {{ data.isSelected ? ' ✔️' : ''}}
                    </p>
                </template>
            </el-calendar>
        </el-col>
        <el-col :span="12">
            <div class="block">
                <div class="radio">
                    <el-radio-group v-model="reverse">
                        <el-radio :label="true">倒序</el-radio>
                        <el-radio :label="false">正序</el-radio>
                    </el-radio-group>
                </div>

                <el-timeline :reverse="reverse">
                    <el-timeline-item
                        v-for="(activity, index) in activities"
                        :key="index"
                        :type="activity.type"
                        placement="top"
                        :color="activity.color"
                        :timestamp="activity.timestamp">
                        <el-card>{{activity.content}}</el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </el-col>
    </el-row>
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
                    oauth:[],
                },
                reverse: false,
                activities:require('../../assets/timeline.json'),
                value:new Date()
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
                //图表初始化
                this.echarts = echarts.init(document.getElementById('charts'));
                //用户通知
                this.socketServer.on('charts',(response)=>{
                    //日期
                    this.xAxisData = response.day;
                    //系统日志总量
                    this.seriesData.log = response.total.log;
                    //站内通知总量
                    this.seriesData.notice = response.total.push;
                    //授权用户
                    this.seriesData.oauth = response.total.oauth;
                    this.echarts.setOption({
                        title: {
                            text: '数据统计'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#688583'
                                }
                            }
                        },
                        legend: {
                            data:['授权用户','站内通知','系统日志']
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
                            boundaryGap: false,
                            data: this.xAxisData
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name:'授权用户',
                                type:'line',
                                stack: '总量',
                                areaStyle: {normal: {}},
                                data:this.seriesData.oauth
                            },
                            {
                                name:'站内通知',
                                type:'line',
                                stack: '总量',
                                areaStyle: {normal: {}},
                                data:this.seriesData.notice
                            },
                            {
                                name:'系统日志',
                                type:'line',
                                stack: '总量',
                                areaStyle: {normal: {}},
                                data:this.seriesData.log
                            }
                        ]
                    });
                });
            })
        }
    }
</script>

<style scoped>
    .radio{
        margin-bottom: 30px;
    }
    .is-selected {
        color: red;
    }
</style>
