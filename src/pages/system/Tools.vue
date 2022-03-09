<template>
  <BaseLayout>
    <template #body>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="获取地址" name="getAddress">
          <GetAddress></GetAddress>
        </el-tab-pane>
        <el-tab-pane label="获取天气" name="getAreaWeather">
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
