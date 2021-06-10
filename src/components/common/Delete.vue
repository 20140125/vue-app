<template>
    <el-button plain type="danger" icon="el-icon-delete" size="mini" @click="remove(item)">{{ btnText }}</el-button>
</template>

<script>
    import apiLists from '../../api/api'
    import { mapActions } from 'vuex'
    export default {
        name: 'Delete',
        props: {
            item: {
                type: Object,
                default: () => {}
            },
            url: {
                type: String,
                default: () => ''
            },
            btnText: {
                type: String,
                default: () => '删除'
            }
        },
        data () {
            return {
                table: this.$route.meta.mode
            }
        },
        methods: {
            ...mapActions(['saveSystemLog', 'checkAuth']),
            /**
             * todo：删除记录
             * @param item
             */
            remove: function (item) {
                this.$confirm('此操作将永远' + this.btnText.replace(' ', '') + '该条记录，是否继续？', this.btnText.replace(' ', '') + '记录', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.checkAuth({ url: this.url })
                    let params = { id: item.id, token: this.$store.state.login.token }
                    apiLists.RemoveData(params, this.url).then((response) => {
                        if (response && response.data.code === 200) {
                            let data = { href: this.url, msg: response.data.msg, token: this.$store.state.login.token }
                            this.saveSystemLog(data)
                            this.$message({ type: 'success', message: response.data.msg })
                            this.$emit('removeSuccess')
                            return false
                        }
                    })
                }).catch(() => {
                    this.$message({type: 'info', message: 'cancel delete！'})
                })
            }
        }
    }
</script>

<style scoped>

</style>
