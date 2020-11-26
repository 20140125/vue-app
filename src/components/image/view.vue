<template>
    <div>
        <CommonUpload v-if="showUploadBtn" :check-size="false"
                      :upload-limit="1000"
                      :file-size="2048"
                      :show-file-list="false"
                      :btn-style="{margin:'0 0 10px 65px'}"
                      :upload-success="uploadSuccess">
        </CommonUpload>
        <el-row :span="24">
            <el-col :span="7"  v-for="(image,index) in imageViewLists" :key="index" :offset="1" style="margin-bottom: 10px;margin-top: 10px">
                <el-card :body-style="{ padding: '0px',border: 'none','height':'360px','text-align': 'center' }" shadow="hover">
                    <el-image lazy fit="contain" :title="image.label"  :alt="image.label"  :src="image.url" class="image" :preview-src-list="[image.url]"></el-image>
                    <div style="padding: 14px;" v-if="showDeleteBtn">
                        <span v-html="image.label"></span>
                        <div style="padding: 10px 0">
                            <time class="time" style="float: left">{{ image.time }}</time>
                            <el-button @click="deleteImg(image,index)" type="text" class="button" icon="el-icon-delete">删 除</el-button>
                        </div>
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
            small
            style="float:right;margin:30px 0"
            @current-change="currentChange">
        </el-pagination>
    </div>
</template>

<script>
    import CommonUpload from '../CommonUpload'
    import apiLists from '../../api/api'
    import $url from '../../api/url'
    export default {
        name: 'imageBed',
        components: {CommonUpload},
        props: {
            fileLists: {
                type: Array,
                default: () => []
            },
            filtersListsPart: {
                type: Array,
                default: () => []
            },
            showUploadBtn: {
                type: Boolean,
                default: () => false
            },
            showDeleteBtn: {
                type: Boolean,
                default: () => false
            },
            pagination: {
                type: Object,
                default: () => {}
            }
        },
        data () {
            return {
                imageViewLists: []
            }
        },
        watch: {
            filtersListsPart: function () {
                this.imageViewLists = this.filtersListsPart
            }
        },
        methods: {
            /**
             * todo:文件上传成功
             * @param response
             * @param file
             */
            uploadSuccess: function (response, file) {
                console.log(response, file)
            },
            /**
             * todo:图片删除
             * @param image
             * @param index
             */
            deleteImg: function (image, index) {
                this.$confirm('此操作将永远删除该条记录，是否继续？', '删除记录', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
                    let params = {path: image.path}
                    apiLists.FileDelete(params).then((response) => {
                        if (response && response.data.code === 200) {
                            let data = { msg: response.data.msg + '：' + image.path, href: $url.fileDelete }
                            this.saveSystemLog(data)
                            this.getFileLists(this.path)
                            this.$message({type: 'success', message: response.data.msg + '：' + image.alt})
                        }
                    })
                }).catch(() => {
                    this.$message({type: 'info', message: 'cancel remove！'})
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
             * todo：数据分页
             */
            getTransactionData: function () {
                let offset = this.pagination.limit * (this.pagination.page - 1)
                this.imageViewLists = (offset + this.pagination.limit >= this.fileLists.length)
                    ? this.fileLists.slice(offset, this.fileLists.length)
                    : this.fileLists.slice(offset, offset + this.pagination.limit)
            }
        }
    }
</script>

<style scoped>

</style>
