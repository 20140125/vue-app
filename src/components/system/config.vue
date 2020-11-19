<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addConfig">添 加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="configLists" row-key="id"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column label="#" prop="id" width="100px"></el-table-column>
            <el-table-column label="配置名称" prop="name"></el-table-column>
            <el-table-column label="显示状态">
                <template slot-scope="scope" v-if="scope.row.children">
                    <Radio :item="scope.row" :url="cgi.status" v-on:success="success"></Radio>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="created_at"></el-table-column>
            <el-table-column label="修改时间" prop="updated_at"></el-table-column>
            <el-table-column label="操作" width="200px">
                <template slot-scope="scope" >
                    <el-button type="primary" v-if="scope.row.children" plain icon="el-icon-plus" size="mini" @click="setConfigVal(scope.row)">添 加</el-button>
                    <el-button v-else plain type="danger" icon="el-icon-delete" size="mini" @click="removeConfigVal(scope.row)">删 除</el-button>
                    <el-button type="primary" plain icon="el-icon-search" size="mini" @click="updateConfig(scope.row) ">修 改</el-button>
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
        <!---配置值弹框-->
        <el-dialog :title="title" :visible.sync="syncVisible" :width="dialogWidth" center destroy-on-close @close="success">
            <el-form :label-width="labelWidth" :model="configValModel" :ref="reFrom" label-position="left">
                <el-form-item label="Key：" prop="name" :rules="[{required:true,message:'请输入Key',trigger:'blur'}]">
                    <el-input placeholder="key" v-model="configValModel.name"></el-input>
                </el-form-item>
                <el-form-item label="Value：" prop="value" v-if="showValue" :rules="[{required:true,message:'请输入Value',trigger:'blur'}]">
                    <el-input placeholder="value" v-model="configValModel.value"></el-input>
                </el-form-item>
                <el-form-item label="参数配置：" prop="children" v-if="configValModel.children" required>
                    <VueJson :json-data="configValModel.children"></VueJson>
                </el-form-item>
                <el-form-item label="显示状态：" prop="status" required v-if="!configValModel.children">
                    <Status :status="configValModel.status" @changeStatus="changeStatus"></Status>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="configModel" :url="url" :refs="refs" v-on:success="success" :show-btn="false"></Submit>
            </div>
        </el-dialog>
        <!---配置值弹框-->
    </div>
</template>

<script>
    import apiLists from '../../api/api'
    import $url from '../../api/url'
    import Radio from '../common/Radio'
    import Delete from '../common/Delete'
    import Submit from '../common/Submit'
    import { mapActions, mapGetters } from 'vuex'
    import VueJson from '../common/jsonView/json'
    import Status from '../common/Status'
    import func from '../../api/func'
    export default {
        name: 'lists',
        components: {Status, VueJson, Submit, Delete, Radio},
        data () {
            return {
                configLists: [],
                page: 1,
                limit: 15,
                total: 0,
                title: '',
                syncVisible: false, // 是否显示弹框
                labelWidth: '100px',
                loading: true,
                loadingText: '玩命加载中。。。',
                url: '',
                refs: this.$refs,
                reFrom: 'created',
                configValModel: {},
                configModel: {},
                cgi: {remove: $url.configDelete, status: $url.configUpdate, insert: $url.configSave, update: $url.configUpdate},
                showValue: false
            }
        },
        computed: {
            ...mapGetters(['dialogWidth'])
        },
        methods: {
            ...mapActions(['saveSystemLog']),
            /**
             * todo:修改状态
             * @param status
             */
            changeStatus: function (status) {
                this.configModel.status = status
            },
            /**
             * todo：关闭弹框
             */
            success: function () {
                this.getConfigLists(this.page, this.limit)
            },
            /**
             * todo：获取配置列表
             * @param page
             * @param limit
             */
            getConfigLists: function (page, limit) {
                this.syncVisible = false
                let params = { page: page, limit: limit }
                apiLists.ConfigLists(params).then(response => {
                    if (response && response.data.code === 200) {
                        this.configLists = response.data.item
                        this.total = response.data.item.length
                        this.loading = false
                    }
                })
            },
            /**
             * todo：每页记录数
             * @param val
             */
            sizeChange: function (val) {
                this.limit = val
                this.getConfigLists(this.page, this.limit)
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange: function (val) {
                this.page = val
                this.getConfigLists(this.page, this.limit)
            },
            /**
             * TODO:修改配置
             * @param item
             */
            updateConfig: function (item) {
                this.title = '查看【' + item.name + '】配置'
                this.configValModel = item
                this.configModel = item
                this.syncVisible = true
                this.showValue = !item.children
                this.url = this.cgi.update
                this.configModel.hasChildren = !!item.children
                this.reFrom = 'update'
            },
            /**
             * todo：添加
             */
            addConfig: function () {
                this.title = '添加配置'
                this.configValModel = {name: '', status: 1}
                this.configModel = this.configValModel
                this.configModel.hasChildren = false
                this.syncVisible = true
                this.showValue = true
                this.url = this.cgi.insert
                this.reFrom = 'created'
            },
            /**
             * todo：设置配置值
             * @param item
             */
            setConfigVal: function (item) {
                this.title = '设置【' + item.name + '】配置值'
                this.configValModel = {
                    name: '',
                    value: '',
                    status: 1,
                    pid: item.children[item.children.length - 1].pid,
                    created_at: func.setTime(new Date()),
                    updated_at: func.setTime(new Date()),
                    id: item.children[item.children.length - 1].id + 1 || item.children[item.children.length - 1].pid * 100
                }
                item.children.push(this.configValModel)
                this.configModel = item
                this.configModel.hasChildren = true
                this.syncVisible = true
                this.showValue = true
                this.reFrom = 'created'
                this.url = this.cgi.update
            },
            /**
             * todo：移除配置值
             * @param item
             */
            removeConfigVal: function (item) {
                this.$confirm('此操作将永远删除该条记录，是否继续？', '删除记录', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    item.act = 'remove'
                    apiLists.ConfigValUpdate(item).then(response => {
                        if (response && response.data.code === 200) {
                            this.getConfigLists(this.page, this.limit)
                            let data = { href: this.cgi.updateVal, msg: response.data.msg, token: this.$store.state.login.token }
                            this.saveSystemLog(data)
                            this.$message({type: 'success', message: response.data.msg})
                            return false
                        }
                    })
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消删除！'})
                })
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.getConfigLists(this.page, this.limit)
            })
        }
    }
</script>

<style scoped>

</style>
