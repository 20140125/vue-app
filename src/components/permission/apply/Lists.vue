<template>
  <el-table :data="permissionLists">
    <el-table-column type="expand">
      <template #default="scope">
        <el-table :data="scope.row.applyLog" border>
          <el-table-column align="center" label="执行者" prop="user_name"></el-table-column>
          <el-table-column align="center" label="执行时间" prop="created_at"></el-table-column>
          <el-table-column align="center" label="执行记录" prop="desc"></el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column label="#ID" prop="id" width="100"></el-table-column>
    <el-table-column label="申请人" prop="username"></el-table-column>
    <el-table-column label="权限地址" width="300" align="center" show-tooltip-when-overflow>
      <template #default="scope">
        {{ `${baseURL}${scope.row.href}` }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="授权通过" width="150">
      <template #default="scope">
        <StatusRadio
          :status-model="scope.row"
          :url="URL"
          @closeDialog="$emit('getPermissionApply', { page: 1, limit: 15, show_page: true, refresh: true })">
        </StatusRadio>
      </template>
    </el-table-column>
    <el-table-column align="center" label="申请时间" prop="created_at"></el-table-column>
    <el-table-column align="center" label="通过时间" prop="updated_at"></el-table-column>
    <el-table-column align="center" label="权限期限" prop="expires"></el-table-column>
    <el-table-column align="right" label="操作" width="200px">
      <template #default="scope">
        <el-button
          v-if="scope.row.refresh"
          icon="el-icon-refresh-right"
          plain
          size="mini"
          type="primary"
          @click="$emit('permissionUpdate', scope.row)">
          续期
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import StatusRadio from '../../common/StatusRadio';
import URLS from '../../../api/urls';

export default {
  name: 'PermissionLists',
  props: ['permissionLists'],
  components: { StatusRadio },
  data() {
    return {
      URL: URLS.permission.update,
      baseURL: URLS.baseURL
    };
  }
};
</script>
