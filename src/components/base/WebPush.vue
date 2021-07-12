<template>
    <el-carousel :interval="2000" arrow="never" height="65px" direction="vertical" indicator-position="none" v-if="pushMessage.length > 0">
        <el-carousel-item v-for="(item,index) in pushMessage" :key="index">
            <el-alert type="success" show-icon :title="item.message" effect="light"></el-alert>
        </el-carousel-item>
    </el-carousel>
</template>

<script>

import SocketIO from 'socket.io-client'
import func from '@/utils/func'

export default {
    name: 'WebPush',
    data () {
        return {
            pushMessage: [{ message: this.$store.state.login.userInfo.weather, timestamp: Date.parse(new Date()) / 1000 }],
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
            /* todo:链接断开 */
            SocketService.on('disconnect', ($error) => {
                console.info(`【系统断开】${func.setTime(Date.parse(new Date()))}${JSON.stringify($error)}`)
            })
            /* todo:站内消息推送 */
            SocketService.on('new_message', ($message) => {
                this.pushMessage.push({ message: $message, timestamp: Date.parse(new Date()) / 1000 })
            })
            /* todo:链接错误 */
            SocketService.on('connect_error',  ($error) => {
                console.error(`【系统链接错误】${func.setTime(Date.parse(new Date()))}${JSON.stringify($error)}`)
            })
        })
    }
}
</script>

<style scoped>

</style>
