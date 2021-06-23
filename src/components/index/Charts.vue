<template>
    <div :id="chartsId" style="height: 460px"></div>
</template>

<script>
import echarts from 'echarts'
export default {
    props:['xAxisData','seriesData','legendData', 'chartsId'],
    name: "Charts",
    data() {
        return {
            charts:''
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.getCharts(this.chartsId)
        });
        window.addEventListener('resize',() => {
            this.charts.resize()
        })
    },
    watch: {
        seriesData() {
            this.$nextTick(function() {
                this.getCharts(this.chartsId)
            })
            window.addEventListener('resize',() => {
                this.charts.resize()
            })
        }
    },
    methods:{
        getCharts:function (chartsId) {
            this.charts = echarts.init(document.getElementById(chartsId))
            this.charts.setOption({
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#ff69b4'
                        }
                    }
                },
                legend: {
                    data: this.legendData
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
                        name: this.legendData[0],
                        type: 'line',
                        stack: '总量',
                        areaStyle: { normal: {} },
                        data: this.seriesData.oauth
                    },
                    {
                        name: this.legendData[1],
                        type: 'line',
                        stack: '总量',
                        areaStyle: { normal: {} },
                        data: this.seriesData.notice
                    },
                    {
                        name: this.legendData[2],
                        type: 'line',
                        stack: '总量',
                        areaStyle: { normal: {} },
                        data: this.seriesData.log
                    }
                ]
            })
        }
    }
}
</script>

<style scoped>

</style>
