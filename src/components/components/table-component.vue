<template>
    <div>
        <el-form :inline="true" :rules="searchOptionsRules" :model="searchOption">
            <el-form-item v-for="(search,index) in searchOptions" v-if="search.type === 'input'" :key="index" :label="search.label" :prop="search.prop">
                <el-input :placeholder="search.tips" v-model="search.model"/>
            </el-form-item>
            <el-form-item v-for="(search,index) in searchOptions" v-if="search.type === 'datetime'" :key="index" :label="search.label" :prop="search.prop">
                <el-date-picker :type="search.datetype || 'daterange'"
                                :value-format="search.format || 'yyyy-MM-dd'"
                                :format="search.format || 'yyyy-MM-dd'"
                                :start-placeholder="search.tips.split('-')[0]"
                                :end-placeholder="search.tips.split('-')[1]"
                                v-model="search.model">
                </el-date-picker>
            </el-form-item>
            <el-form-item v-for="(search,index) in searchOptions" v-if="search.type === 'select'" :key="index" :label="search.label" :prop="search.prop">
                <el-select :placeholder="search.tips" v-model="search.model">
                    <el-option v-for="(select,index) in search.options" :label="select.label" :value="select.value" :key="index"/>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" plain="plain" @click="search">Search</el-button>
                <el-button icon="el-icon-download" type="primary" plain="plain" @click="ExcelExport">Excel Export To Server</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" :empty-text="empty" border>
            <el-table-column v-for="(column,index) in columns" show-overflow-tooltip :label="column.label" :prop="column.prop" :key="index"/>
            <el-table-column align="right" label="Action">
                <template slot-scope="scope">
                    <el-tooltip content="look before you leap" placement="top">
                        <el-button plain type="danger" icon="el-icon-delete" size="mini" @click="removeResource(scope.row,scope.$index)">Delete</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import Delete from '../common/Delete'
    import $url from '../../api/url'
    import apiLists from '../../api/api'
    import {mapActions} from 'vuex'
    import func from '../../api/func'
    export default {
        name: 'Table',
        components: {Delete},
        props:{
            //表格数据
            tableData:{
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
            //删除
            remove:{
                type:String,
                default:$url.componentAction
            }
        },
        methods:{
            ...mapActions(['saveSystemLog']),
            search:function () {
                for (let i in this.searchOptions) {
                    this.searchOption[this.searchOptions[i].prop] = this.searchOptions[i].model
                }
                this.$emit("search",this.searchOption);
            },
            /**
             * TODO：excelExport
             */
            ExcelExport:function() {
                apiLists.ExcelExport(this.searchOption).then(response=>{
                    if (response && response.data.code === 200) {
                        let data = { href:$url.excelExport, msg:response.data.msg, token:this.$store.state.login.token };
                        this.saveSystemLog(data);
                        this.$message({type:'success',message:response.data.msg});
                        window.open(process.env.API_ROOT+$url.fileDownload.replace('/','')+"?token="+this.$store.state.login.token+"&path="+response.data.item.href+"&name="+response.data.item.name,'__target');
                        return false;
                    }
                    this.$message({type:'warning',message:response.data.msg});
                });
            },
            /**
             * todo：删除记录
             * @param item
             * @param index
             */
            removeResource:function (item,index) {
                this.$confirm('This operation will always delete the record, whether to continue？','Delete Record',{confirmButtonText:'Confirm', cancelButtonText:'Cancel', type:'warning'}).then(()=>{
                    apiLists.RemoveData({id:item.id},this.remove).then(response=>{
                        if (response && response.data.code === 200) {
                            this.tableData.splice(index,1);
                            let data = { href:this.remove, msg:response.data.msg, token:this.$store.state.login.token };
                            this.saveSystemLog(data);
                            this.$message({type:'success',message:response.data.msg});
                            this.$emit('removeSuccess');
                            return false;
                        }
                        this.$message({type:'warning',message:response.data.msg});
                    },error=>{
                        console.log(error);
                    })
                }).catch(()=>{
                    this.$message({type:'info',message:'Cancelled！'});
                })
            }
        },
        mounted () {
            this.$nextTick(function () {

            })
        }
    }
</script>

<style scoped>

</style>
