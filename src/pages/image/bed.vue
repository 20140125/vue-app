<template>
    <div v-loading="loading" :element-loading-text="loadingText" style="padding: 20px !important;">
        <el-input style="margin-bottom: 20px" v-model="name" placeholder="请输入关键词搜索">
            <el-button slot="append" icon="el-icon-search" @click="searchImageLists">搜 索</el-button>
        </el-input>
        <image-bed :file-lists="fileLists" :pagination="pagination" :tab-change="tabChange" class="image-bed" :showPagination="true"></image-bed>
        <el-pagination
            v-if="pagination.total"
            layout="prev, pager, next"
            :total="pagination.total"
            :page-size="pagination.limit"
            :current-page="pagination.page"
            style="text-align: center;margin-top:30px"
            @current-change="currentChange">
        </el-pagination>
    </div>
</template>

<script>
    import apiLists from '../../api/api'
    import $urls from '../../api/url'
    import imageBed from '../../components/image/bed'
    export default {
        name: 'default',
        components: {imageBed},
        data () {
            return {
                fileLists: [],
                pagination: {limit: 30, page: 0, total: 0},
                loading: true,
                loadingText: '玩命加载中。。。',
                tabChange: false,
                name: ''
            }
        },
        methods: {
            /**
             * todo:随机展示图片
             */
            getDefaultImage: async function () {
                let response = await apiLists.ImageBed({num: 1}, $urls.defaultImage).catch(error => {
                    console.log(error)
                })
                if (response.data.code === 200) {
                    this.numArr = response.data.item
                    this.name = this.numArr[(Math.random() * 7 | 0) + 1]
                    this.getImageLists()
                }
            },
            /**
             * todo:根据名称搜索图片
             */
            getImageLists: function () {
                this.loading = true
                apiLists.ImageBed({ name: this.name, page: this.pagination.page, limit: this.pagination.limit, source: 'mini_program' }, $urls.newImage).then(response => {
                    if (response && response.data.code === 200) {
                        this.fileLists = response.data.item.data
                        this.pagination.total = response.data.item.total
                        this.loading = false
                    }
                })
            },
            /**
             * todo:根据名称搜索图片
             */
            searchImageLists: function () {
                this.pagination.page = 1
                this.getImageLists()
            },
            /**
             * todo:分页
             */
            currentChange: function (page) {
                this.pagination.page = page
                this.getImageLists()
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.getDefaultImage()
                this.$message({type: 'success', message: '所有图片资源均来自96编辑器', offset: 120})
            })
        }
    }
</script>

<style scoped>

</style>
