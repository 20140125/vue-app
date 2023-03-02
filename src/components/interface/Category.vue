<template>
  <el-table :data="categoryTree" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" row-key="id">
    <el-table-column align="left" label="接口名称" prop="name"></el-table-column>
    <el-table-column align="right" label="操作">
      <template #default="scope">
        <el-button
          v-if="scope.row.level >= 2 && Permission.auth.indexOf(get) > -1"
          icon="el-icon-search"
          plain
          size="mini"
          type="primary"
          @click="$emit('getDetails', scope.row, 'json')">
          JSON
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(get) > -1"
          icon="el-icon-search"
          plain
          size="mini"
          type="primary"
          @click="$emit('getDetails', scope.row, 'markdown')">
          Markdown
        </el-button>
        <el-button
          v-if="scope.row.level <= 2 && Permission.auth.indexOf(interfaceCategory.save) > -1"
          icon="el-icon-plus"
          plain
          size="mini"
          type="primary"
          @click="$emit('addCategory', scope.row)">
          新增
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(interfaceCategory.update) > -1"
          icon="el-icon-edit"
          plain
          size="mini"
          type="primary"
          @click="$emit('updateCategory', scope.row)">
          修改
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(interfaceCategory.delete) > -1"
          icon="el-icon-delete"
          plain
          size="mini"
          type="danger"
          @click="$emit('removeCategory', scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { category, api } from '@/api/urls';

export default {
  name: 'CategoryLists',
  props: ['categoryTree'],
  data() {
    return {
      get: api.get,
      interfaceCategory: category
    };
  }
};
</script>

<style scoped>

</style>
