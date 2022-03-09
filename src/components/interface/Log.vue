<template>
  <div id="logs">
    <el-table :data="lists">
      <el-table-column type="expand">
        <template #default="scope">
          <JsonView v-if="scope.row.source === 2" :items="scope.row.json"></JsonView>
          <MarkDown v-if="scope.row.source === 1" :markdown="scope.row.json" mode="preview"></MarkDown>
        </template>
      </el-table-column>
      <el-table-column label="执行人" prop="username"></el-table-column>
      <el-table-column align="center" label="操作时间" prop="updated_at"></el-table-column>
      <el-table-column align="center" label="描述" prop="desc"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import JsonView from '@/components/common/JsonView';
import MarkDown from '@/components/common/MarkDown';

export default {
  name: 'InterfaceLog',
  components: { MarkDown, JsonView },
  props: ['lists']
};
</script>

<style lang="less">
#logs {
  margin: 20px 0;
}
</style>
