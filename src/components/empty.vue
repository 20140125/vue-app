<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="5" :offset="9">
                <img src="../assets/404.png" alt="返回首页" style="width:500px;margin-top: 200px">
                <el-link :href="userInfo.local" style="font-size: 18px">返回首页</el-link>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "empty",
        data(){
            return {}
        },
        computed:{
            ...mapGetters(['userInfo'])
        },
        mounted() {
            console.log(this.userInfo)
        }
    }
</script>

<style scoped>

</style>
