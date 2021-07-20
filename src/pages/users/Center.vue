<template>
    <BaseLayout :loading="loading">
       <template #body>
           <el-row :gutter="24" id="information">
               <el-col :xl="8" :lg="8">
                   <el-tabs type="border-card">
                       <el-tab-pane label="个人简介"></el-tab-pane>
                       <el-card shadow="hover">
                           <el-form>
                               <el-form-item style="text-align: center">
                                   <el-avatar :src="userInfo.avatar_url" fit="fill" :size="100" :alt="userInfo.username"></el-avatar>
                               </el-form-item>
                               <el-form-item>
                                   <i class="el-icon-user-solid"></i>
                                   <span v-html="userInfo.username"></span>
                               </el-form-item>
                               <el-form-item>
                                   <i class="el-icon-message-solid"></i>
                                   <span v-html="userInfo.email"></span>
                               </el-form-item>
                               <el-form-item>
                                   <i class="el-icon-s-home"></i>
                                   <span v-html="setLocal(userCenter.local)"></span>
                               </el-form-item>
                               <el-form-item>
                                   <i class="el-icon-location"></i>
                                   <span v-html="setLocal(userCenter.ip_address)"></span>
                               </el-form-item>
                               <el-form-item>
                                   <i class="el-icon-s-comment"></i>
                                   <span v-html="userCenter.desc"></span>
                               </el-form-item>
                               <el-form-item class="tags">
                                   <i class="el-icon-s-claim"></i>
                                   <el-tag :key="tag" v-for="tag in userCenter.tags"  effect="dark" type="success">{{tag}}</el-tag>
                               </el-form-item>
                           </el-form>
                       </el-card>
                   </el-tabs>
               </el-col>
               <el-col :xl="16" :lg="16">
                   <el-tabs type="border-card">
                       <el-tab-pane label="信息展示"></el-tab-pane>
                       <el-card shadow="hover">
                           <el-form :model="userCenter" label-width="100px" style="margin-left: 20px" label-position="left" ref="center">
                               <el-form-item label="头像：" class="is-required avatar-url">
                                   <el-avatar :src="userInfo.avatar_url" fit="fill" :size="100" :alt="userInfo.username"></el-avatar>
                               </el-form-item>
                               <el-form-item label="用户名：" class="is-required">
                                   <span v-html="userInfo.username"></span>
                               </el-form-item>
                               <el-form-item label="居住地址：" class="is-required">
                                   <el-cascader :props="props" :options="options" filterable v-model="userCenter.local"></el-cascader>
                               </el-form-item>
                               <el-form-item label="所在地：" class="is-required">
                                   <el-cascader :props="props" :options="options" filterable v-model="userCenter.ip_address"></el-cascader>
                               </el-form-item>
                               <el-form-item label="座右铭：" class="is-required">
                                   <el-input type="textarea" resize="none" rows="3" show-word-limit maxlength="32" v-model="userCenter.desc" placeholder="这个人很懒，什么也没有留下"></el-input>
                               </el-form-item>
                               <el-form-item label="个人标签：" class="tags is-required">
                                   <el-tag :key="tag" effect="dark" type="success" v-for="tag in userCenter.tags" closable :disable-transitions="false" @close="handleClose(tag)">
                                       {{tag}}
                                   </el-tag>
                                   <el-input v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm"></el-input>
                                   <el-button type="primary" plain v-else size="small" @click="showInput"> + New Tag</el-button>
                               </el-form-item>
                               <el-form-item label="站内信息：" class="is-required">
                                   <el-tooltip effect="dark" :content="userCenter.notice_status === 1 ? 'YES' : 'NO'" placement="top-start">
                                       <el-switch v-model.number="userCenter.notice_status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2"></el-switch>
                                   </el-tooltip>
                               </el-form-item>
                               <el-form-item label="账号变更：" class="is-required">
                                   <el-tooltip effect="dark" :content="userCenter.user_status === 1 ? 'YES' : 'NO'" placement="top-start">
                                       <el-switch v-model.number="userCenter.user_status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2"></el-switch>
                                   </el-tooltip>
                               </el-form-item>
                               <SubmitButton reForm="center" :form="submitForm"></SubmitButton>
                           </el-form>
                       </el-card>
                   </el-tabs>
               </el-col>
           </el-row>
       </template>
    </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import SubmitButton from '@/components/common/SubmitForm'
import URLS from '@/api/urls'
export default {
    name: 'Center',
    components: { SubmitButton, BaseLayout },
    data() {
        return {
            loading: true,
            userCenter: { user_status: 1, notice_status: 1, ip_address: [] },
            props: { value: 'name', label: 'name' },
            options: [],
            inputVisible: false,
            inputValue: '',
            submitForm: {}
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.login.userInfo
        }
    },
    mounted() {
        this.$nextTick(async () => {
            /* 获取个人信息 */
            await this.$store.dispatch('users/getUserCenter', {}).then(() => {
                this.userCenter = JSON.parse(JSON.stringify(this.$store.state.users.userCenter))
                /* 获取城市列表 */
                this.$store.dispatch('area/getAreaCacheLists', {}).then(() => {
                    this.setOptions(JSON.parse(JSON.stringify(this.$store.state.area.cacheArea)))
                    this.loading = false
                })
            })
            setTimeout(() => {
                this.submitForm = { model: this.userCenter, $refs: this.$refs, url:  URLS.userCenter.update }
            }, 1000)
        })
    },
    methods: {
        /**
         * TODO:设置数据
         * @param areaItem
         */
        setOptions(areaItem) {
            areaItem.forEach((item, index) => {
                item.children.length === 0 ?  delete areaItem[index].children : this.setOptions(item.children)
            })
            this.options = areaItem
        },
        /**
         * TODO:设置地址显示
         * @param item
         * @return {*}
         */
        setLocal(item) {
            return (item || []).length > 0 ? item.join(',').replace(new RegExp(/,/g), ' > ') : item
        },
        /**
         * TODO:关闭标签
         * @param tag
         */
        handleClose(tag) {
            this.userCenter.tags.splice(this.userCenter.tags.indexOf(tag), 1)
        },
        /**
         * TODO:文本框输入
         */
        handleInputConfirm() {
            if (this.inputValue && this.userCenter.tags.indexOf(this.inputValue) < 0) {
                this.userCenter.tags.push(this.inputValue)
            }
            this.inputVisible = false
            this.inputValue = ''
        },
        /**
         * TODO:展示文本框
         */
        showInput() {
            this.inputVisible = true
            this.$nextTick(() => {
                this.$refs.saveTagInput.focus()
            })
        },
    }
}
</script>

<style lang="less">
#information {
    .avatar-url {
        display: flex;
        align-items: center;
        position: relative;
        .el-form-item__content {
            margin-left: 0 !important;
        }
    }
    i {
        font-size: 16px;
        margin-right: 10px;
    }
    .tags {
        .el-tag {
            margin-right: 15px !important;
        }
        .el-input {
            width: 100px;
        }
    }
}
</style>
