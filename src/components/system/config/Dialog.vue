<template>
    <div id="system">
        <el-dialog v-model="visible" :title="reForm === 'created' ? '添加系统配置' : '修改系统'" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" center>
            <el-form :model="localForm" :ref="reForm" label-position="left" label-width="100px" :rules="rules">
                <el-form-item label="配置名称：" prop="name">
                    <el-input placeholder="请输入" v-model.trim="localForm.name"></el-input>
                </el-form-item>
                <el-form-item label="配置状态：">
                    <el-switch v-model.number="localForm.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2"></el-switch>
                </el-form-item>
                <el-form-item label="配置属性：" prop="children">
                    <div v-for="(item, index) in localForm.children" :key="index" class="config">
                        <el-form-item label="PID：">
                            <span v-html="item.pid"></span>
                        </el-form-item>
                        <el-form-item label="KEY：">
                            <el-input placeholder="请输入" v-model.trim="item.name"></el-input>
                        </el-form-item>
                        <el-form-item label="VALUE：">
                            <el-input placeholder="请输入对应的VALUE，用逗号间隔" type="textarea" resize="none" :autosize="{ minRows: 4}" v-model.trim="item.value"></el-input>
                        </el-form-item>
                        <el-form-item label="ID：">
                            <el-input placeholder="请输入" v-model.number="item.id"></el-input>
                        </el-form-item>
                        <el-form-item label="STATUS：">
                            <el-switch v-model.number="item.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2"></el-switch>
                        </el-form-item>
                        <el-form-item>
                            <el-button v-if="localForm.children.length > 1" type="danger" size="mini" icon="el-icon-delete" @click="deleteChildren(localForm.children, index)">移除</el-button>
                        </el-form-item>
                    </div>
                    <el-form-item>
                        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addChildren(localForm.children)">新增</el-button>
                    </el-form-item>
                </el-form-item>
                <SubmitButton :form="submitForm" :reForm="reForm" @closeDialog="$emit('getConfigLists', { page: 1, limit: 15, refresh: true, total: 0 })"></SubmitButton>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import SubmitButton from '@/components/common/SubmitForm'
import URLS from '@/api/urls'
export default {
    name: 'SystemConfigDialog',
    components: { SubmitButton },
    props: ['syncVisible', 'form', 'reForm'],
    data() {
        return {
            visible: this.syncVisible,
            localForm: this.form,
            submitForm: {},
            rules: {}
        }
    },
    watch: {
        form() {
            this.localForm = this.form
        },
        syncVisible() {
            this.visible = this.syncVisible
            if (this.visible) {
                this.submitForm = { model: this.localForm, $refs: this.$refs, url: this.reForm === 'created' ? URLS.config.save : URLS.config.update }
            }
        }
    },
    methods: {
        /**
         * todo；添加配置值
         * @param children
         */
        addChildren(children) {
            let items = JSON.parse(JSON.stringify(children))
            items.push({ name: '', value: '', status: '', pid: this.localForm.children[this.localForm.children.length - 1].pid, id: this.localForm.children[this.localForm.children.length - 1].id + 1 })
            this.localForm.children = items
            this.submitForm = { model: this.localForm, $refs: this.$refs, url: this.reForm === 'created' ? URLS.config.save : URLS.config.update }
        },
        /**
         * todo:移除配置值
         * @param children
         * @param index
         */
        deleteChildren(children, index) {
            children.length > 1 ? children.splice(index, 1) : ''
            this.submitForm = { model: this.localForm, $refs: this.$refs, url: this.reForm === 'created' ? URLS.config.save : URLS.config.update }
        }
    }
}
</script>

<style lang="less">
#system {
    .config {
        .el-form-item {
            margin-bottom: 15px;
        }
    }
}
</style>
