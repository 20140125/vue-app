<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin: 20px">
            <el-breadcrumb-item v-for="(name,index) in parent_name" :key="index">{{name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <el-table :data="positionModel" border v-loading="loading" :element-loading-text="loadingText">
            <el-table-column label="#" prop="id"></el-table-column>
            <el-table-column label="编码" prop="code_id"></el-table-column>
            <el-table-column label="名称">
                <template slot-scope="scope">
                    <div style="cursor: pointer" @click="enter(scope.row)" v-if="scope.row.level!==5" v-html="scope.row.position_name"></div>
                    <div v-html="scope.row.position_name" v-if="scope.row.level===5"></div>
                </template>
            </el-table-column>
            <el-table-column label="上级编码" prop="parent_code_id"></el-table-column>
            <el-table-column label="上级名称">
                <template slot-scope="scope">
                    <div style="cursor: pointer" @click="leave(scope.row)" v-if="scope.row.parent_level!==0" v-html="scope.row.parent_position_name"></div>
                    <div v-html="scope.row.parent_position_name" v-if="scope.row.parent_level===0"></div>
                </template>
            </el-table-column>
            <el-table-column label="地区等级" prop="level"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import apiLists from '../../api/api'
    export default {
        name: "lists",
        data(){
            return {
                positionModel:[],
                code_id:'100000000000',
                level:1,
                status:'enter',
                parent_name:[],
                loading:true,
                loadingText:'玩命加载中...'
            }
        },
        methods:{
            /**
             * todo：地区列表
             */
            getLists:function () {
                let params = { level:this.level,code_id:this.code_id,status:this.status };
                apiLists.LocalLists(params).then(response=>{
                    this.positionModel = response.data.item;
                    this.loading = false;
                });
            },
            /**
             * todo：
             * @param index
             */
            enter:function (index) {
                this.level = index.level;
                this.code_id =  index.code_id;
                this.parent_name.push(index.position_name);
                console.log(this.parent_name);
                this.status ='enter';
                this.getLists();
            },
            /**
             * todo：
             * @param index
             */
            leave:function (index) {
                this.level = index.parent_level;
                this.code_id =  index.parent_code_id;
                this.status ='leave';
                this.parent_name.pop();
                console.log(this.parent_name);
                this.getLists();
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getLists();
            })
        }
    }
</script>

<style scoped>

</style>
