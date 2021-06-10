<template>
    <el-dialog :title="reFrom === 'created' ? '添加角色' : '修改角色'" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="visible" :center="true" :width="dialogWidth">
        <el-form :label-width="roleAttr.labelWidth" :model="form" :ref="reFrom" label-position="left">
            <el-form-item label="角色名称：" prop="role_name" :rules="[{ required:true,message:'角色名称不得为空',trigger:'blur' }]">
                <el-input v-model="form.role_name" placeholder="角色名称"></el-input>
            </el-form-item>
            <el-form-item label="权限列表：" prop="auth_ids" :rules="[{ required:true,message:'请选择权限',trigger:'change' }]">
                <el-transfer :titles="['所有', '拥有']" :button-texts="['移除', '添加']" style="text-align: left; display: inline-block" v-model="roleAttr.defaultChecked" :data="roleAttr.authLists" filterable @change="handleChange"></el-transfer>
            </el-form-item>
            <el-form-item required label="状态：" prop="status" v-if="reFrom === 'created'">
                <Status :status="form.status" @changeStatus="changeStatus"></Status>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <Submit :reFrom="reFrom" :model="form" :url="roleAttr.url" :refs="refs" @saveSuccess="saveSuccess" @closeDialog="closeDialog"></Submit>
        </div>
    </el-dialog>
</template>

<script>
    import Status from '../common/Status'
    import Submit from '../common/Submit'
    import { mapGetters } from 'vuex'
    export default {
        name: 'RoleEdit',
        components: { Submit, Status },
        props: {
            form: {
                type: Object,
                default: () => {}
            },
            roleAttr: {
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
                visible: this.syncVisible,
                refs: this.$refs
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
             * todo:修改值
             * @param value      当前值
             * @param direction  数据移动的方向（'left' / 'right'）
             * @param movedKeys  发生移动的数据 key 数组
             */
            handleChange (value, direction, movedKeys) {
                switch (direction) {
                /* 删除 */
                case 'left':
                    movedKeys.forEach((item) => {
                        this.roleAttr.defaultChecked.splice(this.roleAttr.defaultChecked.indexOf(parseInt(item)), 1)
                    })
                    break
                /* 添加 */
                case 'right':
                    movedKeys.forEach((item) => {
                        this.roleAttr.defaultChecked.push(parseInt(item))
                    })
                    break
                }
                this.form.auth_ids = this.roleAttr.defaultChecked
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
            }
        }
    }
</script>

<style scoped>

</style>
