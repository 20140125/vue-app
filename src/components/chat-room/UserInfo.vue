<template>
    <div :id="id">
        <el-dialog :visible.sync="visible" :title="userInfo.client_name" :width="userInfoDialogWidth" center id="userInfo" @close="closeDialog" :show-close="false"
                   :style="transformStyle">
            <div slot="title" style="display: flex;align-items: center;position: relative;">
                <el-avatar :src="userInfo.client_img" :size="50" fit="fill" :alt="userInfo.client_name"/>
                <div>
                    <div v-html="userInfo.client_name" style="margin-left: 10px;text-align: left;color: #fff"/>
                    <div slot="title" v-html="userInfo.desc" style="margin-left: 10px;color:#fff"/>
                </div>
            </div>
            <el-row :gutter="24">
                <el-col :xl="{'span':22,'offset':1}" :lg="{'span':22,'offset':1}" :md="{'span':22,'offset':1}" :sm="{'span':22,'offset':1}" :xs="{'span':22,'offset':1}" class="userInfo">
                    <div>账号：{{userInfo.uid}}</div>
                    <div>描述：{{userInfo.desc}}</div>
                    <div>户籍地：{{userInfo.local}}</div>
                    <div>所在地：{{userInfo.ip_address}}</div>
                    <div>个人标签：
                        <el-button type="primary" plain size="mini" v-for="(tags,index) in userInfo.tags" :key="index">{{tags}}</el-button></div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "UserInfo",
    props:{
        userInfoVisible:{
            type:Boolean,
            default:()=>false
        },
        userInfo:{
            type:[Object,Array],
            default:()=>{},
        },
        closeDialog:{
            type:Function|Boolean,
        },
        dialogWidth:{
            type:String,
            default:()=>'40%'
        },
        randomNum:{
            type:String|Number,
            default:()=>0
        },
        id:{
            type:String,
            default:()=>'userInfo'
        }
    },
    data(){
        return {
            visible:this.userInfoVisible,
            backgroundImgUrl:require('../../assets/default.jpg'),
            userInfoDialogWidth:this.dialogWidth,
            transformStyle:{transform: 'rotate('+this.randomNum+'deg)'}
        }
    },
    watch:{
        userInfoVisible:function () {
            this.visible = this.userInfoVisible;
            this.userInfoDialogWidth = (parseInt(this.dialogWidth.replace('%','')) - 15)+"%";
            this.getUserInfo();
        },
    },
    created() {
        this.userInfoDialogWidth = (parseInt(this.dialogWidth.replace('%','')) - 15)+"%";
    },
    methods:{
        /**
         * todo:获取用户信息
         */
        getUserInfo:function () {
            this.userInfo.desc = this.userInfo.centerInfo.desc || '';
            this.userInfo.tags = JSON.parse(this.userInfo.centerInfo.tags) || '';
            this.userInfo.ip_address = this.setLocal(JSON.parse(this.userInfo.centerInfo.ip_address)) || '';
            this.userInfo.local = this.setLocal(JSON.parse(this.userInfo.centerInfo.local)) || '';
            this.backgroundImgUrl = this.userInfo.client_img
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
    },
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
    .el-row{
        line-height: 40px;
        .userInfo{
            div{
                display: flex;
                align-items: center;
                position: relative;
                color: #000;
            }
        }
    }
}
</style>