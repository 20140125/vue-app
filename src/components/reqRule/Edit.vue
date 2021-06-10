<template>
    <el-dialog :title="reFrom === 'created' ? '申请权限' : '权限续期'" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="visible" :center="true" :width="dialogWidth">
        <el-form :model="form" :ref="reFrom" :rules="rules" label-position="left" label-width="100px">
            <el-form-item label="申请人：" prop="user_id">
                <el-select filterable style="width: 100%" v-model="form.username" @change="getAuth">
                    <el-option v-for="(user,index) in reqRuleAttr.userLists" :label="user.username" :key="index" :value="user.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="授权地址：" prop="href">
                <el-select multiple="multiple" filterable style="width: 100%" v-model="form.href" :disabled="reFrom === 'update'">
                    <el-option v-for="(rule,index) in reqRuleAttr.ruleLists" :label="setAuthName(rule)" :key="index" :value="rule.href" :disabled="rule.disable"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="授权时间：" prop="expires">
                <el-date-picker v-model="form.expires" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择授权时间" :picker-options="pickerOptions" style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="授权说明：" prop="desc">
                <el-input v-model="form.desc" maxlength="200" show-word-limit resize="none" :autosize="{ minRows: 4}" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="是否授权：" prop="status" v-if="reFrom === 'created'">
                <Status :status="form.status" @changeStatus="changeStatus"></Status>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <Submit :reFrom="reFrom" :model="form" :url="reqRuleAttr.url" :refs="refs" @saveSuccess="saveSuccess" @closeDialog="closeDialog"></Submit>
        </div>
    </el-dialog>
</template>

<script>
    import Status from '../common/Status'
    import Submit from '../common/Submit'
    import apiLists from '../../api/api'
    import { mapGetters } from 'vuex'
    export default {
        name: 'ReqRuleEdit',
        components: { Submit, Status },
        props: {
            form: {
                type: Object,
                default: () => {}
            },
            reqRuleAttr: {
                type: Object,
                default: () => {}
            },
            reFrom: {
                type: String,
                default: () => ''
            },
            syncVisible: {
                type: Boolean,
                default: () => false
            }
        },
        data () {
            return {
                refs: this.$refs,
                visible: this.syncVisible,
                rules: {
                    user_id: [{required: true, message: '申请人不得为空', trigger: 'blur'}],
                    href: [{required: true, message: '授权地址不得为空', trigger: 'change'}],
                    expires: [{required: true, message: '授权时效不得为空', trigger: 'change'}],
                    desc: [{required: true, message: '授权说明不得为空', trigger: 'blur'}],
                    status: [{required: true, message: '授权状态不得为空', trigger: 'blur'}]
                },
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() < Date.now()
                    },
                    shortcuts: [{
                        text: '一星期',
                        onClick (picker) {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', date)
                        }
                    }, {
                        text: '一个月',
                        onClick (picker) {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', date)
                        }
                    }, {
                        text: '三个月',
                        onClick (picker) {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30 * 3)
                            picker.$emit('pick', date)
                        }
                    }, {
                        text: '六个月',
                        onClick (picker) {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30 * 6)
                            picker.$emit('pick', date)
                        }
                    }, {
                        text: '一年',
                        onClick (picker) {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30 * 12)
                            picker.$emit('pick', date)
                        }
                    }]
                }
            }
        },
        watch: {
            syncVisible: function () {
                this.visible = this.syncVisible
            }
        },
        computed: {
            ...mapGetters(['dialogWidth'])
        },
        methods: {
            /**
             * TODO:获取权限
             * @param userId
             */
            getAuth: async function (userId) {
                let response = await apiLists.GetAuthByToken({ user_id: userId }).catch(() => {
                    this.$message.error('网络错误')
                })
                if (response && response.data.code === 200) {
                    this.ruleLists = response.data.item
                }
            },
            /**
             * todo:修改状态
             * @param status
             */
            changeStatus: function (status) {
                this.form.status = status
            },
            /**
             * todo:关闭弹框
             */
            closeDialog: function () {
                this.$emit('closeDialogEvent', 'close')
            },
            /**
             * todo:保存成功
             */
            saveSuccess: function () {
                this.$emit('closeDialogEvent', 'save')
            },
            /**
             * todo：设置权限名称
             * @param item
             * @return {String}
             */
            setAuthName: function (item) {
                return Array(item.level + 1).join('　　') + item.name
            }
        }
    }
</script>

<style scoped>

</style>
