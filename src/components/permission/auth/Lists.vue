<template>
  <el-table ref="auth" :data="authTree" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" row-key="id">
    <el-table-column label="权限名称" prop="name"></el-table-column>
    <el-table-column label="权限链接" prop="href"></el-table-column>
    <el-table-column align="center" label="显示状态">
      <template #default="scope">
        <StatusRadio :statusModel="scope.row" :url="URL"></StatusRadio>
      </template>
    </el-table-column>
    <el-table-column align="right" label="操作">
      <template #default="scope">
        <el-button
          v-if="scope.row.level <= 1 && Permission.auth.indexOf(save) > -1"
          icon="el-icon-plus"
          plain
          size="mini"
          type="primary"
          @click="$emit('addAuth', scope.row)">
          新增
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(URL) > -1"
          icon="el-icon-edit"
          plain
          size="mini"
          type="primary"
          @click="$emit('updateAuth', scope.row)">
          修改
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import StatusRadio from '../../common/StatusRadio';
import URLS from '../../../api/urls';

export default {
  name: 'AuthLists',
  props: {
    authTree: {
      type: Array,
      default: () => []
    }
  },
  components: { StatusRadio },
  data() {
    return {
      URL: URLS.auth.update,
      save: URLS.auth.save
    };
  }
};
</script>
