<template>
  <el-table :data="oAuthLists">
    <el-table-column label="#ID" prop="id" width="100"></el-table-column>
    <el-table-column :show-tooltip-when-overflow="true" label="用户名" prop="username" width="150"></el-table-column>
    <el-table-column align="center" label="头像">
      <template #default="scope">
        <el-avatar :alt="scope.row.username" :src="scope.row.avatar_url"></el-avatar>
      </template>
    </el-table-column>
    <el-table-column :show-tooltip-when-overflow="true" label="邮箱" prop="email"></el-table-column>
    <el-table-column align="center" label="账号类型" width="100">
      <template #default="scope">
        <el-tag effect="plain" type="success">{{ scope.row.oauth_type.toUpperCase() }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" label="允许登录" width="100">
      <template #default="scope">
        <StatusRadio :status-model="scope.row" :url="URL"></StatusRadio>
      </template>
    </el-table-column>
    <el-table-column align="center" label="添加时间" prop="created_at" width="200"></el-table-column>
    <el-table-column align="center" label="修改时间" prop="updated_at" width="200"></el-table-column>
    <el-table-column align="center" label="操作" width="150" fixed="right">
      <template #default="scope">
        <el-tooltip class="item" content="绑定邮箱账号可以使用邮箱登录" effect="dark" placement="top-start">
          <el-button
            v-if="Permission.auth.indexOf(URL) > -1"
            icon="el-icon-edit"
            plain
            size="mini"
            type="primary"
            @click="$emit('bindEmail', scope.row)">
            邮箱绑定
          </el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import StatusRadio from '@/components/common/StatusRadio';
import { oauth } from '@/api/urls';

export default {
  name: 'OAuthLists',
  components: { StatusRadio },
  props: ['oAuthLists'],
  data() {
    return {
      URL: oauth.update
    };
  }
};
</script>

<style scoped>

</style>
