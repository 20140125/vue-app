<template>
    <el-table :data="pushLists">
        <el-table-column label="#ID" prop="id" width="100px" align="center"></el-table-column>
        <el-table-column label="接收者" prop="username" width="200px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="推送标题" width="200px"  align="center">
            <template #default="scope">
                <el-tag effect="plain" type="success">{{scope.row.title}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="推送内容" prop="info" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="实时推送" width="100px" align="center">
            <template #default="scope">
                <el-tag effect="plain" :type="scope.row.status === 1 ? 'success' : 'info'">{{scope.row.status === 1 ? '是' : '否'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="推送状态" align="center" width="150px" >
            <template #default="scope">
                <el-tag effect="plain" :type="typeAttr[scope.row.state]">{{scope.row.state.toUpperCase()}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="推送时间" prop="created_at" align="center" width="150px"></el-table-column>
        <el-table-column align="center" width="150px" label="操作">
            <template #default="scope">
                <el-button v-if="scope.row.state !== 'successfully' && Permission.auth.indexOf(URL) > -1" type="primary" icon="el-icon-edit" plain size="mini" @click="$emit('runPusher', scope.row)">执行</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import URLS from '@/api/urls'
export default {
    name: 'PushLists',
    components: {},
    props: ['pushLists'],
    data() {
        return {
            URL: URLS.push.update,
            typeAttr: { 'failed': 'danger', 'successfully': 'success', 'offline': 'warning' },
        }
    }
}
</script>

<style scoped>

</style>
