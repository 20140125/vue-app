<template>
    <el-row :gutter="24">
        <baseModule></baseModule>
    </el-row>
</template>
<script>
    import baseModule from './common/Base'
    export default{
        name: 'index',
        data () {
            return {

            }
        },
        components: {
            baseModule
        }
    }
</script>
