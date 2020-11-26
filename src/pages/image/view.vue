<template>
    <div v-loading="loading" :element-loading-text="loadingText" style="margin: 0 20px" id="imageView">
        <ImageBed :file-lists="fileLists" :filters-lists-part="filtersListsPart" :show-upload-btn="true" :show-delete-btn="true" :pagination="pagination"></ImageBed>
    </div>
</template>

<script>
    import apiLists from '../../api/api'
    import {mapGetters, mapActions} from 'vuex'
    import CommonUpload from '../../components/CommonUpload'
    import ImageBed from '../../components/image/view'
    export default {
        name: 'imageView',
        components: {CommonUpload, ImageBed},
        data () {
            return {
                loading: false,
                fileLists: [],
                filtersListsPart: [],
                loadingText: '数据加载中...',
                fullImagePart: [],
                path: 'storage_path',
                visible: false,
                pagination: {limit: 9, page: 1, total: 0}
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        mounted () {
            this.$nextTick(function () {
                this.getFileLists(this.path)
            })
        },
        methods: {
            ...mapActions(['saveSystemLog']),
            /**
             * todo：获取文件列表
             * @param path
             */
            getFileLists: function (path) {
                this.loading = true
                let params = {path: path, basename: '/app/public//', sort: 'time', sort_order: 'desc'}
                apiLists.FileLists(params).then((response) => {
                    if (response && response.data.code === 200) {
                        this.getImage(response.data.item)
                        this.loading = false
                    }
                })
            },
            /**
             * todo:文件列表
             * @param imageObj
             */
            getImage: function (imageObj) {
                this.filtersListsPart = []
                this.fileLists = []
                imageObj.map(item => {
                    if (item.children.length > 0) {
                        item.children.map(row => {
                            let ext = row.label.split('.')[1]
                            let imgExt = ['png', 'jpg', 'jpeg', 'gif']
                            if (imgExt.includes(ext.toLowerCase())) {
                                this.$set(row, 'url', this.userInfo.local + 'storage' + row.path.substr(row.path.indexOf('public') + 6, row.path.length - row.path.indexOf('public')))
                                this.fileLists.push(row)
                                this.fullImagePart.push(row.url)
                            }
                        })
                    }
                })
                this.pagination.total = this.fileLists.length
                this.fileLists.sort(function (a, b) {
                    return a.time < b.time ? 1 : -1
                })
                this.filtersListsPart = this.fileLists.slice(0, this.pagination.total > this.pagination.limit ? this.pagination.limit : this.pagination.total)
            }
        }
    }
</script>
<style lang="less">
#imageView {
    .el-card {
        border-radius: 0 !important;
        -webkit-border-radius: 0 !important;
        -moz-border-radius: 0 !important;
    }
    .time {
        font-size: 13px;
        color: #999;
    }
    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }
    .button {
        padding: 0;
        float: right;
    }
    .image {
        width: 100%;
        height: 300px;
        display: block;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
}
</style>
