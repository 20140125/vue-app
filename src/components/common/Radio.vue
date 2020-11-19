<template>
    <el-button :icon="item.status === 1 ? 'el-icon-success' : 'el-icon-error'"
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
            setStatus: function (item) {
                this.checkAuth({url: this.url})
                item.status = item.status === 1 ? 2 : 1
                let params = {status: item.status, id: item.id, token: this.$store.state.login.token, 'act': 'status'}
                apiLists.SaveData(params, this.url).then(response => {
                    if (response && response.data.code === 200) {
                        let data = {href: this.url, msg: response.data.msg, token: this.$store.state.login.token}
                        this.saveSystemLog(data)
                        this.$message({type: 'success', message: response.data.msg})
                        this.$emit('success', item)
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
