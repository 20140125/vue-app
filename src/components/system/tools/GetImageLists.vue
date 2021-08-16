<template>
    <div id="imageLists">
        <el-form label-position="left" label-width="100px">
            <el-form-item label="关键词：">
                <el-input v-model="keywords" :placeholder="`请输入关键字查询`">
                    <template #append>
                        <el-button icon="el-icon-search" @click="getImageLists">搜索</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="图床列表：">
                <el-carousel indicator-position="none" type="card">
                    <el-carousel-item v-for="(item, index) in imageLists" :key="index">
                        <el-image :src="item.href"></el-image>
                    </el-carousel-item>
                </el-carousel>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import URLS from '@/api/urls'


export default {
    name: 'GetImageLists',
    data() {
        return {
            keywords: '',
            imageLists: [],
            page: 0,
        }
    },
    components: {  },
    methods: {
        /**
         * todo:获取图片
         * @return {Promise<void>}
         */
        async getImageLists() {
            this.page += 1
            await this.$store.dispatch('UPDATE_ACTIONS', { url: URLS.tools.getImageLists, model: { name: this.keywords, page: this.page, limit: 273 } }).then((response) => {
                let imageLists = ((((response || {}).data || {}).item || {}).lists || {}).data || []
                this.imageLists = [...this.imageLists, ...imageLists]
            })
        },
    }
}
</script>

<style lang="less">
#imageLists {
    .container {
        min-height: 90vh;
    }
    .card {
        padding: 10px;
        background-color: white;
        border-radius: 3px;
        color: #666;
        line-height: 1.5;
        word-break: break-all;
        .img {
            width: 100%;
            margin-bottom: 5px;
            cursor: pointer;
        }
    }
}
</style>
