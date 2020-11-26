<template>
    <el-row :gutter="24">
        <baseModule></baseModule>
    </el-row>
</template>
<script>
    import baseModule from './base/Base'
    export default{
        name: 'index',
        components: {
            baseModule
        }
    }
</script>
