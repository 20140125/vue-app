<template>
    <!---弹框-->
    <el-dialog :title="reFrom === 'created' ? '添加权限' : '修改权限'" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="visible" :center="true" :width="dialogWidth">
        <el-form :label-width="authAttr.labelWidth" :model="form" :ref="reFrom" :rules="rules" label-position="left">
            <el-form-item label="权限名称：" prop="name">
                <el-input v-model="form.name" placeholder="权限名称"></el-input>
            </el-form-item>
            <el-form-item label="权限链接：" prop="href">
                <el-input v-model="form.href" placeholder="/admin/auth/index"></el-input>
            </el-form-item>
            <el-form-item label="权限上级：" prop="pid">
                <el-select placeholder="权限上级" filterable style="width: 100%" v-model="form.pid">
                    <el-option label="默认权限" value="0" v-if="form.pid === '0'" selected></el-option>
                    <el-option v-for="(item,index) in authAttr.authLevel" :key="index" :disabled="item.id === form.id || item.pid === form.id" :label="setAuthName(item)" :value="item.id.toString()"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="权限状态：" prop="status" v-if="reFrom === 'created'">
                <Status :status="form.status" @changeStatus="changeStatus"></Status>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <Submit :reFrom="reFrom" :model="form" :url="authAttr.url" :refs="refs" @saveSuccess="saveSuccess" @closeDialog="closeDialog"></Submit>
        </div>
    </el-dialog>
    <!---弹框-->
</template>

<script>
    import Status from '../common/Status'
    import Submit from '../common/Submit'
    import {mapGetters} from 'vuex'
    export default {
        name: 'AuthEdit',
        components: { Submit, Status },
        props: {
            form: {
                type: Object,
                default: () => {}
            },
            authAttr: {
                type: Object,
                default: () => {}
            },
            reFrom: {
                type: String,
                default: () => 'created'
            },
            syncVisible: {
                type: Boolean,
                default: () => false
            }
        },
        data () {
            return {
                visible: this.syncVisible,
                refs: this.$refs,
                rules: {
                    name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
                    href: [{ required: true, message: '请输入权限链接', trigger: 'blur' }],
                    pid: [{ required: true, message: '请选择权限上级', trigger: 'change' }],
                    status: [{ required: true, message: '请选择权限状态', trigger: 'change' }]
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
