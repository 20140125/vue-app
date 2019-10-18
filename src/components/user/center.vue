<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-row :gutter="24">
            <el-col :xl="6" :lg="6">
                <el-card shadow="always">
                    <div style="text-align: center">
                        <el-avatar :src="avatarUrl" :size="100" :alt="username"></el-avatar>
                        <div v-html="userCenter.u_name"></div>
                    </div>
                    <div class="message">
                        <p><i class="el-icon-message"> </i> {{userCenter.email}} </p>
                        <p><i class="el-icon-location-information" > </i> {{setLocal(userCenter.local)}} </p>
                        <p><i class="el-icon-aim" > </i> {{userCenter.desc}} </p>
                        <p>个人标签：
                            <el-tag style="margin-left: 10px" :key="tag" v-for="tag in userCenter.tags">
                                {{tag}}
                            </el-tag>
                        </p>
                    </div>
                </el-card>
            </el-col>
            <el-col :xl="18" :lg="18">
                <el-tabs type="border-card">
                    <el-tab-pane label="基础设置"></el-tab-pane>
                    <el-card shadow="always">
                        <el-form :model="userCenter" label-width="80px" label-position="left" ref="center" :rules="rules">
                            <el-form-item label="头像" prop="avatarUrl">
                                <el-tooltip effect="dark" content="用户头像修改请移步至用户列表" placement="top-start">
                                    <Upload :avatar_url="userCenter.avatarUrl" :username="username" @uploadSuccess="uploadSuccess"></Upload>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item label="用户名" prop="u_name">
                                <el-input v-model="userCenter.u_name" placeholder="用户名"/>
                            </el-form-item>
                            <el-form-item label="账户类型" prop="u_type">
                                <el-select v-model="userCenter.u_type.toString()" style="width: 100%">
                                    <el-option label="授权用户" value="1"></el-option>
                                    <el-option label="管理员" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="居住地址" prop="local">
                                <el-cascader :props="props" :options="options" filterable v-model="userCenter.local" style="width: 100%"></el-cascader>
                            </el-form-item>
                            <el-form-item label="所在地" prop="ip_address">
                                <el-cascader :props="props" :options="options" filterable v-model="userCenter.ip_address" style="width: 100%"></el-cascader>
                            </el-form-item>
                            <el-form-item label="座右铭" prop="desc">
                                <el-input type="textarea" resize="none" rows="4" show-word-limit maxlength="128" v-model="userCenter.desc" placeholder="这个人很懒，什么也没有留下"/>
                            </el-form-item>
                            <el-form-item label="个人标签" prop="tags">
                                <el-tag style="margin-left: 10px" :key="tag" v-for="tag in userCenter.tags" closable :disable-transitions="false" @close="handleClose(tag)">
                                    {{tag}}
                                </el-tag>
                                <el-input style="width: 100px;" v-if="inputVisible"
                                          v-model="inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm"
                                    @blur="handleInputConfirm">
                                </el-input>
                                <el-button style="margin-right: 5px" v-else size="small" @click="showInput">+ New Tag</el-button>
                            </el-form-item>
                            <el-form-item label="站内通知" prop="notice_status">
                                <el-tooltip effect="dark" content="系统性的通知或者更新消息" placement="top-start">
                                    <el-switch active-value="1" inactive-value="2" v-model="userCenter.notice_status"></el-switch>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item label="账号信息" prop="user_status">
                                <el-tooltip effect="dark" content="帐号变更的通知消息" placement="top-start">
                                    <el-switch active-value="1" inactive-value="2" v-model="userCenter.user_status"></el-switch>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item style="text-align: center">
                                <Submit :reFrom="reFrom" :url="url" :model="userCenter" :refs="refs"></Submit>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    import Upload from '../common/Upload'
    import {mapGetters} from 'vuex'
    import Submit from '../common/Submit'
    export default {
        name: "lists",
        components: {Submit, Upload},
        data(){
            return {
                loading:true,
                loadingText:'玩命加载中。。。',

                userCenter:{
                    avatarUrl:'',
                    u_name:'',
                    local:[],
                    ip_address:[],
                    notice_status:'',
                    user_status:'',
                    desc:'',
                    tags:[],
                    u_type:''
                },
                reFrom:'center',
                refs:this.$refs,
                url:$url.saveUserCenter,

                fileData:{},
                headers:{},
                cgi:{
                    save:''
                },
                rules:{
                    avatarUrl:[{required:true,message:'用户头像不得为空',trigger:'change'}],
                    u_name:[{required: true,message:'用户名称不得为空',trigger:'blur'}],
                    u_type:[{required: true,message:'账户类型不得为空',trigger:'blur'}],
                    local:[{required: true,message:'居住地址不得为空',trigger:'change'}],
                    ip_address:[{required: true,message:'用户地址不得为空',trigger:'change'}],
                    desc:[{required: true,message:'个人介绍不得为空',trigger:'blur'}],
                    tags:[{required: true,message:'用户标签不得为空',trigger:'blur'}],
                    notice_status:[{required: true,message:'站内通知',trigger:'change'}],
                    user_status:[{required: true,message:'账号信息',trigger:'change'}]
                },
                inputVisible: false,
                inputValue: '',

                pid:1,
                options:[],
                props:{
                    value:'name',
                    label:'name'
                }
            }
        },
        computed:{
            ...mapGetters(['username','avatarUrl'])
        },
        methods:{
            /**
             * TODO:图表上传成功
             * @param src
             */
            uploadSuccess:function (src) {
                this.userCenter.avatarUrl = src;
            },
            /**
             * TODO:关闭标签
             * @param tag
             */
            handleClose(tag) {
                this.userCenter.tags.splice( this.userCenter.tags.indexOf(tag), 1);
            },
            /**
             * TODO:展示文本框
             */
            showInput:function() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.focus();
                });
            },
            setLocal:function(item) {
                if (item.length>0) {
                    let str = item.join(',');
                    return str.replace(new RegExp(/,/g),' / ')
                }
                return item;
            },
            /**
             * TODO:文本框输入
             */
            handleInputConfirm:function() {
                let inputValue = this.inputValue;
                if (inputValue && this.userCenter.tags.indexOf(inputValue)<0) {
                    this.userCenter.tags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            /**
             * TODO：获取城市列表
             * @param pid
             */
            getCity:function(pid) {
                apiLists.AreaLists({parent_id:pid},$url.areaLists).then(response=>{
                    if (response && response.data.code === 200) {
                        this.setOptions(response.data.item);
                    }
                });
            },
            /**
             * TODO:设置数据
             * @param data
             */
            setOptions:function(data) {
                for (let i in data) {
                    if (data[i].children.length === 0) {
                        delete data[i].children
                    }
                    this.setOptions(data[i].children)
                }
                this.options = data;
            },
            /**
             * TODO:获取用户信息
             */
            getUserCenter:function() {
                this.loading = true;
                apiLists.UserCenter([]).then(response=>{
                    if (response && response.data.code === 200) {
                        this.loading = false;
                        this.userCenter = response.data.item;
                        this.userCenter.avatarUrl = this.avatarUrl;
                        this.userCenter.user_status = this.userCenter.user_status.toString();
                        this.userCenter.notice_status = this.userCenter.notice_status.toString();
                        this.getCity(this.pid);
                    }
                })
            },
            /**
             * TODO:表单重置
             * @param form
             */
            resetForm:function (form) {
                this.$refs[form].resetFields();
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getUserCenter();
            });
        }
    }
</script>

<style scoped>
    .message>p{
        line-height: 25px;
    }
    .message>p>i {
        font-size: 20px;
        margin-right: 10px;
    }
</style>
