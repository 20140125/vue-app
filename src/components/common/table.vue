<template>
    <div>
        <el-form :inline="true" :rules="searchOptionsRules" :model="searchOption">
            <el-form-item v-for="(search,index) in searchOptions" v-if="search.type === 'input'" :key="index" :label="search.label" :prop="search.prop">
                <el-input :placeholder="search.tips" v-model="search.model"></el-input>
            </el-form-item>
            <el-form-item v-for="(search,index) in searchOptions" v-if="search.type === 'datetime'" :key="index" :label="search.label" :prop="search.prop">
                <el-date-picker :type="search.datetype || 'daterange'"
                                :value-format="search.format || 'yyyy-MM-dd'"
                                :start-placeholder="search.tips.split('-')[0]"
                                :end-placeholder="search.tips.split('-')[1]"
                                v-model="search.model">
                </el-date-picker>
            </el-form-item>
            <el-form-item v-for="(search,index) in searchOptions" v-if="search.type === 'select'" :key="index" :label="search.label" :prop="search.prop">
                <el-select :placeholder="search.tips" v-model="search.model">
                    <el-option v-for="(select,index) in search.options" :label="select.label" :value="select.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" plain="plain" @click="search">搜 索</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="data" :empty-text="empty" border>
            <el-table-column v-for="(column,index) in columns" :label="column.label" :prop="column.prop" :key="index"></el-table-column>
            <el-table-column label="Action">
                <el-button type="danger" icon="el-icon-delete" plain></el-button>  <!--这可以封装成组件-->
                <el-button type="primary" icon="el-icon-edit" plain></el-button>   <!--这可以封装成组件-->
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: 'Table',
        props:{
            //表格数据
            data:{
                type:Array,
                default:()=>[]
            },
            //表头参数
            columns:{
                type:Array,
                default:()=>[]
            },
            //表格数据为空时的说明
            empty:{
                type:String,
                default:'暂无数据'
            },
            //搜索规则
            searchOptionsRules:{
                type:Object,
                default:()=>{},
            },
            //搜索组件
            searchOptions:{
                type:Array,
                default:()=>[],
            },
            //搜索组件对应的prop
            searchOption:{
                type:Object,
                default:()=>{},
            },
        },
        methods:{
            search:function () {
                for (let i in this.searchOptions) {
                    this.searchOption[this.searchOptions[i].prop] = this.searchOptions[i].model
                }
                console.log(this.searchOption)
            }
        },
        mounted () {
            this.$nextTick(function () {
                console.log(this.searchOptions);
            })
        }
    }
</script>

<style scoped>

</style>
