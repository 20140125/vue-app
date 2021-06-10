<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <!--头部信息-->
        <el-form :inline="true" style="margin-top: 10px">
            <slot name="header"></slot>
        </el-form>
        <!--主题信息-->
        <el-main>
            <slot name="body"></slot>
            <div style="margin-top: 20px" v-if="T_pagination.show_page">
                <el-pagination
                    @current-change="__currentChange"
                    :page-size="T_pagination.limit"
                    layout="total, prev, pager, next, jumper"
                    :total="T_pagination.total"
                    :current-page="T_pagination.page">
                </el-pagination>
            </div>
        </el-main>
        <!--弹框信息-->
        <slot name="dialog"></slot>
    </div>
</template>

<script>
    export default {
        name: 'BaseLayout',
        props: {
            /* loading 加载 */
            loading: {
                type: Boolean,
                default: () => false
            },
            /* 菜单名称 */
            menuName: {
                type: String,
                default: () => '微信支付有优惠'
            },
            /* 数据分页 */
            pagination: {
                type: Object,
                default: () => {}
            }
        },
        watch: {
            pagination: function () {
                this.T_pagination = this.pagination
            }
        },
        data () {
            return {
                loadingText: '数据加载中...',
                T_pagination: this.pagination || { limit: 10, page: 1, total: 0, show_page: false, page_loading: false }
            }
        },
        methods: {
            /**
             * todo:页码切换
             * @param page
             * @private
             */
            __currentChange: function (page) {
                this.$parent.currentPageChange(page)
            }
        }
    }
</script>

<style scoped>

</style>
