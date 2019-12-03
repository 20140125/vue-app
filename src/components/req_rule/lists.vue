<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px" v-if="btn.add">
            <el-form-item style="float:right;">
                <el-button icon="el-icon-plus" type="primary" size="medium" plain @click="addReqRule">添 加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="reqRuleLists.filter(data=>(!search || data.username.toLowerCase().includes(search.toLowerCase()) || data.href.includes(search.toLowerCase())))" border>
            <el-table-column label="#" prop="id" width="120px" sortable/>
            <el-table-column label="申请人" prop="username" width="150px"/>
            <el-table-column label="授权地址" prop="href"/>
            <el-table-column label="授权状态" width="150px" v-if="username === 'admin'">
                <template slot-scope="scope">
                    <Radio :item="scope.row" :url="cgi.status" v-on:success="success"/>
                </template>
            </el-table-column>
            <el-table-column label="授权状态" width="150px" v-if="username !== 'admin'">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status === 1" type="success" size="mini">已授权</el-button>
                    <el-button v-if="scope.row.status === 2" type="info" size="mini">未授权</el-button>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="created_at" sortable/>
            <el-table-column label="修改时间" prop="updated_at" sortable/>
            <el-table-column label="权限时效" prop="expires" sortable/>
            <el-table-column label="操作" width="200px" align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" placeholder="请输入关键字查询"/>
                </template>
                <template slot-scope="scope">
                    <el-button type="primary" v-if="scope.row.status === 1 && btn.edit" plain icon="el-icon-plus" size="mini" @click="updateReqRule(scope.row)">续 期</el-button>
                    <Delete :url="cgi.remove" :item="scope.row" :index="scope.$index" :Lists="reqRuleLists" v-on:success="success" v-if="btn.del"/>
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
                    <el-select filterable style="width: 100%" v-model="reqRuleModel.username" @change="getAuth">
                        <el-option v-for="(user,index) in userLists" :label="user.username" :key="index"
                                   :value="user.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="授权地址" prop="href" v-if="href">
                    <el-select multiple="multiple" filterable style="width: 100%" v-model="reqRuleModel.href">
                        <el-option v-for="(rule,index) in ruleLists" :label="setAuthName(rule)" :key="index"
                                   :value="rule.href" :disabled="rule.disable"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="授权时间" prop="expires">
                    <el-date-picker v-model="reqRuleModel.expires" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择授权时间"
                                    :picker-options="pickerOptions"
                                    style="width: 100%"/>
                </el-form-item>
                <el-form-item label="授权说明" prop="desc">
                    <el-input v-model="reqRuleModel.desc" type="textarea"/>
                </el-form-item>
                <el-form-item label="是否授权" prop="status" v-if="username==='admin'">
                    <el-radio-group v-model="reqRuleModel.status" size="small">
                        <el-radio-button label="2">否</el-radio-button>
                        <el-radio-button label="1">是</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <Submit :reFrom="reFrom" :model="reqRuleModel" :url="url" :refs="refs" v-on:success="success"/>
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
                ruleLists:[], //权限列表
                userLists:[], //授权用户列表
                page:1,
                limit:15,
                total:0,
                search:'',

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
                    update:$url.reqRuleUpdate,
                    insert:$url.reqRuleSave
                },
                rules:{
                    username:[{required:true,message:'申请人不得为空',trigger:'blur'}],
                    href:[{required:true,message:'授权地址不得为空',trigger:'change'}],
                    expires: [{required:true,message:'授权时效不得为空',trigger:'change'}],
                    desc:[{required:true,message:'申请理由不得为空',trigger:'blur'}],
                    status:[{required:true,message:'授权状态不得为空',trigger:'blur'}]
                },
                href:false,

                //日期快捷键
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    },
                    shortcuts: [{
                        text: '一星期',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一个月',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', date);
                        }
                    },{
                        text: '三个月',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30 * 3);
                            picker.$emit('pick', date);
                        }
                    },{
                        text: '六个月',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30 * 6);
                            picker.$emit('pick', date);
                        }
                    },{
                        text: '一年',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30 * 12);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                //细化权限按钮
                btn:{}
            }
        },
        computed:{
            ...mapGetters(['username','token'])
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
                this.loading = true;
                apiLists.ReqRuleLists(params).then(response=>{
                    if (response && response.data.code === 200){
                        this.reqRuleLists = response.data.item.data;
                        this.total = response.data.item.total;
                        this.userLists = response.data.item.userLists;
                        this.loading = false;
                    }
                });
            },
            /**
             * 设置权限名称
             * @param item
             * @return {String}
             */
            setAuthName:function(item){
                return Array(item.level+1).join('　　')+item.name;
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
            /**
             * todo：权限申请
             */
            addReqRule:function() {
                this.title='权限申请';
                this.syncVisible = true;
                this.reqRuleModel = { username:'', href:'', desc:'', expires:'', status:1 };
                this.url = this.cgi.insert;
                this.href = false;
            },
            /**
             * TODO:获取权限
             */
            getAuth:function(user_id){
                let params = {user_id:user_id}
                apiLists.GetAuthByToken(params).then(response=>{
                    if (response && response.data.code === 200) {
                        this.ruleLists = response.data.item;
                        this.href = true;
                    }
                });
            },
            /**
             * todo：权限续期
             * @param item
             */
            updateReqRule:function (item) {
                this.title='权限续期';
                this.syncVisible = true;
                this.reqRuleModel = item;
                this.reqRuleModel.href = [this.reqRuleModel.href];
                this.ruleLists = this.reqRuleModel.ruleLists
                this.url = this.cgi.update;
                this.href = true;
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.btn = func.set_btn_status(this.$route.path,this.$route.name,this.$store.state.login.auth_url);
                this.getReqRuleLists(this.page,this.limit)
            });
        }
    }
</script>

<style scoped>

</style>
