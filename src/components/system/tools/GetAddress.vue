<template>
  <div id="address">
    <el-form label-position="left" label-width="100px">
      <el-form-item label="IP地址：">
        <el-input v-model="ip_address" :placeholder="`请输入IP（仅支持国内）地址(${ip_address})`">
          <template #append>
            <el-button icon="el-icon-search" @click="getAddress">搜索</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="地图位置：">
        <AMap :center="center"></AMap>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="js">
import AMap from '@/components/system/tools/AMap';
import { tools } from '@/api/urls';

export default {
  name: 'GetAddress',
  components: { AMap },
  data() {
    return {
      ip_address: this.Permission.ip_address,
      center: [114.058975, 22.543754]
    };
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getAddress();
    });
  },
  methods: {
    async getAddress() {
      await this.$store.dispatch('UPDATE_ACTIONS', {
        url: tools.getAddress,
        model: { ip_address: this.ip_address }
      }).then((response) => {
        let result = (((response || {}).data || {}).item || {}).lists || {
          rectangle: []
        };
        if (result.rectangle.length === 0) {
          this.$message.error('请输入国内正确的IP地址');
          return false;
        }
        let rectangle = ((result || {}).rectangle || []).split(';');
        let longitude = (parseFloat(rectangle[0].split(',')[0]) + parseFloat(rectangle[1].split(',')[0])) / 2;
        let latitude = (parseFloat(rectangle[0].split(',')[1]) + parseFloat(rectangle[1].split(',')[1])) / 2;
        this.center = [longitude, latitude];
      });
    }
  }
};
</script>

<style scoped>

</style>
