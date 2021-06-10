<template>
    <el-table :data="lists.filter(data=>(!search || data.username.toLowerCase().includes(search.toLowerCase()) || data.href.includes(search.toLowerCase())))">
        <el-table-column label="#ID" prop="id" width="70px" align="center" sortable></el-table-column>
        <el-table-column label="申请人" prop="username" width="130px" :show-tooltip-when-overflow="true" align="center"></el-table-column>
        <el-table-column label="授权地址" prop="href" align="center" :show-tooltip-when-overflow="true"></el-table-column>
        <el-table-column label="授权状态" align="center" v-if="userInfo.username === 'admin'">
            <template slot-scope="scope">
                <Radio :item="scope.row" :url="reqRuleAttr.cgi.status"></Radio>
            </template>
        </el-table-column>
        <el-table-column label="授权状态" align="center" v-if="userInfo.username !== 'admin'">
            <template slot-scope="scope">
                <el-button :icon="scope.row.status === 1 ? 'el-icon-success' : 'el-icon-error'" circle :type="scope.row.status === 1 ? 'success' : 'danger'" size="medium"></el-button>
            </template>
        </el-table-column>
        <el-table-column label="描述" prop="desc"  show-tooltip-when-overflow></el-table-column>
        <el-table-column label="创建时间" prop="created_at"  align="center" width="160px" sortable></el-table-column>
        <el-table-column label="修改时间" prop="updated_at" align="center" width="160px" sortable></el-table-column>
        <el-table-column label="权限时效" prop="expires" align="center" width="160px" sortable></el-table-column>
        <el-table-column label="操作" width="200px" align="right">
            <template slot="header" slot-scope="scope">
                <el-input v-model="search" placeholder="请输入关键字查询" clearable></el-input>
            </template>
            <template slot-scope="scope">
                <el-button type="primary" v-if="scope.row.status === 1 && reqRuleAttr.btn.edit && Date.parse(scope.row.expires) / 1000 <= time" plain icon="el-icon-plus" size="mini" @click="updateReqRule(scope.row)">续期</el-button>
                <Delete :url="reqRuleAttr.cgi.remove" :item="scope.row" @removeSuccess="removeSuccess(scope.$index)" v-if="scope.row.status === 1 && reqRuleAttr.btn.del" btn-text="撤销"></Delete>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import Delete from '../common/Delete'
    import apiLists from '../../api/api'
    import Radio from '../common/Radio'
    export default {
        name: 'ReqRuleList',
        components: { Radio, Delete },
        props: {
            reqRuleAttr: {
                type: Object,
                default: () => {}
            },
            userInfo: {
                type: Object,
                default: () => {}
            },
            page: {
                type: Number,
                default: () => 1
            }
        },
        watch: {
            page: function () {
                this.pagination.page = this.page
                this.GetLists(this.page, this.pagination.limit)
            }
        },
        data () {
            return {
                lists: [],
                search: '',
                pagination: { page: 1, limit: 10, total: 0, page_loading: false, show_page: true },
                time: Date.parse(new Date()) / 1000 + 3600 * 7 * 24
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
                let response = await apiLists.ReqRuleLists({ page: page, limit: limit }).catch(() => {
                    this.$message.error('网络错误')
                })
                if (response && response.data.code === 200) {
                    this.lists = response.data.item.data
                    this.pagination.total = response.data.item.total
                    this.userLists = response.data.item.userLists
                }
                this.$emit('setPagination', this.pagination)
            },
            /**
             * todo:更新权限
             * @param item
             */
            updateReqRule: function (item) {
                this.$emit('updateReqRule', item)
            },
            removeSuccess: function () {}
        }
    }
</script>

<style scoped>

</style>
