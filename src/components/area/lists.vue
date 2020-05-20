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
                    <el-button size="mini" plain type="primary" @click="getWeather(scope.row)" icon="el-icon-search">点击查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url'
    export default {
        name: "lists",
        data(){
            return {
                areaLists:[],
                loading:true,
                loadingText:'玩命加载中。。。',

                search:'',
                pid:1,
            }
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
                let params = { code:areaObj.code,id:areaObj.id };
                apiLists.AreaWeather(params).then(response=>{
                    if (response && response.data.code === 200) {
                        this.$confirm(JSON.stringify(response.data.item));
                    }
                })
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
