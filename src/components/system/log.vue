<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-table :data="logLists" border>
            <el-table-column label="#" prop="id"></el-table-column>
            <el-table-column label="执行人" prop="username"></el-table-column>
            <el-table-column label="日志信息" prop="log" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="地址" prop="ip_address"></el-table-column>
            <el-table-column label="创建时间" sortable prop="created_at"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <Delete :url="cgi.remove" :func="functions" :item="scope.row" :index="scope.$index" :Lists="logLists" v-on:success="success"></Delete>
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
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    import func from '../../api/func'
    import Delete from "../common/Delete";
    export default {
        name: "log",
        components: {Delete},
        data(){
            return {
                logLists:[],
                page:1,
                limit:15,
                total:0,
                functions:func,

                labelWidth:'80px',
                loading:true,
                loadingText:'玩命加载中。。。',

                cgi:{
                    remove:$url.logDelete,
                },
                rules:{},
            }
        },
        methods:{
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.getLogLists(this.page,this.limit);
            },
            /**
             * todo：获取日志列表
             * @param page
             * @param limit
             */
            getLogLists:function (page,limit) {
                let params = { page:page, limit:limit };
                apiLists.LogLists(params).then(response=>{
                    if (response && response.data.code === 200){
                        this.logLists = response.data.item.data;
                        this.total = response.data.item.total;
                        this.loading = false;
                    }
                });

            },
            /**
             * todo：每页记录数
             * @param val
             */
            sizeChange:function(val){
                this.limit = val;
                this.getLogLists(this.page,this.limit)
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange:function(val){
                this.page = val;
                this.getLogLists(this.page,this.limit)
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getLogLists(this.page,this.limit);
            });
        }
    }
</script>

<style scoped>

</style>
