<template>
    <BaseLayout :loading="loading" :pagination="pagination">
        <div slot="header">
            <el-form-item v-if="reqRuleAttr.btn.add">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addReqRule">添加</el-button>
            </el-form-item>
        </div>
        <div slot="body">
            <ReqRuleList ref="reqReluLists" :page="pagination.page" :req-rule-attr="reqRuleAttr" :user-info="userInfo" @setPagination="setPagination" @updateReqRule="updateReqRule"></ReqRuleList>
        </div>
        <div slot="dialog">
            <ReqRuleEdit ref="reqRuleEdit" :sync-visible="syncVisible" :form="form" :req-rule-attr="reqRuleAttr" @closeDialogEvent="closeDialogEvent"></ReqRuleEdit>
        </div>
    </BaseLayout>
</template>

<script>
    import $url from '../api/url'
    import func from '../api/func'
    import {mapGetters} from 'vuex'
    import BaseLayout from './BaseLayout'
    import ReqRuleList from '../components/reqRule/List'
    import ReqRuleEdit from '../components/reqRule/Edit'
    export default {
        name: 'ReqRuleManage',
        components: {ReqRuleEdit, ReqRuleList, BaseLayout},
        data () {
            return {
                syncVisible: false,
                loading: false,
                reFrom: 'created',
                form: {},
                reqRuleAttr: {
                    cgi: { remove: $url.reqRuleDelete, status: $url.reqRuleUpdate, update: $url.reqRuleUpdate, insert: $url.reqRuleSave },
                    url: '',
                    btn: {}
                },
                pagination: { page: 1, limit: 30, total: 0, page_loading: false }
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        mounted () {
            this.$nextTick(function () {
                this.reqRuleAttr.btn = func.setBtnStatus(this.$route.path, this.$route.name, this.userInfo.auth)
            })
        },
        methods: {
            /**
             * todo:设置页码
             */
            setPagination: function (pagination) {
                this.pagination = pagination
                this.loading = pagination.page_loading
            },
            /**
             * todo:页面转换
             * @param page
             */
            currentPageChange: function (page) {
                this.pagination.page = page
            },
            /**
             * todo：权限申请
             */
            addReqRule: function () {
                this.syncVisible = true
                this.form = { user_id: this.userInfo.user_id, href: [], desc: '', expires: '', status: 1, username: this.userInfo.username }
                this.$refs['reqRuleEdit'].getAuth(this.userInfo.user_id)
                this.reqRuleAttr.url = this.reqRuleAttr.cgi.insert
                this.reFrom = 'created'
            },

            /**
             * todo：权限续期
             * @param item
             */
            updateReqRule: function (item) {
                this.syncVisible = true
                this.form = item
                this.$refs['reqRuleEdit'].getAuth(item.user_id)
                this.form.href = [this.form.href]
                this.ruleLists = this.form.ruleLists
                this.reqRuleAttr.url = this.reqRuleAttr.cgi.update
                this.reFrom = 'update'
            },
            /**
             * todo:弹框关闭
             * @param action
             */
            closeDialogEvent: function (action) {
                this.syncVisible = false
                if (action === 'save') {
                    this.$refs['reqReluLists'].GetLists(this.pagination.page, this.pagination.limit)
                }
            }
        }
    }
</script>

<style scoped>

</style>
