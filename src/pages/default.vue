<template>
    <div v-loading="loading" :element-loading-text="loadingText" style="padding: 20px !important;">
        <el-cascader v-model="value" :options="sooGifTypeLists" filterable :props="{ value: 'id', label: 'name' }" clearable @change="getImageList" placeholder="请选择需要的表情包"></el-cascader>
        <image-bed :file-lists="fileLists" :pagination="pagination" :tab-change="tabChange"></image-bed>
        <el-dialog :visible.sync="visible" title="修改密码" width="625px" center top="25vh" :show-close="false">
            <el-button style="margin-bottom: 10px" plain v-for="(oauth,index) in oauthConfig" type="primary" :key="index" v-if="oauth.status === 1" @click="oauthLogin(oauth.value)">
                {{oauth.name.toUpperCase()}}
            </el-button>
        </el-dialog>
        <i class="msg-icon" @click="getMsgDialog" v-show="token">
            <i :class="chatMsgClass" style="margin:13px 15px;">
                <el-badge :value="chat.msgCount" v-if="chat.msgCount" type="danger" class="msg-count"></el-badge>
            </i>
        </i>
        <!---chatRoom Start-->
        <chat-room :chat-visible="chatVisible" :dialog-width="dialogWidth" @setMsgCount="setMsgCount" v-if="showMessageDialog"></chat-room>
        <!---chatRoom End-->
    </div>
</template>

<script>
    import apiLists from '../api/api'
    import $urls from '../api/url'
    import {mapActions, mapGetters} from 'vuex'
    import imageBed from '../components/image/bed'
    import ChatRoom from '../components/chatRoom/Main'
    import store from '../store'
    import code from '../api/code'
    export default {
        name: 'default',
        components: {ChatRoom, imageBed},
        data () {
            return {
                sooGifTypeLists: [],
                fileLists: [],
                pagination: {limit: 30, page: 0, total: 0},
                loading: true,
                loadingText: '玩命加载中。。。',
                value: '',
                visible: false,
                tabChange: false,
                numArr: [2, 3, 4, 5, 6, 7, 8],
                id: 0,
                chatMsgClass: 'el-icon-chat-dot-round',
                chatVisible: false,
                chat: {},
                token: localStorage.getItem('token'),
                showMessageDialog: false
            }
        },
        computed: {
            ...mapGetters(['oauthConfig', 'dialogWidth'])
        },
        created () {
            let __this = this
            window.addEventListener('scroll', function () {
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
                if (scrollTop + window.innerHeight >= document.body.clientHeight) {
                    __this.getImageList([null, __this.id])
                }
            })
            // 初始化聊天系统参数
            this.chat = {
                msgCount: 0,
                total: 0,
                online: 0
            }
            if (this.token) {
                apiLists.CheckToken({token: localStorage.getItem('token')}).then(response => {
                    if (response && response.data.code === code.SUCCESS) {
                        this.showMessageDialog = true
                        store.commit('setUserInfo', response.data.item)
                    }
                })
            }
        },
        methods: {
            ...mapActions(['getOauthConfig']),
            /**
             * todo:设置未读消息数
             * @param msgCount
             */
            setMsgCount: function (msgCount) {
                this.chat.msgCount = msgCount
            },
            /**
             * TODO:弹出框展示
             */
            getMsgDialog: function () {
                this.chatVisible = !this.chatVisible
                if (!this.chatVisible) {
                    this.chatMsgClass = 'el-icon-chat-dot-round'
                } else {
                    this.chatMsgClass = 'el-icon-close'
                }
            },
            /**
             * todo:获取图床信息
             * @param node
             */
            getImageList: function (node) {
                this.tabChange = node[0] !== null
                this.pagination.page = this.tabChange ? 0 : this.pagination.page
                this.pagination.page++
                console.log(this.tabChange, this.pagination.page)
                this.id = node[1]
                apiLists.ImageBed({id: node[1], page: this.pagination.page, limit: this.pagination.limit}, $urls.sooGif).then(response => {
                    if (response && response.data.code === 200) {
                        this.fileLists = response.data.item.data
                        this.pagination.total = response.data.item.total
                    } else {
                        localStorage.setItem('token', '')
                        this.visible = true
                        this.showMessageDialog = false
                        this.chatVisible = false
                    }
                })
            },
            /**
             * TODO:设置数据
             * @param data
             */
            setOptions: function (data) {
                for (let i in data) {
                    if (data[i].children.length === 0) {
                        delete data[i].children
                    }
                    this.setOptions(data[i].children)
                }
                this.options = data
            },
            /**
             * todo:获取图床列表
             */
            getSooGifType: function () {
                apiLists.ImageBed({id: 0}, $urls.sooGif).then(response => {
                    if (response && response.data.code === 200) {
                        this.sooGifTypeLists = response.data.item
                        this.setOptions(this.sooGifTypeLists)
                        this.getOauthConfig('Oauth')
                        this.loading = false
                    }
                })
            },
            /**
             * TODO:授权登录
             * @param href
             */
            oauthLogin: function (href) {
                window.open(href, '_self')
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.getSooGifType()
                this.$message({type: 'success', message: '所有图片资源均来自96编辑器', offset: 120})
                this.getImageList([1, this.numArr[(Math.random() * 7 | 0) + 1]])
            })
        }
    }
</script>

<style scoped>
.el-cascader{width: 100%; margin-bottom: 20px !important;}
.el-cascader-panel{width: 96% !important;}
@media screen and (max-width: 1024px) and (min-width: 768px) {
    .el-cascader-panel{width: 98% !important;}
}
.msg-icon{
    font-size: 50px;
    color:#ffffff;
    position:fixed;
    cursor: pointer;
    right:10px;
    bottom:10%;
    width: 80px;
    height: 80px;
    background: #409EFF;
    border-radius: 40px;
    -moz-border-radius:40px;
    -webkit-border-radius:40px;
    z-index: 20004;
}
.msg-count{
    position:absolute;
    right:9px;
    bottom:54%;
}
</style>
