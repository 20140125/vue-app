<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px" v-if="btn.add">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addReqRule">添 加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="reqRuleLists.filter(data=>(!search || data.username.toLowerCase().includes(search.toLowerCase()) || data.href.includes(search.toLowerCase())))">
            <el-table-column label="#ID" prop="id" width="70px" align="center" sortable/>
            <el-table-column label="申请人" prop="username" width="130px" :show-tooltip-when-overflow="true" align="center"></el-table-column>
            <el-table-column label="授权地址" prop="href" align="center" :show-tooltip-when-overflow="true"></el-table-column>
            <el-table-column label="授权状态" align="center" v-if="userInfo.username === 'admin'">
                <template slot-scope="scope">
                    <Radio :item="scope.row" :url="cgi.status" v-on:success="success"></Radio>
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
                    <el-input v-model="search" placeholder="请输入关键字查询"></el-input>
                </template>
                <template slot-scope="scope">
                    <el-button type="primary" v-if="scope.row.status === 1 && btn.edit && Date.parse(scope.row.expires)/1000<=time" plain icon="el-icon-plus" size="mini" @click="updateReqRule(scope.row)">续 期</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="reqRuleLists" v-on:success="success" v-if="scope.row.status === 1 && btn.del" btn-text="撤 销"></Delete>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin: 25px 0">
            <el-pagination
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    :page-sizes="[15, 30, 50, 100]"
                    :page-size="limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :current-page="page">
            </el-pagination>
        </div>
        <!--table 分页-->
        <!---弹框-->
        <el-dialog :title="title" :visible.sync="syncVisible" :modal="true" :width="dialogWidth" :center="true" :destroy-on-close="true">
            <el-form :model="reqRuleModel" :ref="reFrom" :rules="rules" label-position="left" label-width="100px">
                <el-form-item label="申请人：" prop="user_id">
                    <el-select filterable style="width: 100%" v-model="reqRuleModel.username" @change="getAuth">
                        <el-option v-for="(user,index) in userLists" :label="user.username" :key="index" :value="user.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授权地址：" prop="href">
                    <el-select multiple="multiple" filterable style="width: 100%" v-model="reqRuleModel.href" :disabled="reFrom === 'update'">
                        <el-option v-for="(rule,index) in ruleLists" :label="setAuthName(rule)" :key="index" :value="rule.href" :disabled="rule.disable"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="授权时间：" prop="expires">
                    <el-date-picker v-model="reqRuleModel.expires" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择授权时间" :picker-options="pickerOptions" style="width: 100%"/>
                </el-form-item>
                <el-form-item label="授权说明：" prop="desc">
                    <el-input v-model="reqRuleModel.desc" maxlength="200" show-word-limit resize="none" :autosize="{ minRows: 4}" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="是否授权：" prop="status" v-if="reFrom === 'created'">
                    <Status :status="reqRuleModel.status" @changeStatus="changeStatus"></Status>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="reqRuleModel" :url="url" :refs="refs" v-on:success="success"></Submit>
            </div>
        </el-dialog>
        <!---弹框-->
    </div>
</template>

