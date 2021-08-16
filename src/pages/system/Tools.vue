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
                <el-tab-pane name="getImageLists" label="获取表情">
                    <GetImageLists></GetImageLists>
                </el-tab-pane>
            </el-tabs>
        </template>
    </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import GetAddress from '@/components/system/tools/GetAddress'
import GetWeather from '@/components/system/tools/GetWeather'
import GetImageLists from '@/components/system/tools/GetImageLists'

export default {
    name: 'SystemTools',
    components: { GetImageLists, GetWeather, GetAddress, BaseLayout },
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
