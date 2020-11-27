<template>
    <div v-loading="loading" :element-loading-text="loadingText" style="padding: 20px !important;">
        <el-cascader v-model="value" :options="sooGifTypeLists" filterable :props="{ value: 'id', label: 'name' }" clearable @change="getImageList"></el-cascader>
        <image-bed :file-lists="fileLists" :pagination="pagination" :tab-change="tabChange"></image-bed>
        <el-dialog :visible.sync="visible" title="修改密码" width="625px" center top="25vh" :show-close="false">
            <el-button style="margin-bottom: 10px" plain v-for="(oauth,index) in oauthConfig" type="primary" :key="index" v-if="oauth.status === 1" @click="oauthLogin(oauth.value)">
                {{oauth.name.toUpperCase()}}
            </el-button>
        </el-dialog>
    </div>
</template>

<script>
    import apiLists from '../api/api'
    import $urls from '../api/url'
    import {mapActions, mapGetters} from 'vuex'
    import imageBed from '../components/image/bed'
    export default {
        name: 'default',
        components: {imageBed},
        data () {
            return {
                sooGifTypeLists: [],
                fileLists: [],
                pagination: {limit: 30, page: 1, total: 0},
                loading: true,
                loadingText: '玩命加载中。。。',
                value: '',
                visible: false,
                tabChange: false,
                id: 0
            }
        },
        computed: {
            ...mapGetters(['oauthConfig'])
        },
        created () {
            let __this = this
            window.addEventListener('scroll', function () {
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
                if (scrollTop + window.innerHeight >= document.body.clientHeight) {
                    __this.getImageList([null, __this.id])
                    __this.pagination.page++
                }
            })
        },
        methods: {
            ...mapActions(['getOauthConfig']),
            /**
             * todo:获取图床信息
             * @param node
             */
            getImageList: function (node) {
                this.tabChange = node[0] !== null
                this.pagination.page = this.tabChange ? 1 : this.pagination.page
                console.log(this.tabChange, this.pagination.page)
                this.id = node[1]
                apiLists.ImageBed({id: node[1], page: this.pagination.page, limit: this.pagination.limit}, $urls.sooGif).then(response => {
                    if (response && response.data.code === 200) {
                        this.fileLists = response.data.item.data
                        this.pagination.total = response.data.item.total
                    } else {
                        this.visible = true
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
            })
        }
    }
</script>

<style>
.el-cascader{width: 100%; margin-bottom: 20px !important;}
.el-cascader-panel{width: 96% !important;}
@media screen and (max-width: 1024px) and (min-width: 768px) {
    .el-cascader-panel{width: 98% !important;}
}
</style>
