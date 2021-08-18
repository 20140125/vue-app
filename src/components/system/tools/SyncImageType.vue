<template>
    <div id="imageType" v-loading="loading" element-loading-text="数据抓取中...">
        <el-form label-position="left" label-width="100px">
            <el-form-item label="关键词：">
                <el-input v-model.trim="imageTypeName" :placeholder="`请输入图片分类名称(https://www.fabiaoqing.com/)`">
                    <template #append>
                        <el-button icon="el-icon-search" @click="getWeather">数据爬取</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="输出信息：">
                <div ref="message" class="messageLists">
                    <div v-for="(item, index) in messageLists" :key="index">
                        <div class="userinfo">
                            <span class="message-time" v-html="item.time"></span>
                        </div>
                        <div class="client-content" v-html="item.message"></div>
                    </div>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import URLS from  '@/api/urls'
import SocketIO from 'socket.io-client'
import func from '@/utils/func'
export default {
    name: 'SyncImageType',
    data() {
        return {
            imageTypeName: '',
            messageLists: [],
            loading: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            const SocketService = SocketIO(this.$store.state.login.userInfo.socket, { transports: ['websocket'], autoConnect: true })
            /* todo:链接系统 */
            SocketService.on('connect',  () => {
                console.info(`【登录系统】${func.setTime(Date.parse(new Date()))}`)
                /* todo:用户登录 */
                SocketService.emit('login', this.$store.state.login.userInfo.uuid)
            })
            /* todo:站内消息推送 */
            SocketService.on('web_command', ($message) => {
                console.log($message)
                let clientLog = { time: func.setTime(Date.parse(new Date()), 'ch'), message: $message }
                this.messageLists.push(clientLog)
                func.scrollToBottom('.messageLists')
                this.loading = this.messageLists.length <= 0
            })
        })
    },
    methods: {
        /**
         * todo:获取天气
         * @return {Promise<void>}
         */
        async getWeather() {
            this.messageLists = []
            this.loading = true
            await this.$store.dispatch('UPDATE_ACTIONS', { url: URLS.spider.syncImageType, model: { keywords: this.imageTypeName } })
        }
    }
}
</script>

<style lang="less">
#imageType {
    .messageLists {
        background-color: #393d49;
        max-height: 400px;
        height: 400px;
        color: #FFFFFF;
        padding-left: 10px;
        overflow: auto;
        .message-time {
            color: #1e7e34;
        }
        .client-content {
            margin-left: 10px;
            color: #1AAD19;
            font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
            font-size: 14px;
        }
    }
}
</style>
