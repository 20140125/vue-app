<template>
    <el-row :gutter="24">
        <baseModule></baseModule>
    </el-row>
</template>
<script>
    import baseModule from '../components/common/Base'
    export default{
        name:'index',
        data(){
            return {

            }
        },
        components:{
            baseModule
        }
    }
</script>
