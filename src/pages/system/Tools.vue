<template>
    <BaseLayout :loading="loading">
        <template #body>
            <el-tabs type="card" v-model="activeName">
                <el-tab-pane name="getAddress" label="获取地址">
                    <GetAddress></GetAddress>
                </el-tab-pane>
                <el-tab-pane name="getAreaWeather" label="获取天气">
                    <GetWeather></GetWeather>
                </el-tab-pane>
                <el-tab-pane name="getImageType" label="图片分类抓取">
                    <SyncImageType></SyncImageType>
                </el-tab-pane>
                <el-tab-pane name="getImageLists" label="图片抓取">
                    <SyncImageLists></SyncImageLists>
                </el-tab-pane>
            </el-tabs>
        </template>
    </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import GetAddress from '@/components/system/tools/GetAddress'
import GetWeather from '@/components/system/tools/GetWeather'
import SyncImageType from '@/components/system/tools/SyncImageType'
import SyncImageLists from '@/components/system/tools/SyncImageLists'


export default {
    name: 'SystemTools',
    components: { GetWeather, GetAddress, SyncImageType, SyncImageLists, BaseLayout },
    data() {
        return {
            loading: false,
            activeName: 'getAddress'
        }
    }
}
</script>

<style scoped>

</style>
