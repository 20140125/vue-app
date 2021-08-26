<template>
    <div id="left-bar">
        <div class="chat-user">
            <el-menu background-color="#393d49" text-color="#fff" active-text-color="#ff69b4" style="height: 575px">
                <el-menu-item :users="user" v-for="(user,index) in chatUsers" @click="getUser(user)" :key="index" :index="index.toString()">
                    <el-avatar :size="35" :src="user.client_img" class="img"></el-avatar>
                    <template #title>
                        <span class="username" v-html="user.client_name.replace(userInfo.username,'<b style=color:#67C23A;font-weight:300>'+userInfo.username+'</b>')"></span>
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
    name: 'LeftBar',
    props: ['chatUsers', 'userInfo'],
    data() {
        return {};
    },
    methods: {
        /**
         * todo:发送消息给当前用户
         * @param user
         */
        getUser(user) {
            this.$emit('getReceiver', user);
        }
    }
};
</script>

<style lang="less">
#left-bar {
    .chat-user {
        height: 575px;
        max-height: 575px;
        overflow: hidden;
        overflow-y: auto;
        padding: 0 !important;
        background-color: #545c64;

        .el-menu {
            border: none !important;
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
