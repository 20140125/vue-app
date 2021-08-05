<template>
    <div id="users">
        <el-dialog v-model="visible" :title="reForm === 'created' ? '添加管理员' : '修改管理员'" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" center>
            <el-form :model="localForm" :ref="reForm" label-position="left" label-width="100px" :rules="rules">
                <el-form-item label="用户名：" prop="username">
                    <el-input v-model.trim="localForm.username"></el-input>
                </el-form-item>
                <el-form-item label="用户头像：" prop="avatar_url" class="avatar-url">
                    <CommonUpload :avatar-image="{ username: localForm.username, avatar_url: localForm.avatar_url, size: 100 }"
                                  :file-size="100"
                                  :img-width="0"
                                  :img-height="0"
                                  :upload-controls="{ button_type: 'avatar', show_file_list: false, show_tips: false }"
                                  :uploadSuccess="uploadSuccess">
                    </CommonUpload>
                </el-form-item>
                <el-form-item label="登录密码：" prop="password">
                    <el-input v-model.trim="localForm.password" show-password type="password" placeholder="请输入登录密码"></el-input>
                </el-form-item>
                <el-form-item label="邮箱账号：" prop="email">
                    <el-input v-model="localForm.email" type="email" placeholder="请输入邮箱账号"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="phone_number">
                    <el-input v-model.number="localForm.phone_number" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="用户角色：" prop="role_id">
                    <el-select v-model.number="localForm.role_id" filterable placeholder="请选择用户角色">
                        <el-option v-for="(role,index) in usersAttr['roleLists']" :key="index" :label="role.role_name" :value="role.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="允许登录：" class="is-required">
                    <el-switch v-model.number="localForm.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2"></el-switch>
                </el-form-item>
                <SubmitButton :form="submitForm" :reForm="reForm" @closeDialog="$emit('getUsersLists', { page: 1, limit: 15, refresh: true, total: 0 })"></SubmitButton>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import SubmitButton from '@/components/common/SubmitForm'
import URLS from '@/api/urls'
import CommonUpload from '@/components/common/CommonUpload'
import { toggle } from '@/components/mixins/toggle'
export default {
    name: 'UsersDialog',
    components: { CommonUpload, SubmitButton },
    mixins: [toggle],
    props: ['form', 'reForm', 'usersAttr'],
    data() {
        return {
            localForm: this.form,
            submitForm: {},
            rules: {
                username: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
                avatar_url: [{ required: true, message: '请上传用户头像', trigger: 'change' }],
                email: [{ required: true, message: '请输入邮箱账号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
                phone_number: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                role_id: [{ required: true, message: '请选择用户角色', trigger: 'change' }]
            }
        }
    },
    watch: {
        form() {
            this.localForm = this.form
            this.$nextTick(() => {
                setTimeout(() => {
                    this.submitForm = { model: this.localForm, $refs: this.$refs, url: this.reForm === 'created' ? URLS.users.save : URLS.users.update }
                }, 1000)
            })
        }
    },
    methods: {
        /**
         * todo:图片上传成功
         * @param response
         */
        uploadSuccess(response) {
            this.localForm.avatar_url = (((response || {}).item || {}).lists || {}).src || ''
        },
    }
}
</script>

<style lang="less">
#users {
    .avatar-url {
        display: flex;
        align-items: center;
        position: relative;
        .el-form-item__content {
            margin-left: 0 !important;
        }
    }
}
</style>
