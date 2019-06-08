<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-table :data="databaseLists" border>
            <el-table-column label="表名" prop="name"></el-table-column>
            <el-table-column label="版本号" prop="version"></el-table-column>
            <el-table-column label="引擎" prop="engine"></el-table-column>
            <el-table-column label="数据表大小" prop="data_length"></el-table-column>
            <el-table-column label="自增量" prop="auto_increment"></el-table-column>
            <el-table-column label="字符集编码" prop="collation"></el-table-column>
            <el-table-column label="备注" prop="comment"></el-table-column>
            <el-table-column label="创建时间" sortable prop="create_time"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="updateAuth(scope.row)">备 份</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    export default {
        name: "lists",
        data(){
            return {
                databaseLists:[],
                labelWidth:'80px',
                loading:true,
                loadingText:'玩命加载中。。。',

                cgi:{

                },
            }
        },
        methods:{
            /**
             * todo：获取角色列表
             */
            getDatabaseLists:function () {
                apiLists.DatabaseLists([]).then(response=>{
                    if (response.data.code === 200){
                        this.databaseLists = response.data.item;
                        this.loading = false;
                    }
                });
            },
        },
        mounted() {
            this.$nextTick(function () {
                this.getDatabaseLists()
            });
        }
    }
</script>

<style scoped>

</style>
