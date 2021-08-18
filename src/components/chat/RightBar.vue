<template>
   <div id="right-bar">
       <div class="notify">
           <strong>系统公告</strong>
           <el-carousel height="150px" direction="vertical">
               <el-carousel-item v-for="(item, index) in clientLog" :key="index">
                   <div class="time" v-html="item.time"></div>
                   <div class="message">
                       {{item.username}}： {{item.message}}
                   </div>
               </el-carousel-item>
           </el-carousel>
       </div>
       <div class="client-user">
           <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
               <el-menu-item :users="user" v-for="(user,index) in clientUsers" @click="getUser(user)" :key="index" :index="user.id">
                   <el-avatar :size="35" :src="user.client_img" class="img"></el-avatar>
                   <template #title>
                       <span class="username" v-html="user.client_name.replace(userInfo.username,'<b style=color:#0e82fc;font-weight:300>'+userInfo.username+'</b>')"></span>
                   </template>
                   <!--未读消息数-->
                   <el-badge v-if="user.total" type="danger" :value="user.total"></el-badge>
                   <!--在线-->
                   <el-badge v-else-if="user.online" type="success" is-dot></el-badge>
                   <!--离线-->
                   <el-badge v-else-if="!user.online" type="info" is-dot></el-badge>
               </el-menu-item>
           </el-menu>
       </div>
   </div>
</template>

<script>

export default {
    name: 'RightBar',
    props: ['clientUsers', 'userInfo'],
    computed: {
        clientLog() {
            return this.$store.state.chat.clientLog
        }
    },
    methods: {
        /**
         * todo:获取接收用户
         * @param user
         * @return {Promise<boolean>}
         */
        async getUser(user) {
            if (this.userInfo.uuid === user.uuid) {
                this.$message.info('暂不支持发消息给自己')
                return false
            }
            await this.$store.dispatch('chat/addChatUsers', user)
            this.$emit('getReceiver', user)
        }
    }
}
</script>

<style lang="less">
#right-bar {
    .notify {
        padding: 20px 20px 0 20px;
        .el-carousel {
            cursor: pointer;
            margin-top: 30px;
        }
        .time {
            color: #f5c6cb;
            font-size: 14px;
        }
        .message {
            font-size: 14px;
            margin-top: 8px;
            font-family: "Source Code Pro", "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
    }
    .client-user {
        height:355px;
        max-height: 355px;
        overflow: hidden;
        overflow-y: auto;
        padding: 0 !important;
        .el-menu {
            border: none !important;
            .username {
                margin-left: 10px;
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            }
            .img {
                cursor: pointer
            }
            .el-badge {
                top: 12px;
                right: 10px
            }
        }
    }
}
</style>
