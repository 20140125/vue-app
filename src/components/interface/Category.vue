<template>
  <el-table :data="categoryTree" row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
    <el-table-column label="接口名称" prop="name" align="left"></el-table-column>
    <el-table-column align="right" label="操作">
      <template #default="scope">
        <el-button type="primary" plain icon="el-icon-search" size="mini" v-if="scope.row.level >= 2 && Permission.auth.indexOf(get) > -1" @click="$emit('getDetails', scope.row, 'json')">JSON</el-button>
        <el-button type="primary" plain icon="el-icon-search" size="mini" v-if="Permission.auth.indexOf(get) > -1" @click="$emit('getDetails', scope.row, 'markdown')">Markdown</el-button>
        <el-button type="primary" plain icon="el-icon-plus" size="mini" v-if="scope.row.level <= 2 && Permission.auth.indexOf(interfaceCategory.save) > -1" @click="$emit('addCategory', scope.row)">新增</el-button>
        <el-button type="primary" plain icon="el-icon-edit" size="mini" v-if="Permission.auth.indexOf(interfaceCategory.update) > -1" @click="$emit('updateCategory', scope.row)">修改</el-button>
        <el-button type="danger" plain icon="el-icon-delete" size="mini" v-if="Permission.auth.indexOf(interfaceCategory.delete) > -1" @click="$emit('removeCategory', scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import URLS from '@/api/urls';

export default {
  name: 'CategoryLists',
  props: ['categoryTree'],
  data() {
    return {
      get: URLS.interface.get,
      interfaceCategory: URLS.interfaceCategory
    };
  }
};
</script>

<style scoped>

</style>
