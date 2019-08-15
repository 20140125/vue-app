<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-table :data="areaLists.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                  row-key="id"
                  :tree-props="{children: '__child', hasChildren: 'hasChildren'}">
            <el-table-column label="地区名称" prop="name"></el-table-column>
            <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" placeholder="输入关键词查询"/>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import func from '../../api/func'
    export default {
        name: "lists",
        data(){
            return {
                areaLists:[],
                loading:true,
                loadingText:'玩命加载中。。。',

                search:''
            }
        },
        methods:{
            /**
             * todo：获取城市列表
             */
            getAreaLists:function () {
                apiLists.AreaLists({}).then(response=>{
                    if (response && response.data.code === 200) {
                        this.areaLists = func.set_tree(response.data.item,1);
                        this.loading = false;
                    }
                });
            },
        },
        mounted() {
            this.$nextTick(function () {
                this.getAreaLists()
            });
        }
    }
</script>

<style scoped>

</style>
