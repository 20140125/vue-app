<template>
    <el-table
        :data="authLists.filter(data=>(!authAttr.search || data.name.toLowerCase().includes(authAttr.search.toLowerCase()) || data.href.includes(authAttr.search.toLowerCase())))"
        row-key="id"
        lazy
        :load="loadAuthLists"
        :tree-props="{children: '__child', hasChildren: 'hasChildren'}">
        <el-table-column label="权限名称" prop="name"></el-table-column>
        <el-table-column label="权限链接" prop="href"></el-table-column>
        <el-table-column label="显示状态" v-if="authAttr.btn.edit" align="center">
            <template slot-scope="scope">
                <Radio :item="scope.row" :url="authAttr.cgi.status"></Radio>
            </template>
        </el-table-column>
        <el-table-column align="right">
            <template slot="header" slot-scope="scope">
                <el-input v-model="authAttr.search" placeholder="输入关键词查询" clearable></el-input>
            </template>
            <template slot-scope="scope">
                <el-button icon="el-icon-plus" type="primary" size="mini" v-if="scope.row.level <= 1 && authAttr.btn.add" plain @click="addAuth(scope.row)">添加</el-button>
                <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="updateAuth(scope.row)" v-if="authAttr.btn.edit">修改</el-button>
<!--                <Delete :url="authAttr.cgi.remove" :item="scope.row" @removeSuccess="removeSuccess(scope.$index)" v-if="authAttr.btn.del"></Delete>-->
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import Delete from '../common/Delete'
    import apiLists from '../../api/api'
    import Radio from '../common/Radio'
    export default {
        name: 'AuthLists',
        components: { Radio, Delete },
        props: {
            authAttr: {
                type: Object,
                default: () => {}
            }
        },
        data () {
            return {
                authLists: [],
                pagination: { page: 1, limit: 30, total: 0, page_loading: false }
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.getAuthLists()
            })
        },
        methods: {
            /**
             * todo:远程检索数据
             * @param tree
             * @param treeNode
             * @param resolve
             */
            loadAuthLists: async function (tree, treeNode, resolve) {
                let response = await apiLists.AuthLists({id: tree.id}).catch(() => {
                    this.$message.error('网络错误')
                })
                if (response && response.data.code === 200) {
                    setTimeout(() => {
                        resolve(response.data.item)
                    }, 500)
                }
            },
            /**
             * todo：获取权限
             * @param id
             */
            getAuthLists: async function (id = 0) {
                let response = await apiLists.AuthLists({ id: id }).catch(() => {
                    this.$message.error('网络错误')
                })
                if (response && response.data.code === 200) {
                    this.authLists = (response.data || {}).item || []
                }
                this.$emit('setPagination', this.pagination)
            },
            /**
             * todo:获取权限
             */
            getAuth: async function () {
                let response = await apiLists.GetAuth({}).catch(() => {
                    this.$message.error('网络错误')
                })
                if (response && response.data.code === 200) {
                    this.authAttr.authLevel = (response.data || {}).item || []
                }
            },
            /**
             * todo：权限添加
             * @param scope
             */
            addAuth: function (scope) {
                if (this.authAttr.authLevel.length <= 0) {
                    this.getAuth()
                }
                this.$emit('addAuth', scope)
            },
            /**
             * todo：权限保存
             * @param item
             */
            updateAuth: function (item) {
                if (this.authAttr.authLevel.length <= 0) {
                    this.getAuth()
                }
                this.$emit('updateAuth', item)
            },
            /**
             * todo:删除记录
             * @param index
             */
            removeSuccess: function (index) {
                this.authLists.splice(index, 1)
            }
        }
    }
</script>

<style scoped>

</style>
