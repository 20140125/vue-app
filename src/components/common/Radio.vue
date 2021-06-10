<template>
    <el-button
        :icon="item.status === 1 ? 'el-icon-success' : 'el-icon-error'"
        circle
        :type="item.status === 1 ? 'success' : 'danger'"
        @click="setStatus(item)"
        size="medium">
    </el-button>
</template>

<script>
    import apiLists from '../../api/api'
    import {mapActions} from 'vuex'
    export default {
        name: 'Radio',
        props: {
            item: {
                type: Object,
                default: () => {}
            },
            url: {
                type: String,
                default: () => ''
            }
        },
        data () {
            return {}
        },
        methods: {
            ...mapActions(['saveSystemLog', 'checkAuth']),
            /**
             * todo：修改状态
             * @param item
             */
            setStatus: async function (item) {
                await this.checkAuth({ url: this.url })
                item.status = item.status === 1 ? 2 : 1
                let params = { status: item.status, id: item.id, token: this.$store.state.login.token, 'act': 'status' }
                let response = await apiLists.SaveData(params, this.url).catch(() => {
                    this.$message.error('网络错误')
                })
                if (response && response.data.code === 200) {
                    let data = { href: this.url, msg: response.data.msg, token: this.$store.state.login.token }
                    await this.saveSystemLog(data)
                    this.$message.success(response.data.msg)
                    this.$emit('success', item)
                }
            }
        }
    }
</script>

<style scoped>

</style>
