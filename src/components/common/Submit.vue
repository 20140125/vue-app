<template>
    <div>
        <el-button @click="resetForm(reFrom)" plain v-if="showBtn">取 消</el-button>
        <el-button type="primary" @click="submitForm(reFrom)" plain>确 定</el-button>
    </div>
</template>

<script>
    import apiLists from '../../api/api'
    import {mapActions} from 'vuex'
    export default {
        name: 'Submit',
        props: {
            reFrom: {
                type: String,
                default: () => ''
            },
            model: {
                type: Object,
                default: () => {}
            },
            url: {
                type: String,
                default: () => ''
            },
            refs: {
                type: Object,
                default: () => {}
            },
            showBtn: {
                type: Boolean,
                default: () => true
            }
        },
        data () {
            return {

            }
        },
        methods: {
            ...mapActions(['saveSystemLog', 'checkAuth']),
            /**
             * todo:表单提交
             * @param ref
             */
            submitForm: function (ref) {
                this.refs[ref].validate((valid) => {
                    if (!valid) {
                        this.$message({type: 'warning', message: '请检查字段完整性~'})
                        return false
                    }
                    this.checkAuth({url: this.url})
                    this.model.token = this.$store.state.login.token
                    apiLists.SaveData(this.model, this.url).then((response) => {
                        if (response && response.data.code === 200) {
                            let data = {href: this.url, msg: response.data.msg, token: this.$store.state.login.token}
                            this.saveSystemLog(data)
                            this.$message({type: 'success', message: response.data.msg})
                            this.$emit('success', this.model)
                        }
                    })
                })
            },
            /**
             * todo:表单重置
             * @param ref
             */
            resetForm: function (ref) {
                this.refs[ref].resetFields()
            }
        }
    }
</script>

<style scoped>

</style>
