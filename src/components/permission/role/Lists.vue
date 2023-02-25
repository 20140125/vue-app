<template>
  <el-table :data="roleLists">
    <el-table-column label="#ID" prop="id"></el-table-column>
    <el-table-column label="角色名称" prop="role_name"></el-table-column>
    <el-table-column label="角色状态">
      <template #default="scope">
        <StatusRadio :statusModel="scope.row" :url="URL"></StatusRadio>
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
          v-if="Permission.auth.indexOf(URL) > -1"
          icon="el-icon-edit"
          plain
          size="mini"
          type="primary"
          @click="$emit('updateRole', scope.row)">
          编辑
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="js">
import StatusRadio from '@/components/common/StatusRadio';
import URLS from '@/api/urls';

export default {
  name: 'RoleLists',
  components: { StatusRadio },
  props: ['roleLists'],
  data() {
    return {
      URL: URLS.role.update
    };
  }
};
</script>

<style scoped>

</style>
