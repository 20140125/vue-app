<template>
    <div id="weather">
        <el-form label-position="left" label-width="100px">
            <el-form-item label="城市名称：">
                <el-input v-model="cityName" :placeholder="`请输入城市名称(${Permission.city})`">
                    <template #append>
                        <el-button icon="el-icon-search" @click="getWeather">搜索</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="天气信息：">
                <JsonView :items="items"></JsonView>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import JsonView from '@/components/common/JsonView'
import URLS from  '@/api/urls'
export default {
    name: "GetWeather",
    components: {JsonView},
    data() {
        return {
            cityName: '',
            items: this.Permission.forecast
        }
    },
    methods: {
        /**
         * todo:获取天气
         * @return {Promise<void>}
         */
        async getWeather() {
            this.cacheArea = []
            await this.$store.dispatch('UPDATE_ACTIONS', { url: URLS.tools.getWeather, model: { city_name: this.cityName } }).then((response) => {
                let result = (((response || {}).data || {}).item || {}).lists || {}
                this.items = JSON.parse(result.forecast)
            })
        }
    }
}
</script>

<style lang="less">
</style>
