<template>
  <el-table
    :data="areaLists"
    :load="loadMORE"
    :tree-props="{children: '__child', hasChildren: 'hasChildren'}"
    lazy
    row-key="id">
    <el-table-column label="城市名称" prop="name"></el-table-column>
    <el-table-column align="center" label="添加时间" prop="created_at"></el-table-column>
    <el-table-column align="center" label="更新时间" prop="updated_at"></el-table-column>
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" placeholder="输入关键词查询" @keyup="$emit('searchAreaLists', search)"></el-input>
      </template>
      <template #default="scope">
        <el-button icon="el-icon-search" plain size="mini" type="primary" @click="$emit('getAreaWeather', scope.row)">
          查看天气
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="js">
export default {
  name: 'AreaLists',
  props: ['areaLists'],
  data() {
    return {
      search: ''
    };
  },
  methods: {
    /**
     * 加载更多数据
     * @param tree
     * @param treeNode
     * @param resolve
     */
    loadMORE(tree, treeNode, resolve) {
      this.$emit('loadMORE', tree, treeNode, resolve);
    }
  }
};
</script>

<style scoped>

</style>
