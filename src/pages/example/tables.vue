<template>
    <TableComponent :tableData="tableData" :columns="columns" :search-options="searchOptions" :search-option="searchOption" @search="getResource" @removeSuccess="removeSuccess"/>
</template>

<script>
    import TableComponent from '../../components/common/table'
    import apiLists from '../../api/api'
    export default {
        name: 'table-example',
        components: {TableComponent},
        data () {
            return {
                // 数据表字段
                columns: [],
                // 表格数据
                tableData: [],
                // 检索组件
                searchOptions: [],
                // 检索字段
                searchOption: {},
                // 请求参数
                params: {table: 'os_users', lan: 'zh'}
            }
        },
        methods: {
            /**
             * TODO:获取数据
             */
            getResource: function (params) {
                apiLists.TableComponents(params).then(response => {
                    this.columns = response.data.item.columns
                    this.tableData = response.data.item.data
                    this.searchOptions = response.data.item.searchOptions
                    for (let i in response.data.item.searchOption) {
                        this.searchOption[i] = response.data.item.searchOption[i]
                    }
                })
            },
            removeSuccess: function () {
                this.getResource(this.params)
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.getResource(this.params)
            })
        }
    }
</script>

<style scoped>

</style>
