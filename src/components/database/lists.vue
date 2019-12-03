<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-table :data="databaseLists.filter(data=>(!search || data.name.toLowerCase().includes(search.toLowerCase())))">
            <el-table-column label="表名" prop="name" width="150"/>
            <el-table-column label="版本号" prop="version" width="100"/>
            <el-table-column label="引擎" prop="engine" width="100"/>
            <el-table-column label="数据表大小" prop="data_length" sortable width="120"/>
            <el-table-column label="自增量" prop="auto_increment" sortable width="100"/>
            <el-table-column label="字符集编码" prop="collation"/>
            <el-table-column label="备注">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.comment" :id="scope.row.name" ref="comment"
                              v-if="scope.row.name === name && edit" placeholder="请输入数据表备注"/>
                    <div v-html="scope.row.comment" v-else></div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" sortable prop="create_time"/>
            <el-table-column width="350px" align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" placeholder="输入关键词查询"/>
                </template>
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button round type="primary" plain size="small" @click="updateComment(scope.row)" icon="el-icon-edit-outline"
                                   v-if="scope.row.name === name && edit && btn.comment">更 新</el-button>
                        <el-button round type="primary" plain size="small" @click="setComment(scope.row)" icon="el-icon-edit"
                                   v-else-if="btn.comment">修 改</el-button>
                        <el-button round type="primary" v-if="btn.backup" plain size="small" @click="backup(scope.row)">备 份</el-button>
                        <el-button round type="primary" v-if="btn.repair" plain size="small" @click="repair(scope.row)">修 复</el-button>
                        <el-button round type="primary" v-if="btn.optimize" plain size="small" @click="optimize(scope.row)">优 化</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import func from '../../api/func'
    import {mapActions} from 'vuex'
    export default {
        name: "lists",
        data(){
            return {
                databaseLists:[],
                labelWidth:'80px',
                loading:true,
                loadingText:'玩命加载中。。。',
                edit:false,
                name:'',
                search:'',
                //细化权限按钮
                btn:{}
            }
        },
        methods:{
            ...mapActions(['saveSystemLog']),
            /**
             * TODO：获取角色列表
             */
            getDatabaseLists:function () {
                apiLists.DatabaseLists([]).then(response=>{
                    if (response && response.data.code === 200){
                        this.databaseLists = response.data.item;
                        this.loading = false;
                    }
                });
            },
            /**
             * TODO：数据表备份
             * @param databaseObject
             * @constructor
             */
            backup:function (databaseObject) {
                this.loading = true;
                this.edit = false;
                apiLists.DatabaseBackup(databaseObject).then(response=>{
                    if (response && response.data.code === 200) {
                        setTimeout(()=>{ this.loading = false;this.$message({type:'success',message:response.data.msg}) },response.data.item.times)
                        let data = {href:response.config.url, msg:response.data.msg, token:this.$store.state.login.token};
                        this.saveSystemLog(data);
                    }
                })
            },
            /**
             * TODO：设置
             * @param databaseObject
             */
            setComment:function(databaseObject) {
                this.name = databaseObject.name;
                this.edit = true;
            },
            /**
             * TODO：修改注释
             * @param databaseObject
             */
            updateComment:function(databaseObject) {
                if (!databaseObject.comment) {
                    this.$message.warning('请输入数据表备注');
                    this.$refs['comment'].focus();
                    return false;
                }
                this.loading = true;
                apiLists.DatabaseUpdateComment(databaseObject).then(response=>{
                    if (response && response.data.code === 200){
                        this.loading = false;
                        this.$message({type:'success',message:response.data.msg});
                        this.edit = false;
                        this.name = '';
                        let data = {href:response.config.url, msg:response.data.msg, token:this.$store.state.login.token};
                        this.saveSystemLog(data);
                    }
                });
            },
            /**
             * TODO：数据表修复
             * @param databaseObject
             * @constructor
             */
            repair:function (databaseObject) {
                this.loading = true;
                this.edit = false;
                apiLists.DatabaseRepair(databaseObject).then(response=>{
                    if (response && response.data.code === 200) {
                        this.loading = false;
                        this.$message({type:'success',message:response.data.msg});
                        let data = {href:response.config.url, msg:response.data.msg, token:this.$store.state.login.token};
                        this.saveSystemLog(data);
                    }
                })
            },
            /**
             * TODO：数据表优化
             * @param databaseObject
             * @constructor
             */
            optimize:function (databaseObject) {
                this.loading = true;
                this.edit = false;
                apiLists.DatabaseOptimize(databaseObject).then(response=>{
                    if (response && response.data.code === 200) {
                        this.loading = false;
                        this.$message({type:'success',message:response.data.msg});
                        let data = {href:response.config.url, msg:response.data.msg, token:this.$store.state.login.token};
                        this.saveSystemLog(data);
                    }
                })
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.btn = func.set_btn_status(this.$route.path,this.$route.name,this.$store.state.login.auth_url);
                this.getDatabaseLists()
            });
        }
    }
</script>

<style scoped>
</style>
