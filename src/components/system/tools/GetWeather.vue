<template>
    <div id="weather">
        <el-form label-position="left" label-width="100px">
            <el-form-item label="城市名称：">
                <el-autocomplete v-model="cityName" style="width: 300px" :fetch-suggestions="querySearch" @select="getWeather" prefix-icon="el-icon-search" :placeholder="`请输入城市名称(${Permission.city})`">
                    <template #default="scope">
                        <span v-html="scope.item.name"></span>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="天气信息：">
                <JsonView :items="items"></JsonView>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import JsonView from '@/components/common/JsonView';
import URLS from '@/api/urls';

export default {
    name: 'GetWeather',
    components: {JsonView},
    data() {
        return {
            cityName: '',
            items: this.Permission.forecast
        };
    },
    computed: {
        cacheArea() {
            return this.$store.state.area.cacheArea2;
        }
    },
    methods: {
        /**
         * todo:搜索匹配
         * @param string
         * @param cb
         * @return {Promise<void>}
         */
        async querySearch(string, cb) {
            let result = [];
            this.$store.dispatch('area/getAreaCacheLists', { children: false }).then(() => {
                this.cacheArea.forEach((item) => {
                    if (item.name.indexOf(string) > -1) {
                        result.push(item);
                    }
                });
                cb(result);
            });
        },
        /**
         * todo:获取天气
         * @param item
         * @return {Promise<void>}
         */
        async getWeather(item) {
            this.cityName = item.name
            await this.$store.dispatch('UPDATE_ACTIONS', { url: URLS.tools.getWeather, model: { city_name: this.cityName } }).then((response) => {
                let result = (((response || {}).data || {}).item || {}).lists || {};
                this.items = JSON.parse(result.forecast);
            });
        }
    }
};
</script>

<style lang="less">
</style>
