<template>
  <el-row :gutter="24">
    <el-col :span="chartsNum">
      <el-card :style="chartsStyle" shadow="hover">
        <Charts
          :legend-data="['授权用户', '站内通知', '系统日志']"
          :series-data="seriesData"
          :x-axis-data="xAxisData"
          chartsId="charts">
        </Charts>
      </el-card>
      <el-card shadow="hover" style="margin-top:35px">
        <el-calendar v-model="value" :first-day-of-week="7">
          <template #dateCell="{data}">
            <p :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split('-').slice(2).join('-') }} {{ data.isSelected ? ' ✔️' : '' }}
            </p>
          </template>
        </el-calendar>
      </el-card>
    </el-col>
    <el-col :span="24-chartsNum">
      <el-card shadow="hover">
        <Timeline></Timeline>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Charts from '@/components/index/Charts';
import Timeline from '@/components/index/Timeline';

export default {
  name: 'Index',
  components: { Timeline, Charts },
  data() {
    return {
      value: new Date(),
      chartsNum: 14,
      innerWidth: window.innerWidth,
      chartsStyle: { display: 'block' }
    };
  },
  computed: {
    xAxisData() {
      return this.$store.state.home.xAxisData;
    },
    seriesData() {
      return this.$store.state.home.seriesData;
    }
  }
};
</script>

<style scoped>
#charts {
  height: 460px;
}

.radio {
  margin-bottom: 30px;
}

.is-selected {
  color: red;
}
</style>
