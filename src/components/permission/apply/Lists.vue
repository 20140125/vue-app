<template>
    <el-table :data="permissionLists">
        <el-table-column type="expand">
            <template #default="scope">
                <el-table :data="scope.row.applyLog" border>
                    <el-table-column label="执行者" prop="user_name" align="center"></el-table-column>
                    <el-table-column label="执行时间" prop="created_at" align="center"></el-table-column>
                    <el-table-column label="执行记录" prop="desc" align="center"></el-table-column>
                </el-table>
            </template>
        </el-table-column>
        <el-table-column label="#ID" prop="id" width="100px"></el-table-column>
        <el-table-column label="申请人" prop="username"></el-table-column>
        <el-table-column label="申请地址" prop="href"></el-table-column>
        <el-table-column label="授权通过" align="center" width="150px">
            <template #default="scope">
                <StatusRadio :url="URL" :status-model="scope.row" @closeDialog="$emit('getPermissionApply', { page: 1, limit: 15, show_page: true, refresh: true })"></StatusRadio>
            </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="created_at" align="center"></el-table-column>
        <el-table-column label="通过时间" prop="updated_at" align="center"></el-table-column>
        <el-table-column label="权限期限" prop="expires" align="center"></el-table-column>
        <el-table-column label="操作" width="200px" align="right">
            <template #default="scope">
                <el-button type="primary" v-if="scope.row.refresh" plain icon="el-icon-refresh-right" size="mini" @click="$emit('permissionUpdate', scope.row)">续期</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import StatusRadio from '@/components/common/StatusRadio';
import URLS from '@/api/urls';

export default {
    name: 'PermissionLists',
    props: ['permissionLists'],
    components: {StatusRadio},
    data() {
        return {
            URL: URLS.permission.update
        };
    }
};
</script>
