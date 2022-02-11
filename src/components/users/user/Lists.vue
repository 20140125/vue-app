<template>
  <el-table :data="usersLists">
    <el-table-column label="#ID" prop="id" width="100px"></el-table-column>
    <el-table-column label="用户名" prop="username" width="150px" :show-tooltip-when-overflow="true"></el-table-column>
    <el-table-column label="头像" align="center">
      <template #default="scope">
        <el-avatar :src="scope.row.avatar_url" :alt="scope.row.username"></el-avatar>
      </template>
    </el-table-column>
    <el-table-column label="邮箱" prop="email" :show-tooltip-when-overflow="true"></el-table-column>
    <el-table-column label="手机号" prop="phone_number" :show-tooltip-when-overflow="true"></el-table-column>
    <el-table-column label="允许登录" align="center">
      <template #default="scope">
        <StatusRadio :url="URL" :status-model="scope.row"></StatusRadio>
      </template>
    </el-table-column>
    <el-table-column label="添加时间" prop="created_at" align="center"></el-table-column>
    <el-table-column label="修改时间" prop="updated_at" align="center"></el-table-column>
    <el-table-column label="操作" align="right">
      <template #default="scope">
        <el-button v-if="Permission.auth.indexOf(URL) > -1" plain size="mini" icon="el-icon-edit" type="primary"
                   @click="$emit('updatedUsers', scope.row)">修改
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import URLS from '@/api/urls';
import StatusRadio from '@/components/common/StatusRadio';

export default {
  name: 'UsersLists',
  components: { StatusRadio },
  props: ['usersLists'],
  data() {
    return {
      URL: URLS.users.update
    };
  }
};
</script>

<style scoped>

</style>
