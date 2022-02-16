<template>
  <el-table :data="configLists" row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
    <el-table-column label="#ID" prop="id"></el-table-column>
    <el-table-column label="配置名称" prop="name"></el-table-column>
    <el-table-column label="配置状态">
      <template #default="scope">
        <StatusRadio
          :url="URL"
          :status-model="scope.row"
          v-if="scope.row.id < 1000 && Permission.auth.indexOf(URL) > -1">
        </StatusRadio>
        <el-button
          v-else
          :icon="['el-icon-check', 'el-icon-close'][scope.row.status - 1]"
          circle
          plain
          :type="['primary', 'danger'][scope.row.status - 1]"
          size="medium">
        </el-button>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" prop="created_at"></el-table-column>
    <el-table-column label="更新时间" prop="updated_at"></el-table-column>
    <el-table-column align="right">
      <template #header>
        <el-input placeholder="请输入关键词搜索" suffix-icon="el-icon-search"></el-input>
      </template>
      <template #default="scope">
        <el-button
          v-if="scope.row.id < 100 && Permission.auth.indexOf(URL) > -1"
          type="primary"
          icon="el-icon-edit"
          plain
          size="mini"
          @click="$emit('updateConfig', scope.row)">
          编辑
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import StatusRadio from '../../common/StatusRadio';
import URLS from '../../../api/urls';

export default {
  name: 'SystemConfigLists',
  components: { StatusRadio },
  props: ['configLists'],
  data() {
    return {
      URL: URLS.config.update
    };
  }
};
</script>

<style scoped>

</style>
