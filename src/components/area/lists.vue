<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-table :data="areaLists.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                  row-key="id"
                  :tree-props="{children: '__child', hasChildren: 'hasChildren'}"
                  lazy
                  :load="load">
            <el-table-column label="地区名称" prop="name"/>
            <el-table-column label="天气" prop="info" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" placeholder="输入关键词查询"/>
                </template>
                <template slot-scope="scope">
                    <el-button size="mini" plain type="primary" @click="getWeather(scope.row)" icon="el-icon-edit">天气同步</el-button>
                    <el-button size="mini" plain type="primary" @click="searchWeather(scope.row)" icon="el-icon-search">天气预告</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="showCity" :width="dialogWidth" :title="'【'+cityName+'】天气预告'" center>
            <city :weather="weather"/>
        </el-dialog>
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url'
    import City from "../common/city/city";
    import {mapGetters} from 'vuex'
    export default {
        name: "lists",
        components: {City},
        data(){
            return {
                areaLists:[],
                loading:true,
                loadingText:'玩命加载中。。。',
                search:'',
                pid:1,
                showCity:false,
                cityName:'',
                weather:{},
            }
        },
        computed:{
            ...mapGetters(['dialogWidth'])
        },
        methods:{
            /**
             * todo：获取城市列表
             */
            getAreaLists:function (pid) {
                apiLists.AreaLists({parent_id:pid},$url.areaIndex).then(response=>{
                    if (response && response.data.code === 200) {
                        this.areaLists = response.data.item;
                        this.loading = false;
                    }
                });
            },
            /**
             * TODO:懒加载数据
             * @param tree
             * @param treeNode
             * @param resolve
             */
            load:function (tree, treeNode, resolve) {
                apiLists.AreaLists({parent_id:tree.id},$url.areaIndex).then(response=>{
                    if (response && response.data.code === 200) {
                        setTimeout(()=>{
                            resolve(response.data.item);
                        },500)
                    }
                });
            },
            /**
             * TODO:获取城市天气
             * @param areaObj
             */
            getWeather:function (areaObj) {
                let params = { code:areaObj.code,id:areaObj.id,parent_id:areaObj.pid };
                apiLists.AreaWeather(params).then(response=>{
                    if (response && response.data.code === 200) {
                        this.$message.success(response.data.msg)
                    }
                })
            },
            /**
             * todo:天气预告信息展示
             * @param item
             */
            searchWeather:function (item) {
                this.showCity = true;
                this.cityName = item.name;
                this.weather = JSON.parse(item.forecast);
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getAreaLists(this.pid)
            });
        }
    }
</script>

<style scoped>

</style>
