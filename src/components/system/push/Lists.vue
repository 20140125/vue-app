<template>
  <el-table :data="pushLists">
    <el-table-column align="center" label="#ID" prop="id" width="100"></el-table-column>
    <el-table-column
      :show-overflow-tooltip="true"
      align="center"
      label="接收者"
      prop="username"
      width="150">
    </el-table-column>
    <el-table-column
      :show-overflow-tooltip="true"
      align="center"
      label="UUID"
      prop="uuid"
      width="200">
    </el-table-column>
    <el-table-column align="center" label="推送标题" width="200">
      <template #default="scope">
        <el-tag effect="plain" type="success">{{ scope.row.title }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column :show-overflow-tooltip="true" align="center" label="推送内容" prop="info"></el-table-column>
    <el-table-column align="center" label="实时推送" width="100">
      <template #default="scope">
        <el-tag :type="scope.row.status === 1 ? 'success' : 'info'" effect="plain">
          {{ scope.row.status === 1 ? '是' : '否' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" label="推送状态" width="150">
      <template #default="scope">
        <el-tag :type="typeAttr[scope.row.state]" effect="plain">{{ scope.row.state.toUpperCase() }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" label="推送时间" prop="created_at" width="200px"></el-table-column>
    <el-table-column align="center" label="操作" width="150" fixed="right">
      <template #default="scope">
        <el-button
          v-if="scope.row.state !== 'successfully' && Permission.auth.indexOf(URL) > -1"
          icon="el-icon-edit"
          plain
          size="mini"
          type="primary"
          @click="$emit('runPusher', scope.row)">
          执行
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="js">

import { push } from '@/api/urls';

export default {
  name: 'PushLists',
  components: {},
  props: ['pushLists'],
  data() {
    return {
      URL: push.update,
      typeAttr: { 'failed': 'danger', 'successfully': 'success', 'offline': 'warning' }
    };
  }
};
</script>

<style scoped>

</style>
