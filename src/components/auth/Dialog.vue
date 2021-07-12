<template>
    <div>
        <el-dialog v-model="visible" :title="reForm === 'created' ? '添加权限' : '修改权限'" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" center>
            <el-form :model="localForm" :ref="reForm" label-position="left" label-width="100px" :rules="rules">
                <el-form-item label="权限名称：" prop="name">
                    <el-input placeholder="请输入权限名称" v-model.trim="localForm.name"></el-input>
                </el-form-item>
                <el-form-item label="权限地址：" prop="href">
                    <el-input placeholder="请输入权限名称" v-model.trim="localForm.href"></el-input>
                </el-form-item>
                <el-form-item label="权限上级：" prop="pid">
                    <el-select placeholder="请选择权限上级" filterable v-model.number="localForm.pid">
                        <el-option label="默认权限" :value="0" v-if="localForm.pid === 0" selected></el-option>
                        <el-option v-for="(item, index) in authLists" :disabled="item.id === localForm.id" :key="index" :label="setAuthName(item)" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <SubmitButton :form="submitForm" :reForm="reForm" @closeDialog="$emit('getAuthLists')"></SubmitButton>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import SubmitButton from '@/components/common/SubmitForm'
import URLS from '@/api/urls'
export default {
    name: 'AuthDialog',
    components: { SubmitButton },
    props: {
        syncVisible: {
            type: Boolean,
            default: () => false
        },
        reForm: {
            type: String,
            default: () => 'created'
        },
        form: {
            type: Object,
            default: () => {}
        },
        authLists: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            visible: this.syncVisible,
            localForm: {...this.form},
            submitForm: {},
            rules: {
                name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
                href: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
                pid: [{ required: true, message: '请输入权限名称', trigger: 'blur', type: 'number' }],
            }
        }
    },
    watch: {
        syncVisible() {
            this.visible = this.syncVisible
        },
        form() {
            this.localForm = {...this.form}
        }
    },
    methods: {
        /**
         * todo：设置权限名称
         * @param item
         * @return {String}
         */
        setAuthName(item) {
            this.submitForm = { model: this.localForm, $refs: this.$refs, url: this.reForm === 'created' ? URLS.auth.save : URLS.auth.update }
            return Array(item.level + 1).join('　　') + item.name
        }
    }
}
</script>

<style scoped>

</style>
