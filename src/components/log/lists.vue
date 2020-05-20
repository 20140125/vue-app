<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-table :data="logLists.filter(data=>(!search || data.username.toLowerCase().includes(search.toLowerCase())
        || data.ip_address.includes(search.toLowerCase()) || data.log.includes(search.toLowerCase()) ))">
            <el-table-column label="#" prop="id" sortable width="100px"/>
            <el-table-column label="执行人" prop="username" sortable width="150px"/>
            <el-table-column label="日志信息" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-link type="success" :href="scope.row.url" target="_blank">[{{scope.row.url}}]</el-link>　{{scope.row.log}}　
                </template>
            </el-table-column>
            <el-table-column label="地址" width="200px" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{scope.row.local}}【{{scope.row.ip_address}}】
                </template>
            </el-table-column>
            <el-table-column label="创建时间" sortable prop="created_at" width="200px"/>
            <el-table-column label="操作" align="right" width="200px">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" placeholder="请输入关键字查询"/>
                </template>
                <template slot-scope="scope">
                    <Delete v-if="btn.del" :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="logLists"
                            v-on:success="success"/>
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
    import Delete from "../common/Delete";
    import func from '../../api/func';
    import {mapGetters} from 'vuex';
    export default {
        name: "log",
        components: {Delete},
        data(){
            return {
                logLists:[],
                page:1,
                limit:15,
                total:0,
                search:'',
                loading:true,
                loadingText:'玩命加载中。。。',
                cgi:{
                    remove:$url.logDelete,
                },
                btn:{},
            }
        },
        computed:{
            ...mapGetters(['userInfo'])
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
                apiLists.LogLists({ page:page, limit:limit }).then(response=>{
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
                this.btn = func.set_btn_status(this.$route.path,this.$route.name,this.userInfo.auth);
                this.getLogLists(this.page,this.limit);
            });
        }
    }
</script>

<style scoped>

</style>
