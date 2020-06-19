<template>
    <div id="app">
        <el-cascader-panel :options="cityModel" @change="getChangeVal" ref="city" :props="props"></el-cascader-panel>
    </div>
</template>

<script>
    import apiLists from "../../../api/api";
    import $url from "../../../api/url";
    export default {
        name: "city",
        data() {
            return {
                pid:1,
                cityModel:[],
                props:{
                    value:'name',
                    label:'name'
                }
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getCity(this.pid)
            })
        },
        methods:{
            /**
             * TODO：获取城市列表
             * @param pid
             */
            getCity:function(pid) {
                apiLists.AreaLists({parent_id:pid},$url.areaLists).then((response)=>{
                    if (response && response.data.code === 200) {
                        this.setOptions(response.data.item);
                    }
                });
            },
            /**
             * TODO:设置数据
             * @param data
             */
            setOptions:function(data) {
                for (let i in data) {
                    if (data[i].children.length === 0) {
                        delete data[i].children
                    }
                    this.setOptions(data[i].children)
                }
                this.cityModel = data;
            },
            /**
             * todo:获取节点的值
             */
            getChangeVal:function () {
                this.$emit('saveCityNode',this.$refs['city'].getCheckedNodes())
            }
        }
    }
</script>

<style scoped>

</style>
