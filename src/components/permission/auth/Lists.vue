<template>
    <el-table :data="authTree" row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" ref="auth">
        <el-table-column label="权限名称" prop="name"></el-table-column>
        <el-table-column label="权限链接" prop="href"></el-table-column>
        <el-table-column label="显示状态" align="center">
            <template #default="scope">
                <StatusRadio :url="URL" :status-model="scope.row"></StatusRadio>
            </template>
        </el-table-column>
        <el-table-column align="right" label="操作">
            <template #default="scope">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-if="scope.row.level <= 1 && Permission.auth.indexOf(save) > -1" @click="$emit('addAuth', scope.row)">新增</el-button>
                <el-button type="primary" v-if="Permission.auth.indexOf(URL) > -1" plain icon="el-icon-edit" size="mini" @click="$emit('updateAuth', scope.row)">修改</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import StatusRadio from '@/components/common/StatusRadio'
import URLS from '@/api/urls'
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
        }
    }
}
</script>
