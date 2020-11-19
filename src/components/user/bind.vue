<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :label-width="labelWidth" :model="userModel" :ref="reFrom" :rules="rules" label-position="left">
            <el-form-item label="用户名称：" prop="username">
                <el-input v-model.trim="userModel.username" placeholder="管理员名称"></el-input>
            </el-form-item>
            <el-form-item label="用户头像：" prop="avatar_url" id="avatar" style="display: flex;align-items: center;position: relative;">
                <Upload :avatar_url="userModel.avatar_url" :username="userModel.username" @uploadSuccess="uploadSuccess"></Upload>
            </el-form-item>
            <el-form-item label="用户密码：" prop="password">
                <el-input :type="!showPassword ? 'password' : 'text'" placeholder="请输入你的密码（当前展示密码为加密后的密码）" v-model="userModel.password" :readonly="!showPassword">
                    <el-button slot="append" :icon="showPassword ? 'el-icon-open' : 'el-icon-turn-off'" @click="showPassword = !showPassword">
                        {{showPassword ? '显 示' : '隐 藏'}}
                    </el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="用户邮箱：" prop="email">
                <el-input v-model.trim="userModel.email" type="email" placeholder="邮箱（请填写正确的邮箱，便于后期密码修改，密码找回）"></el-input>
            </el-form-item>
            <el-form-item label="用户手机：" prop="phone_number">
                <el-input v-model.number="userModel.phone_number" placeholder="手机号（请填写正确的手机号，便于后期密码修改，密码找回）"></el-input>
            </el-form-item>
            <el-form-item label="允许登录：" prop="status">
                <Status :status="userModel.status" @changeStatus="changeStatus"></Status>
            </el-form-item>
            <el-form-item style="text-align: center">
                <Submit :reFrom="reFrom" :model="userModel" :url="url" :refs="refs"></Submit>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import apiLists from '../../api/api'
    import $url from '../../api/url'
    import func from '../../api/func'
    import Submit from '../common/Submit'
    import Upload from '../common/Upload'
    import {mapGetters} from 'vuex'
    import Status from '../common/Status'
    export default {
        name: 'lists',
        components: {Status, Submit, Upload},
        data () {
            return {
                labelWidth: '100px',
                loading: false,
                loadingText: '玩命加载中。。。',
                url: $url.userUpdate,
                refs: this.$refs,
                reFrom: 'created',
                showPassword: false,
                userModel: {
                    username: '',
                    email: '',
                    password: '',
                    salt: func.setTime(),
                    status: 1,
                    role_id: 2,
                    phone_number: '',
                    created_at: func.getTimestamp(),
                    updated_at: func.getTimestamp(),
                    avatar_url: ''
                },
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    email: [{required: true, message: '请输入邮箱', trigger: 'blur'}, {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}],
                    status: [{required: true, message: '请勾选登录状态', trigger: 'change'}],
                    avatar_url: [{required: true, message: '请上传用户头像', trigger: 'change'}],
                    phone_number: [{required: true, message: '请输入手机号码', trigger: 'change'}]
                }
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        methods: {
            /**
             * todo:修改状态
             * @param status
             */
            changeStatus: function (status) {
                this.userModel.status = status
            },
            /**
             * TODO:获取用户绑定信息
             */
            userBind: function () {
                apiLists.UserBind({'remember_token': this.userInfo.token}).then(response => {
                    if (response && response.data.code === 200) {
                        this.userModel = response.data.item
                    }
                })
            },
            /**
             * TODO:图片上传回调
             * @param src
             */
            uploadSuccess: function (src) {
                this.userModel.avatar_url = src
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.userBind()
            })
        },
        created () {
            this.userModel.username = this.userInfo.username
            this.userModel.avatar_url = this.userInfo.avatar_url
            this.userModel.remember_token = this.userInfo.token
        }
    }
</script>

<style scoped>

</style>