<script>
    import apiLists from '../../api/api'
    import $url from '../../api/url'
    import func from '../../api/func'
    import Radio from '../../components/common/Radio'
    import Delete from '../../components/common/Delete'
    import Submit from '../../components/common/Submit'
    import {mapGetters} from 'vuex'
    import Status from '../../components/common/Status'
    export default {
        name: 'lists',
        components: {Status, Submit, Delete, Radio},
        data () {
            return {
                reqRuleLists: [],
                ruleLists: [], // 权限列表
                userLists: [], // 授权用户列表
                page: 1,
                limit: 15,
                total: 0,
                search: '',
                title: '',
                syncVisible: false, // 是否显示弹框
                loading: true,
                loadingText: '玩命加载中。。。',
                url: '',
                refs: this.$refs,
                reFrom: 'created',
                reqRuleModel: {},
                cgi: { remove: $url.reqRuleDelete, status: $url.reqRuleUpdate, update: $url.reqRuleUpdate, insert: $url.reqRuleSave },
                rules: {
                    user_id: [{required: true, message: '申请人不得为空', trigger: 'blur'}],
                    href: [{required: true, message: '授权地址不得为空', trigger: 'change'}],
                    expires: [{required: true, message: '授权时效不得为空', trigger: 'change'}],
                    desc: [{required: true, message: '授权说明不得为空', trigger: 'blur'}],
                    status: [{required: true, message: '授权状态不得为空', trigger: 'blur'}]
                },
                // 提前七天通知用户续期
                time: Date.parse(new Date()) / 1000 + 3600 * 7 * 24,
                // 日期快捷键
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() < Date.now()
                    },
                    shortcuts: [{
                        text: '一星期',
                        onClick (picker) {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', date)
                        }
                    }, {
                        text: '一个月',
                        onClick (picker) {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', date)
                        }
                    }, {
                        text: '三个月',
                        onClick (picker) {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30 * 3)
                            picker.$emit('pick', date)
                        }
                    }, {
                        text: '六个月',
                        onClick (picker) {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30 * 6)
                            picker.$emit('pick', date)
                        }
                    }, {
                        text: '一年',
                        onClick (picker) {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30 * 12)
                            picker.$emit('pick', date)
                        }
                    }]
                },
                // 细化权限按钮
                btn: {}
            }
        },
        computed: {
            ...mapGetters(['userInfo', 'dialogWidth'])
        },
        methods: {
            /**
             * todo:修改状态
             * @param status
             */
            changeStatus: function (status) {
                this.reqRuleModel.status = status
            },
            /**
             * todo：关闭弹框
             */
            success: function () {
                this.getReqRuleLists(this.page, this.limit)
            },
            /**
             * todo：设置时间
             * @param timestamp
             */
            setTimes: function (timestamp) {
                return func.setTime(timestamp * 1000)
            },
            /**
             * todo：获取角色列表
             * @param page
             * @param limit
             */
            getReqRuleLists: function (page, limit) {
                let params = {page: page, limit: limit}
                this.syncVisible = false
                this.loading = true
                apiLists.ReqRuleLists(params).then(response => {
                    if (response && response.data.code === 200) {
                        this.reqRuleLists = response.data.item.data
                        this.total = response.data.item.total
                        this.userLists = response.data.item.userLists
                        this.loading = false
                    }
                })
            },
            /**
             * 设置权限名称
             * @param item
             * @return {String}
             */
            setAuthName: function (item) {
                return Array(item.level + 1).join('　　') + item.name
            },
            /**
             * todo：每页记录数
             * @param val
             */
            sizeChange: function (val) {
                this.limit = val
                this.getReqRuleLists(this.page, this.limit)
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange: function (val) {
                this.page = val
                this.getReqRuleLists(this.page, this.limit)
            },
            /**
             * todo：权限申请
             */
            addReqRule: function () {
                this.title = '权限申请'
                this.syncVisible = true
                this.reqRuleModel = { user_id: this.userInfo.user_id, href: [], desc: '', expires: '', status: 1, username: this.userInfo.username }
                this.getAuth(this.userInfo.user_id)
                this.url = this.cgi.insert
                this.reFrom = 'created'
            },
            /**
             * TODO:获取权限
             */
            getAuth: function (userId) {
                let params = {user_id: userId}
                apiLists.GetAuthByToken(params).then(response => {
                    if (response && response.data.code === 200) {
                        this.ruleLists = response.data.item
                    }
                })
            },
            /**
             * todo：权限续期
             * @param item
             */
            updateReqRule: function (item) {
                this.title = '权限续期'
                this.syncVisible = true
                this.reqRuleModel = item
                this.getAuth(item.user_id)
                this.reqRuleModel.href = [this.reqRuleModel.href]
                this.ruleLists = this.reqRuleModel.ruleLists
                this.url = this.cgi.update
                this.reFrom = 'update'
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.btn = func.setBtnStatus(this.$route.path, this.$route.name, this.userInfo.auth)
                this.getReqRuleLists(this.page, this.limit)
            })
        }
    }
</script>

<style scoped>

</style>
