<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
            <el-form-item>
                <el-button v-for="(state,index) in pushState" :key="index" @click="getState(state.val)" :type="state.type" size="medium" plain>{{ state.val.toUpperCase() }}</el-button>
            </el-form-item>
            <el-form-item style="float:right;" v-if="btn.add">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addPush">添 加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="pushLists.filter(data=>(!search || data.username.toLowerCase().includes(search.toLowerCase()) || data.info.toLowerCase().includes(search.toLowerCase())))">
            <el-table-column label="#" prop="id" width="100px"/>
            <el-table-column label="目标用户" prop="username" width="120px"></el-table-column>
            <el-table-column label="推送类型" prop="title" width="150px"></el-table-column>
            <el-table-column label="推送内容" prop="info" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="实时" width="80px"  :filters="[{ text: '是', value: '1' }, { text: '否', value: '2' }]" :filter-method="filterStatus">
                <template slot-scope="scope">
                    <el-button plain type="primary" size="mini" v-if="scope.row.status === 2">否</el-button>
                    <el-button plain type="success" size="mini"  v-if="scope.row.status === 1">是</el-button>
                </template>
            </el-table-column>
            <el-table-column label="推送状态" prop="state" width="150px">
                <template slot-scope="scope">
                    <el-button plain :type="setType(scope.row.state)" size="mini">{{scope.row.state.toUpperCase()}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="时间" prop="created_at" width="200px"></el-table-column>
            <el-table-column width="200px" align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" placeholder="请输入关键词查询"></el-input>
                </template>
                <template slot-scope="scope">
                    <el-button type="primary" v-if="scope.row.state!=='successfully' && btn.edit" plain icon="el-icon-edit" size="mini" @click="updatePush(scope.row)">执 行</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="pushLists" v-on:success="success" v-if="btn.del"></Delete>
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
        <el-dialog :title="title" :width="dialogWidth" :visible.sync="syncVisible" :modal="true" :center="true" :destroy-on-close="true">
            <el-form :label-width="labelWidth" :model="pushModel" :ref="reFrom" label-position="left">
                <el-form-item label="用户名：" prop="username" required>
                    <el-select v-model="pushModel.username" filterable @change="changeOauthName" style="width: 100%">
                        <el-option v-for="(push,index) in oauthLists" :key="index" :label="push.username" :value="push.uuid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="UID：" prop="uid" required>
                    <el-input v-model="pushModel.uid" readonly placeholder="用户UID"></el-input>
                </el-form-item>
                <el-form-item label="标题：" prop="title" required>
                    <el-input v-model="pushModel.title" placeholder="推送标题"></el-input>
                </el-form-item>
                <el-form-item label="时间：" prop="created_at" required>
                    <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"  v-model="pushModel.created_at" style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item label="消息：" prop="info" required>
                    <el-input v-model="pushModel.info" placeholder="推送消息" type="textarea" resize="none" rows="4"></el-input>
                </el-form-item>
                <el-form-item label="实时：" prop="status" required>
                    <Status :status="pushModel.status" @changeStatus="changeStatus"></Status>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="pushModel" :url="url" :refs="refs" v-on:success="success"></Submit>
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
                pushLists: [],
                page: 1,
                limit: 15,
                state: '',
                status: '',
                total: 0,
                search: '',
                oauthLists: [],
                title: '',
                syncVisible: false, // 是否显示弹框
                labelWidth: '80px',
                loading: true,
                loadingText: '玩命加载中。。。',
                url: '',
                refs: this.$refs,
                reFrom: 'created',
                pushModel: {},
                cgi: {insert: $url.pushSave, update: $url.pushUpdate, remove: $url.pushDelete, status: $url.pushUpdate},
                pushState: [{'val': 'successfully', 'label': '成功', 'type': 'success'}, {'val': 'failed', 'label': '失败', 'type': 'danger'}, {'val': 'offline', 'label': '离线', 'type': 'default'}],
                // 权限细化按钮
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
                this.pushModel.status = status
            },
            /**
             * todo：关闭弹框
             */
            success: function () {
                this.getPushLists(this.page, this.limit)
            },
            /**
             * TODO:实时状态查询
             * @param value
             * @param row
             */
            filterStatus: function (value, row) {
                return row.status.toString() === value
            },
            /**
             * TODO:设置按钮类型
             * @param state
             */
            setType: function (state) {
                let type = ''
                switch (state) {
                case 'failed' : type = 'danger'; break
                case 'successfully': type = 'success'; break
                case 'offline' : type = 'default'; break
                }
                return type
            },
            /**
             * todo：获取角色列表
             * @param page
             * @param limit
             */
            getPushLists: function (page, limit) {
                let params = { page: page, limit: limit, state: this.state, status: this.status }
                this.syncVisible = false
                this.oauthLists = []
                apiLists.PushList(params).then(response => {
                    this.pushLists = response.data.item.data
                    this.total = response.data.item.total
                    this.oauthLists = response.data.item.oauth
                    this.oauthLists.unshift({uuid: this.userInfo.default_client_id, username: 'default'})
                })
                this.loading = false
            },
            /**
             * TODO：修改推送人获取推送人ID
             * @param item
             */
            changeOauthName: function (item) {
                this.oauthLists.map(row => {
                    if (item === row.uuid) {
                        this.pushModel.username = row.username
                    }
                })
                this.pushModel.uid = item
            },
            /**
             * TODO：推送状态查询
             * @param state
             */
            getState: function (state) {
                this.state = state
                this.getPushLists(1, this.limit)
            },
            /**
             * todo：每页记录数
             * @param val
             */
            sizeChange: function (val) {
                this.limit = val
                this.getPushLists(this.page, this.limit)
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange: function (val) {
                this.page = val
                this.getPushLists(this.page, this.limit)
            },
            /**
             * todo：添加
             */
            addPush: function () {
                this.title = '添加站内通知'
                this.syncVisible = true
                this.pushModel = {username: '', uid: '', state: '', status: 2, created_at: func.setTime(new Date()), title: '系统通知'}
                this.url = this.cgi.insert
            },
            /**
             * todo：修改
             * @param item
             */
            updatePush: function (item) {
                this.title = '修改站内通知'
                this.syncVisible = true
                this.pushModel = item
                this.url = this.cgi.update
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.btn = func.setBtnStatus(this.$route.path, this.$route.name, this.userInfo.auth)
                this.getPushLists(this.page, this.limit)
            })
        }
    }
</script>

<style scoped>

</style>
