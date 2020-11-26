<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-row :gutter="24">
            <!--文件列表-->
            <el-col :xl="{'span':4}" :lg="{'span':4}" :md="{'span':24}" :sm="{'span':24}" :xs="{'span':24}" style="margin-bottom: 20px">
                <el-input placeholder="输入关键字搜索" v-model="filterText" style="margin-bottom: 20px"/>
                <el-tree :data="sooGifTypeLists"
                         :highlight-current="highlight"
                         :props="props"
                         :default-expand-all="true"
                         :filter-node-method="filterNode"
                         :node-key="props.id" @node-click="getImageList"
                         ref="tree"
                         style="background-color: #393d49">
                </el-tree>
            </el-col>
            <!--文件列表-->
            <!--文件内容-->
            <el-col :xl="{'span':19,'push':1}" :lg="{'span':19,'push':1}" :md="{'span':24}" :sm="{'span':24}" :xs="{'span':24}">
                <image-bed :filters-lists-part="filtersListsPart" :file-lists="fileLists" :show-delete-btn="false" :show-upload-btn="false" :pagination="pagination"></image-bed>
            </el-col>
            <!--文件内容-->
        </el-row>
    </div>
</template>

<script>
    import apiLists from '../../api/api'
    import $urls from '../../api/url'
    import ImageBed from '../../components/image/view'
    export default {
        name: 'lists',
        components: {ImageBed},
        data () {
            return {
                /* 树组件 */
                props: {label: 'name', children: 'children', isLeaf: false},
                /* 高亮选中的节点 */
                highlight: true,
                sooGifTypeLists: [],
                fileLists: [],
                filtersListsPart: [],
                pagination: {limit: 21, page: 1, total: 0},
                loading: true,
                loadingText: '玩命加载中。。。',
                filterText: ''
            }
        },
        watch: {
            filterText (val) {
                this.$refs.tree.filter(val)
            }
        },
        methods: {
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
                apiLists.ImageBed({id: node.id}, $urls.imageBed).then(response => {
                    if (response && response.data.code === 200) {
                        this.fileLists = response.data.item.data
                        this.pagination.total = this.fileLists.length
                        this.filtersListsPart = this.fileLists.slice(0, this.pagination.total > this.pagination.limit ? this.pagination.limit : this.pagination.total)
                    }
                })
            },
            /**
             * todo:获取图床列表
             */
            getSooGifType: function () {
                apiLists.ImageBed({id: 0}, $urls.imageBed).then(response => {
                    if (response && response.data.code === 200) {
                        this.sooGifTypeLists = response.data.item
                        this.loading = false
                    }
                })
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
