<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-row :gutter="24">
            <el-col :xl="8" :lg="8">
                <el-tabs type="border-card">
                    <el-tab-pane label="个人简介"></el-tab-pane>
                    <el-form id="information">
                        <el-form-item style="text-align: center">
                            <el-avatar :src="userInfo.avatar_url" :size="100" :alt="userInfo.username"></el-avatar>
                        </el-form-item>
                        <el-form-item>
                            <i class="el-icon-user"></i> <span v-html="userCenter.u_name"></span>
                        </el-form-item>
                        <el-form-item>
                            <i class="el-icon-message"></i> <span v-html="userCenter.email"></span>
                        </el-form-item>
                        <el-form-item>
                            <i class="el-icon-location-information"></i> <span v-html="setLocal(userCenter.local)"></span>
                        </el-form-item>
                        <el-form-item>
                            <i class="el-icon-aim"></i> <span v-html="userCenter.desc"></span>
                        </el-form-item>
                        <el-form-item>
                            <i class="el-icon-collection-tag"></i>
                            <el-tag style="margin-right: 5px" :key="tag" v-for="tag in userCenter.tags"  effect="plain" type="success">{{tag}}</el-tag>
                        </el-form-item>
                    </el-form>
                </el-tabs>
            </el-col>
            <el-col :xl="16" :lg="16">
                <el-tabs type="border-card">
                    <el-tab-pane label="信息展示"></el-tab-pane>
                        <el-form :model="userCenter" label-width="100px" style="margin-left: 20px" label-position="left" ref="center" :rules="rules">
                            <el-form-item label="头像：" id="avatar" style="display: flex;align-items: center;position: relative;" required>
                                <el-avatar :src="userInfo.avatar_url" :size="100" :alt="userInfo.username"></el-avatar>
                            </el-form-item>
                            <el-form-item label="用户名：" prop="u_name">
                                <el-input v-model="userCenter.u_name" readonly placeholder="用户名"></el-input>
                            </el-form-item>
                            <el-form-item label="居住地址：" prop="local">
                                <el-cascader :props="props" :options="options" filterable v-model="userCenter.local" style="width: 100%"/>
                            </el-form-item>
                            <el-form-item label="所在地：" prop="ip_address">
                                <el-cascader :props="props" :options="options" filterable v-model="userCenter.ip_address" style="width: 100%"></el-cascader>
                            </el-form-item>
                            <el-form-item label="座右铭：" prop="desc">
                                <el-input type="textarea" resize="none" rows="3" show-word-limit maxlength="32" v-model="userCenter.desc" placeholder="这个人很懒，什么也没有留下"></el-input>
                            </el-form-item>
                            <el-form-item label="个人标签：" prop="tags">
                                <el-tag style="margin-left: 10px" :key="tag" v-for="tag in userCenter.tags" closable :disable-transitions="false" @close="handleClose(tag)">
                                    {{tag}}
                                </el-tag>
                                <el-input style="width: 100px;" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
                                <el-button style="margin-right: 5px" v-else size="small" @click="showInput">+ New Tag</el-button>
                            </el-form-item>
                            <el-form-item label="站内通知：" prop="notice_status">
                                <el-tooltip effect="dark" content="系统性的通知或者更新消息" placement="top-start">
                                    <el-switch active-value="1" inactive-value="2" v-model="userCenter.notice_status"></el-switch>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item label="账号信息：" prop="user_status">
                                <el-tooltip effect="dark" content="帐号变更的通知消息" placement="top-start">
                                    <el-switch active-value="1" inactive-value="2" v-model="userCenter.user_status"></el-switch>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item style="text-align: center">
                                <Submit :reFrom="reFrom" :url="url" :model="userCenter" :refs="refs"></Submit>
                            </el-form-item>
                        </el-form>
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
                props:{ value:'name', label:'name' }
            }
        },
        computed:{
            ...mapGetters(['userInfo'])
        },
        methods:{
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
            /**
             * TODO:设置地址显示
             */
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
                    if ((this.userCenter.tags.length+1)>3) {
                        this.$message.warning('User tags must not exceed three');
                        return ;
                    }
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
                apiLists.AreaLists({parent_id:pid},$url.areaLists).then((response)=>{
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
<style>
#information .el-form-item {
    margin-bottom: 0!important;
}
#information .el-form-item__content>i {
    font-size: 16px;
}
</style>
