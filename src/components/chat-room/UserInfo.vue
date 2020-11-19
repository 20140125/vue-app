<template>
    <div :id="id">
        <el-dialog :visible.sync="visible" :title="userInfo.client_name" :width="userInfoDialogWidth" center id="userInfo" @close="closeDialog" :show-close="false" :style="transformStyle">
            <div slot="title" style="display: flex;align-items: center;position: relative;">
                <el-avatar :src="userInfo.client_img" :size="50" fit="fill" :alt="userInfo.client_name"></el-avatar>
                <div>
                    <div v-html="userInfo.client_name" style="margin-left: 10px;text-align: left;color: #fff"></div>
                    <div slot="title" v-html="userInfo.desc" style="margin-left: 10px;color:#fff"></div>
                </div>
            </div>
            <el-row :gutter="24">
                <el-col :xl="{'span':22,'offset':1}" :lg="{'span':22,'offset':1}" :md="{'span':22,'offset':1}" :sm="{'span':22,'offset':1}" :xs="{'span':22,'offset':1}" class="userInfo">
                    <el-form :model="userInfo" label-width="56px" label-position="left">
                        <el-form-item label="账号：">
                            <span v-html="userInfo.uid"></span>
                        </el-form-item>
                        <el-form-item label="简介：">
                            <span v-html="userInfo.desc"></span>
                        </el-form-item>
                        <el-form-item label="户籍：">
                            <span v-html="userInfo.local"></span>
                        </el-form-item>
                        <el-form-item label="住址：">
                            <span v-html="userInfo.ip_address"></span>
                        </el-form-item>
                        <el-form-item label="标签：">
                            <el-tag style="margin-right: 5px" effect="plain" type="success" v-for="(tags,index) in userInfo.tags" :key="index">{{tags}}</el-tag>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'UserInfo',
        props: {
            userInfoVisible: {
                type: Boolean,
                default: () => false
            },
            userInfo: {
                type: [Object, Array],
                default: () => {}
            },
            closeDialog: {
                type: Function | Boolean
            },
            dialogWidth: {
                type: String,
                default: () => '40%'
            },
            id: {
                type: String,
                default: () => 'userInfo'
            }
        },
        data () {
            return {
                visible: this.userInfoVisible,
                userInfoDialogWidth: this.dialogWidth,
                randomNum: 0,
                transformStyle: {}
            }
        },
        watch: {
            userInfoVisible: function () {
                this.visible = this.userInfoVisible
                this.userInfoDialogWidth = (parseInt(this.dialogWidth.replace('%', '')) - 15) + '%'
                this.getUserInfo()
            }
        },
        created () {
            this.userInfoDialogWidth = (parseInt(this.dialogWidth.replace('%', '')) - 15) + '%'
            this.randomNum = Math.ceil(Math.random() * 5 | 0)
            this.transformStyle = { transform: 'rotate(' + this.randomNum + 'deg)' }
        },
        methods: {
            /**
             * todo:获取用户信息
             */
            getUserInfo: function () {
                this.userInfo.desc = this.userInfo.centerInfo.desc || ''
                this.userInfo.tags = JSON.parse(this.userInfo.centerInfo.tags) || ''
                this.userInfo.ip_address = this.setLocal(JSON.parse(this.userInfo.centerInfo.ip_address)) || ''
                this.userInfo.local = this.setLocal(JSON.parse(this.userInfo.centerInfo.local)) || ''
            },
            /**
             * TODO:设置地址显示
             */
            setLocal: function (item) {
                if (item.length > 0) {
                    let str = item.join(',')
                    return str.replace(new RegExp(/,/g), ' / ')
                }
                return item
            }
        }
    }
</script>

<style lang="less">
#userInfo {
    .el-dialog__body{
        position: relative;
        overflow: hidden;
        background-size: contain;
        background-position: right;
        background-image: url('../../assets/default.jpg');
        background-repeat: no-repeat;
        padding-left: 0 !important;
    }
    .el-form-item {
        margin-bottom: 0!important;
    }
    .el-form-item__content{
        margin-left: 0 !important;
    }
    .el-dialog__header{
        background: #409EFF;
    }
    .clearfix {
        text-align: center;
        color: #000000;
        font-size: 20px;
    }
    .clearfix:before, .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    //.el-row{
    //    line-height: 40px;
    //    .userInfo{
    //        div{
    //            display: flex;
    //            align-items: center;
    //            position: relative;
    //            color: #000;
    //        }
    //    }
    //}
}
</style>
