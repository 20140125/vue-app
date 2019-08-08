<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addReqRule">添 加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="reqRuleLists" border>
            <el-table-column label="#" prop="id" width="120px"></el-table-column>
            <el-table-column label="申请人" prop="username" width="150px"></el-table-column>
            <el-table-column label="授权地址" prop="href"></el-table-column>
            <el-table-column label="授权状态" width="150px">
                <template slot-scope="scope">
                    <Radio :item="scope.row" :url="cgi.status" v-on:success="success"></Radio>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="created_at"> </el-table-column>
            <el-table-column label="修改时间" prop="updated_at"></el-table-column>
            <el-table-column label="权限时效" prop="expires"></el-table-column>
            <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                    <el-button type="primary" v-if="scope.row.status === 1" plain icon="el-icon-plus" size="mini" @click="updateReqRule(scope.row)">续 期</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="reqRuleLists" v-on:success="success"></Delete>
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
        <el-dialog :title="title" :visible.sync="syncVisible" :modal="modal" :center="center" :destroy-on-close="destroy_on_close">
            <el-form :label-width="labelWidth" :model="reqRuleModel" :ref="reFrom" :rules="rules">
                <el-form-item label="申请人" prop="username">
                    <el-input v-model="reqRuleModel.username"></el-input>
                </el-form-item>
                <el-form-item label="授权地址" prop="href">
                    <el-input v-model="reqRuleModel.href"></el-input>
                </el-form-item>
                <el-form-item label="授权时间" prop="expires">
                    <el-date-picker v-model="reqRuleModel.expires" type="datetime" placeholder="选择授权时间" style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item label="授权说明" prop="desc">
                    <el-input v-model="reqRuleModel.desc" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="reqRuleModel" :url="url" :refs="refs" v-on:success="success"></Submit>
            </div>
        </el-dialog>
        <!---弹框-->
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    import func from '../../api/func'
    import Radio from "../common/Radio";
    import Delete from "../common/Delete";
    import Submit from "../common/Submit";
    import {mapGetters} from 'vuex';
    export default {
        name: "lists",
        components: {Submit, Delete, Radio},
        data(){
            return {
                reqRuleLists:[],
                page:1,
                limit:15,
                total:0,

                title:'',
                syncVisible:false, //是否显示弹框
                modal:true, //遮盖层是否需要
                labelWidth:'80px',
                loading:true,
                destroy_on_close:true,
                center:true,
                loadingText:'玩命加载中。。。',

                url:'',
                refs:this.$refs,
                reFrom:'reqRule',

                reqRuleModel:{},

                cgi:{
                    remove:$url.reqRuleDelete,
                    status:$url.reqRuleUpdate,
                    update:$url.reqRuleUpdate
                },
                rules:{
                    username:[{required:true,message:'申请人不得为空',trigger:'blur'}],
                    href:[{required:true,message:'授权地址不得为空',trigger:'change'}],
                    expires: [{required:true,message:'授权时效不得为空',trigger:'change'}],
                    desc:[{required:true,message:'申请理由不得为空',trigger:'blur'}]
                },
            }
        },
        computed:{
            ...mapGetters(['username'])
        },
        methods:{
            /**
             * todo：关闭弹框
             */
            success:function(){
                this.syncVisible = false;
                this.getReqRuleLists(this.page,this.limit)
            },
            /**
             * todo：设置时间
             * @param timestamp
             */
            setTimes:function(timestamp){
                return func.set_time(timestamp*1000);
            },
            /**
             * todo：获取角色列表
             * @param page
             * @param limit
             */
            getReqRuleLists:function (page,limit) {
                let params = { page:page,limit:limit };
                apiLists.ReqRuleLists(params).then(response=>{
                    if (response && response.data.code === 200){
                        this.loading = false;
                        this.reqRuleLists = response.data.item.data;
                        this.total = response.data.item.total;
                    }
                });
            },
            /**
             * todo：每页记录数
             * @param val
             */
            sizeChange:function(val){
                this.limit = val;
                this.getReqRuleLists(this.page,this.limit)
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange:function(val) {
                this.page = val;
                this.getReqRuleLists(this.page,this.limit)
            },
            addReqRule:function() {
                this.title='权限申请';
                this.syncVisible = true;
                this.reqRuleModel = {
                    username:this.username,
                    href:'',
                    desc:'',
                    expires:''
                };
                this.url = this.cgi.insert;
            },
            /**
             * todo：修改
             * @param item
             */
            updateReqRule:function (item) {
                this.title='权限续期';
                this.syncVisible = true;
                this.reqRuleModel = item;
                this.url = this.cgi.update;
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getReqRuleLists(this.page,this.limit)
            });
        }
    }
</script>

<style scoped>

</style>
