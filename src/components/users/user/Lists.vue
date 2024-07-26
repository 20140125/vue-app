<template>
  <el-table :data="usersLists">
    <el-table-column label="#ID" prop="id" width="100"></el-table-column>
    <el-table-column :show-tooltip-when-overflow="true" label="用户名" prop="username" width="150"></el-table-column>
    <el-table-column align="center" label="头像">
      <template #default="scope">
        <el-avatar :alt="scope.row.username" :src="scope.row.avatar_url"></el-avatar>
      </template>
    </el-table-column>
    <el-table-column :show-tooltip-when-overflow="true" label="邮箱" prop="email"></el-table-column>
    <el-table-column :show-tooltip-when-overflow="true" label="手机号" prop="phone_number"></el-table-column>
    <el-table-column align="center" label="允许登录" width="100">
      <template #default="scope">
        <StatusRadio :status-model="scope.row" :url="URL"></StatusRadio>
      </template>
    </el-table-column>
    <el-table-column align="center" label="添加时间" prop="created_at" width="200"></el-table-column>
    <el-table-column align="center" label="修改时间" prop="updated_at" width="200"></el-table-column>
    <el-table-column align="center" label="操作" width="100" fixed="right">
      <template #default="scope">
        <el-button
          v-if="Permission.auth.indexOf(URL) > -1"
          icon="el-icon-edit"
          plain
          size="mini"
          type="primary"
          @click="$emit('updatedUsers', scope.row)">
          修改
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="js">
import StatusRadio from '@/components/common/StatusRadio';
import { users } from '@/api/urls';

export default {
  name: 'UsersLists',
  components: { StatusRadio },
  props: ['usersLists'],
  data() {
    return {
      URL: users.update
    };
  }
};
</script>
