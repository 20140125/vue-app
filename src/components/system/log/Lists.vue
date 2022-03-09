<template>
  <el-table :data="systemLogLists" :default-expand-all="false">
    <el-table-column type="expand">
      <template #default="scope">
        <JsonView :items="JSON.parse(JSON.stringify(scope.row.log))"></JsonView>
      </template>
    </el-table-column>
    <el-table-column label="#ID" prop="id" width="100px"></el-table-column>
    <el-table-column label="用户名" prop="username" width="150px"></el-table-column>
    <el-table-column label="接口地址" prop="url"></el-table-column>
    <el-table-column label="IP地址">
      <template #default="scope">
        <span v-html="`${scope.row.local || ''}【${scope.row.ip_address}】`"></span>
      </template>
    </el-table-column>
    <el-table-column label="添加时间" prop="created_at" width="200px"></el-table-column>
    <el-table-column align="right" label="操作" width="150px">
      <template #default="scope">
        <el-button icon="el-icon-delete" plain size="mini" type="danger" @click="$emit('removeLog', scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import JsonView from '../../common/JsonView';

export default {
  name: 'SystemLogLists',
  components: { JsonView },
  props: ['systemLogLists'],
  data() {
    return {};
  }
};
</script>

<style scoped>

</style>
