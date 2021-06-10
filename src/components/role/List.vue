<template>
    <el-table :data="roleLists.filter(data=>(!search || data.role_name.includes(search)))">
        <el-table-column label="#ID" prop='id' sortable align="center" width="100px"></el-table-column>
        <el-table-column label="角色名称" prop="role_name" align="center"></el-table-column>
        <el-table-column label="显示状态" v-if="roleAttr.btn.edit" align="center">
            <template slot-scope="scope">
                <Radio :item="scope.row" :url="roleAttr.cgi.status"></Radio>
            </template>
        </el-table-column>
        <el-table-column label="创建时间" sortable prop="created_at" align="center"></el-table-column>
        <el-table-column label="修改时间" sortable prop="updated_at" align="center"></el-table-column>
        <el-table-column label="操作" align="right">
            <template slot="header" slot-scope="scope">
                <el-input v-model="search" placeholder="请输入关键词查询" clearable></el-input>
            </template>
            <template slot-scope="scope">
                <el-button type="primary" plain icon="el-icon-edit" v-if="roleAttr.btn.edit" size="mini" @click="updateRole(scope.row)">修改</el-button>
                <Delete :url="roleAttr.cgi.remove" :item="scope.row" @removeSuccess="removeSuccess(scope.$index)" v-if="roleAttr.btn.del"></Delete>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import Delete from '../common/Delete'
    import apiLists from '../../api/api'
    import Radio from '../common/Radio'
    export default {
        name: 'RoleLists',
        components: { Radio, Delete },
        props: {
            roleAttr: {
                type: Object,
                default: () => {}
            },
            page: {
                type: Number,
                default: () => 1
            }
        },
        data () {
            return {
                search: '',
                roleLists: [],
                pagination: { page: 1, limit: 30, total: 0, page_loading: false, show_page: true }
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.GetLists(this.pagination.page, this.pagination.limit)
            })
        },
        methods: {
            /**
             * todo：获取角色列表
             * @param page
             * @param limit
             */
            GetLists: async function (page, limit) {
                let response = await apiLists.RoleLists({ page: page, limit: limit }).catch(() => {
                    this.$message.error('网络错误')
                })
                if (response && response.data.code === 200) {
                    this.roleLists = (((response.data || {}).item || {}).role || {}).data || []
                    this.pagination.total = (((response.data || {}).item || {}).role || {}).total || []
                    this.roleAttr.authLists = ((response.data || {}).item || {}).auth || []
                    this.roleAttr.defaultChecked = ((response.data || {}).item || {}).defaultAuth || []
                }
                this.$emit('setPagination', this.pagination)
            },
            /**
             * todo:修改角色
             * @param item
             */
            updateRole: function (item) {
                this.$emit('updateRole', item)
            },
            removeSuccess: function () {}
        }
    }
</script>

<style scoped>

</style>
