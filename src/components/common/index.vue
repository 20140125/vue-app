<template>
    <el-row :gutter="24">
        <el-col :span="chartsNum">
            <div id="charts" :style="chartsStyle"/>
            <el-calendar :style="innerWidth>=1920 ? 'margin-top:70px' : ''" v-model="value" :first-day-of-week="7">
                <template slot="dateCell" slot-scope="{date, data}">
                    <p :class="data.isSelected ? 'is-selected' : ''">
                       {{data.day.split('-').slice(2).join('-') }} {{ data.isSelected ? ' ✔️' : ''}}
                    </p>
                </template>
            </el-calendar>
        </el-col>
        <el-col :span="timestampNum">
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
    import apiLists from '../../api/api'
    import {mapMutations, mapGetters} from 'vuex'
    export default {
        name: "index",
        data(){
            return {
                access_token:'',
                showTimestamp:'',
                charts:{},
                xAxisData:[],
                seriesData:{
                    log:[],
                    notice:[],
                    oauth:[],
                },
                innerWidth:window.innerWidth,
                reverse: false,
                activities:'',
                value:new Date(),
                chartsNum:14,
                timestampNum:10,
                chartsStyle:'',
            }
        },
        computed:{
            ...mapGetters(['userInfo','tabs']),
        },
        mounted() {
            this.$nextTick(function () {
                this.totalCharts();
                if (this.access_token){
                    this.setToken(this.access_token);
                    //删除tabs，避免token暴露在连接中。
                    this.defaultTabs([{label:'欢迎页',name:'/admin/index'}]);
                    this.$router.push({path:'/admin/index'});
                }
                //图表初始化
                this.echarts = echarts.init(document.getElementById('charts'));
                //用户通知
                this.userInfo.socketServer.on('charts',(response)=>{
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
                            text: ''
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
                //窗口适应
                if (this.innerWidth>=1920) {
                    this.chartsNum = 14;
                    this.timestampNum = 10
                    this.chartsStyle = {display:'block'};
                } else {
                    this.chartsNum = 24;
                    this.timestampNum = 24
                    this.chartsStyle = {display:'none'};
                }
            })
        },
        methods:{
            ...mapMutations(['setToken','defaultTabs','setActiveAuthName']),
            /**
             * todo:数据总量
             */
            totalCharts:function () {
                apiLists.GetCountData({}).then(response=>{
                    this.activities = response.data.item.timeline.data;
                })
            },
        },
        created(){
            if (this.$route.params.access_token){
                this.access_token = this.$route.params.access_token;
            }
        },
    }
</script>

<style scoped>
#charts {
    height: 400px;
}
.radio{
    margin-bottom: 30px;
}
.is-selected {
    color: red;
}
</style>
