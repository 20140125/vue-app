<template>
    <div v-loading="loading" :element-loading-text="loadingText" style="padding: 20px !important;margin-left: 100px !important;">
        <el-row :gutter="24">
            <!--文件列表-->
            <el-col :xl="{'span':4}" :lg="{'span':4}" :md="{'span':24}" :sm="{'span':24}" :xs="{'span':24}" style="margin-bottom: 20px">
                <el-input placeholder="输入关键字搜索" v-model="filterText" style="margin-bottom: 20px"/>
                <el-tree :data="sooGifTypeLists"
                         :highlight-current="highlight"
                         :props="props"
                         :default-expanded-keys="defaultExpanded"
                         :filter-node-method="filterNode"
                         :node-key="props.id"
                         accordion
                         @node-click="getImageList"
                         ref="tree"
                         style="background-color: #393d49">
                </el-tree>
            </el-col>
            <!--文件列表-->
            <!--文件内容-->
            <el-col :xl="{'span':20}" :lg="{'span':20}" :md="{'span':24}" :sm="{'span':24}" :xs="{'span':24}">
                <el-row :span="24">
                    <el-col :span="3"  v-for="(image,index) in filtersListsPart" :key="index" style="margin:10px 10px 0 0">
                        <el-card :body-style="{ padding: '0',border: 'none', 'text-align':'center', 'height':'auto'}" shadow="hover">
                            <el-image lazy fit="contain" :title="image.label"  :alt="image.label"  :src="image.url" :preview-src-list="[image.url]"></el-image>
                            <div style="padding: 14px;">
                                <el-tag style="cursor: pointer;margin-bottom: 5px">{{image.label}}</el-tag>
                                <el-tag style="cursor: pointer" type="success">soogif</el-tag>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-pagination
                    v-if="pagination.total"
                    layout="prev, pager, next"
                    :total="pagination.total"
                    :page-size="pagination.limit"
                    :current-page="pagination.page"
                    medium
                    style="text-align: center;margin: 30px 0"
                    @current-change="currentChange">
                </el-pagination>
            </el-col>
            <!--文件内容-->
        </el-row>
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
    export default {
        name: 'lists',
        data () {
            return {
                /* 树组件 */
                props: {label: 'name', children: 'children', isLeaf: false, id: 'id'},
                /* 高亮选中的节点 */
                highlight: true,
                sooGifTypeLists: [],
                fileLists: [],
                filtersListsPart: [],
                pagination: {limit: 28, page: 1, total: 0},
                loading: true,
                loadingText: '玩命加载中。。。',
                filterText: '',
                defaultExpanded: [1, 9, 45],
                visible: false
            }
        },
        computed: {
            ...mapGetters(['oauthConfig'])
        },
        watch: {
            filterText (val) {
                this.$refs.tree.filter(val)
            }
        },
        methods: {
            ...mapActions(['getOauthConfig']),
            /**
             * TODO：搜索文件名称
             * @param value
             * @param data
             */
            filterNode: function (value, data) {
                if (!value) return true
                return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
            },
            /**
             * todo:获取图床信息
             * @param node
             */
            getImageList: function (node) {
                apiLists.ImageBed({id: node.id}, $urls.sooGif).then(response => {
                    if (response && response.data.code === 200) {
                        this.fileLists = response.data.item.data
                        this.pagination.total = this.fileLists.length
                        this.filtersListsPart = this.fileLists.slice(0, this.pagination.total > this.pagination.limit ? this.pagination.limit : this.pagination.total)
                    } else {
                        this.visible = true
                    }
                })
            },
            /**
             * todo:获取图床列表
             */
            getSooGifType: function () {
                apiLists.ImageBed({id: 0}, $urls.sooGif).then(response => {
                    if (response && response.data.code === 200) {
                        this.sooGifTypeLists = response.data.item
                        this.getOauthConfig('Oauth')
                        this.loading = false
                    }
                })
            },
            /**
             * todo:分页展示数据
             * @param page
             */
            currentChange: function (page) {
                this.pagination.page = page
                this.getTransactionData()
            },
            /**
             * TODO:授权登录
             * @param href
             */
            oauthLogin: function (href) {
                window.open(href, '_self')
            },
            /**
             * todo：数据分页
             */
            getTransactionData: function () {
                let offset = this.pagination.limit * (this.pagination.page - 1)
                this.filtersListsPart = (offset + this.pagination.limit >= this.fileLists.length)
                    ? this.fileLists.slice(offset, this.fileLists.length)
                    : this.fileLists.slice(offset, offset + this.pagination.limit)
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.getSooGifType()
            })
        }
    }
</script>

<style scoped>

</style>
