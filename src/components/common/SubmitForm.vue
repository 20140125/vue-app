<template>
    <el-main>
        <el-button type="primary" size="medium" plain>{{ confirmButton || '确定' }}</el-button>
        <el-button type="default" size="medium" plain>{{ cancelButton || '取消' }}</el-button>
    </el-main>
</template>

<script>
export default {
    name: 'SubmitButton',
    props: ['confirmButton', 'cancelButton', 'submitForm']
}
</script>

<style scoped>

</style>
