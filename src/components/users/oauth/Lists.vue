<template>
    <el-table :data="oAuthLists">
        <el-table-column label="#ID" prop="id" width="100px"></el-table-column>
        <el-table-column label="用户名" prop="username" width="150px" :show-tooltip-when-overflow="true"></el-table-column>
        <el-table-column label="头像" align="center">
            <template #default="scope">
                <el-avatar :src="scope.row.avatar_url" :alt="scope.row.username"></el-avatar>
            </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email" :show-tooltip-when-overflow="true"></el-table-column>
        <el-table-column label="账号类型">
            <template #default="scope">
                <el-tag type="success" effect="dark">{{scope.row.oauth_type.toUpperCase()}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="允许登录" align="center">
            <template #default="scope">
                <StatusRadio :url="URL" :status-model="scope.row"></StatusRadio>
            </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="created_at" align="center"></el-table-column>
        <el-table-column label="修改时间" prop="updated_at" align="center"></el-table-column>
        <el-table-column label="操作" align="right">
            <template #default="scope">
                <el-tooltip class="item" effect="dark" content="绑定邮箱账号可以使用邮箱登录" placement="top-start">
                    <el-button v-if="Permission.auth.indexOf(URL) > -1"  plain size="mini" icon="el-icon-edit" type="primary" @click="$emit('bindEmail', scope.row)">邮箱绑定</el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import URLS from '@/api/urls'
import StatusRadio from '@/components/common/StatusRadio'
export default {
    name: 'OAuthLists',
    components: { StatusRadio },
    props: ['oAuthLists'],
    data() {
        return {
            URL: URLS.oauth.update,
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.login.userInfo
        }
    }
}
</script>

<style scoped>

</style>
