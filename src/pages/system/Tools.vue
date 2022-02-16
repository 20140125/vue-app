<template>
  <BaseLayout>
    <template #body>
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane name="getAddress" label="获取地址">
          <GetAddress></GetAddress>
        </el-tab-pane>
        <el-tab-pane name="getAreaWeather" label="获取天气">
          <GetWeather></GetWeather>
        </el-tab-pane>
      </el-tabs>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../../components/BaseLayout';
import GetAddress from '../../components/system/tools/GetAddress';
import GetWeather from '../../components/system/tools/GetWeather';

export default {
  name: 'SystemTools',
  components: { GetWeather, GetAddress, BaseLayout },
  data() {
    return {
      activeName: 'getAddress'
    };
  }
};
</script>

<style scoped>

</style>
