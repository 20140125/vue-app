<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
            <el-form :inline="true" style="margin-top: 10px">
                <el-form-item style="float:right;" v-if="btn.add">
                    <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addTimeLine">添 加</el-button>
                </el-form-item>
            </el-form>
        </el-form>
        <el-table :data="timeLineList">
            <el-table-column label="#" prop="id" width="100px"/>
            <el-table-column label="文案" prop="content" :show-tooltip-when-overflow="true"/>
            <el-table-column label="时间" prop="timestamp"/>
            <el-table-column label="类型">
                <template slot-scope="scope">
                    <el-button :type="scope.row.type" size="mini" plain>{{scope.row.type.toUpperCase()}}</el-button>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" placeholder="请输入关键词查询"/>
                </template>
                <template slot-scope="scope">
                    <el-button type="primary"  plain icon="el-icon-edit" v-if="btn.edit" @click="editTimeLine(scope.row)" size="mini">修 改</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="timeLineList"
                            v-on:success="success" v-if="btn.del"/>
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
        <el-dialog :title="title" :width="dialogWidth" :visible.sync="syncVisible" :modal="modal" :center="center" :destroy-on-close="destroy_on_close">
            <el-form :label-width="labelWidth" :model="timeLineModel" :ref="reFrom" :rules="rules">
                <el-form-item label="文案" prop="content">
                    <el-input v-model="timeLineModel.content" placeholder="文案"/>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="timeLineModel.type" filterable style="width: 100%">
                        <el-option v-for="(type,index) in typeLists" :key="index" :value="type.val" :label="type.key"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间" prop="timestamp">
                    <el-date-picker value-format="yyyy-MM-dd" format="yyyy-MM-dd"  v-model="timeLineModel.timestamp" style="width: 100%"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="timeLineModel" :url="url" :refs="refs" v-on:success="success"/>
            </div>
        </el-dialog>
        <!---弹框-->
    </div>
</template>

<script>
    import apiLists from '../../api/api'
    import $url from '../../api/url'
    import func from '../../api/func'
    import Delete from '../common/Delete'
    import Submit from '../common/Submit'
    import {mapGetters} from 'vuex'
    export default {
        name: 'timeline',
        components: {Delete, Submit},
        data () {
            return {
                timeLineList: [],
                page: 1,
                limit: 15,
                total: 0,
                search: '',
                title: '',
                syncVisible: false, // 是否显示弹框
                modal: true, // 遮盖层是否需要
                labelWidth: '80px',
                loading: true,
                destroy_on_close: true,
                center: true,
                loadingText: '玩命加载中。。。',
                reFrom: 'timeline',
                timeLineModel: {},
                refs: this.$refs,
                url: '',
                cgi: {save: $url.timeLineSave, update: $url.timeLineUpdate},
                rules: {content: [{required: true, message: '文案不得为空', trigger: 'blur'}], timestamp: [{required: true, message: '时间不得为空', trigger: 'change'}]},
                // 权限细化按钮
                btn: {},
                typeLists: [
                    {'key': 'SUCCESS', 'val': 'success'},
                    {'key': 'INFO', 'val': 'info'},
                    {'key': 'PRIMARY', 'val': 'primary'},
                    {'key': 'DANGER', 'val': 'danger'},
                    {'key': 'WARNING', 'val': 'warning'}
                ]
            }
        },
        computed: {
            ...mapGetters(['userInfo', 'dialogWidth'])
        },
        methods: {
            /**
             * todo：关闭弹框
             */
            success: function () {
                this.syncVisible = false
                this.getTimeLineList(this.page, this.limit)
            },
            /**
             * todo：获取列表
             * @param page
             * @param limit
             */
            getTimeLineList: function (page, limit) {
                apiLists.TimeLineLists({ page: page, limit: limit }).then(response => {
                    this.loading = false
                    this.timeLineList = response.data.item.data
                    this.total = response.data.item.total
                })
            },
            /**
             * TODO：添加时间线
             */
            addTimeLine: function () {
                this.syncVisible = true
                this.title = '添加时间线'
                this.timeLineModel = {
                    content: '',
                    type: 'success',
                    timestamp: func.setTime(func.getTimestamp() * 1000)
                }
                this.url = this.cgi.save
            },
            /**
             * TODO:修改时间线
             * @param row
             */
            editTimeLine: function (row) {
                this.title = '修改时间线'
                this.timeLineModel = row
                this.syncVisible = true
                this.url = this.cgi.update
            },
            /**
             * todo：每页记录数
             * @param val
             */
            sizeChange: function (val) {
                this.limit = val
                this.getTimeLineList(this.page, this.limit)
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange: function (val) {
                this.page = val
                this.getTimeLineList(this.page, this.limit)
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.btn = func.setBtnStatus(this.$route.path, this.$route.name, this.userInfo.auth)
                this.getTimeLineList(this.page, this.limit)
            })
        }
    }
</script>

<style scoped>
</style>
